import { orderRepository } from './order.repository.js';
import { cartRepository } from '../cart/cart.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeOrder } from '../../utils/serialize.js';
import { createStripeSession, retrieveStripeSession } from './payment/stripe.service.js';
import { createRazorpayOrder, verifyRazorpaySignature, fetchRazorpayOrder } from './payment/razorpay.service.js';
import { DELIVERY_METHODS } from '../../constants/index.js';
import { resolveDiscount } from '../coupon/coupon.service.js';
import { couponRepository } from '../coupon/coupon.repository.js';
import { recordAudit } from '../../utils/auditLog.js';
import { sendMail } from '../../config/mailer.js';
import { orderStatusEmail } from '../../utils/emailTemplates.js';
import { logger } from '../../config/logger.js';
import { loyaltyService } from '../loyalty/loyalty.service.js';
import { settingsService } from '../settings/settings.service.js';

// Email delivery must never fail the request that triggered it — a customer
// updating their profile or an admin changing order status shouldn't 500
// because SMTP hiccuped.
async function notifyOrderStatus(order, status) {
    if (!order.user?.email) return;
    try {
        const { subject, text, html } = orderStatusEmail({ name: order.user.name, order, status });
        await sendMail({ to: order.user.email, subject, text, html });
    } catch (err) {
        logger.error(`Failed to send order status email: ${err.message}`);
    }
}

// Orders are always built from the user's server-side cart + live product
// prices — never from client-supplied items/amount/discount. Trusting client
// input for price is how you get a checkout for ₹1 on a ₹50,000 order.
async function buildOrderFromCart(userId, { couponCode, deliveryMethod, redeemPoints }) {
    const cartItems = await cartRepository.findByUser(userId);
    if (cartItems.length === 0) {
        throw ApiError.badRequest('Your cart is empty');
    }

    const items = cartItems.map((ci) => ({
        productId: ci.productId,
        name: ci.product.name,
        price: ci.product.price,
        size: ci.size,
        quantity: ci.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    let discountAmount = 0;
    let coupon = null;
    if (couponCode) {
        const resolved = await resolveDiscount(couponCode, subtotal);
        coupon = resolved.coupon;
        discountAmount = resolved.discountAmount;
    }

    // Tax rate and shipping fees come from admin-editable settings, not
    // hardcoded constants — the Settings page used to claim these were
    // "informational only" because checkout ignored them entirely.
    const settings = await settingsService.get();
    const shippingFeeFor = { STANDARD: settings.standardShippingFee, EXPRESS: settings.expressShippingFee };
    const method = DELIVERY_METHODS[deliveryMethod] ? deliveryMethod : 'STANDARD';
    const discountedSubtotal = subtotal - discountAmount;
    const shippingFee = method === 'STANDARD' && discountedSubtotal >= settings.freeShippingThreshold
        ? 0
        : shippingFeeFor[method];
    const taxAmount = Math.round(discountedSubtotal * (settings.taxRatePercent / 100) * 100) / 100;
    const preRedemptionAmount = Math.round((discountedSubtotal + taxAmount + shippingFee) * 100) / 100;

    // Points are redeemed against the final total, after coupon/tax/shipping
    // — capped so an order can never go negative even if the point value
    // would otherwise exceed what's left to pay.
    let pointsRedeemed = 0;
    let pointsDiscount = 0;
    if (redeemPoints > 0) {
        const quote = await loyaltyService.quoteRedemption(userId, redeemPoints);
        pointsDiscount = Math.min(quote.discount, preRedemptionAmount);
        pointsRedeemed = pointsDiscount === quote.discount ? quote.points : Math.floor(quote.points * (pointsDiscount / quote.discount));
    }
    const amount = Math.round((preRedemptionAmount - pointsDiscount) * 100) / 100;

    return {
        items, subtotal, discountAmount, taxAmount, shippingFee, amount, pointsRedeemed,
        couponCode: coupon?.code, couponId: coupon?.id, deliveryMethod: method,
    };
}

async function finalizeOrder({ userId, address, paymentMethod, couponCode, deliveryMethod, redeemPoints }) {
    const built = await buildOrderFromCart(userId, { couponCode, deliveryMethod, redeemPoints });
    const order = await orderRepository.createWithItems({
        userId,
        address,
        paymentMethod,
        items: built.items,
        subtotal: built.subtotal,
        discountAmount: built.discountAmount,
        taxAmount: built.taxAmount,
        shippingFee: built.shippingFee,
        amount: built.amount,
        couponCode: built.couponCode,
        deliveryMethod: built.deliveryMethod,
        pointsRedeemed: built.pointsRedeemed,
    });
    if (built.couponId) {
        await couponRepository.incrementUsage(built.couponId);
    }
    if (built.pointsRedeemed > 0) {
        await loyaltyService.deductRedeemedPoints(userId, built.pointsRedeemed, order.id);
    }
    return order;
}

export const orderService = {
    async placeOrderCOD(userId, { address, couponCode, deliveryMethod, redeemPoints }) {
        const order = await finalizeOrder({ userId, address, paymentMethod: 'COD', couponCode, deliveryMethod, redeemPoints });
        await cartRepository.clearForUser(userId);
        return serializeOrder(order);
    },

    async placeOrderStripe(userId, { address, couponCode, deliveryMethod, redeemPoints }, origin) {
        const order = await finalizeOrder({ userId, address, paymentMethod: 'STRIPE', couponCode, deliveryMethod, redeemPoints });
        const session = await createStripeSession({ order, origin });
        await orderRepository.setStripeSessionId(order.id, session.id);
        return { orderId: order.id, sessionUrl: session.url };
    },

    async placeOrderRazorpay(userId, { address, couponCode, deliveryMethod, redeemPoints }) {
        const order = await finalizeOrder({ userId, address, paymentMethod: 'RAZORPAY', couponCode, deliveryMethod, redeemPoints });
        const rpOrder = await createRazorpayOrder(order);
        return { order: rpOrder, orderId: order.id };
    },

    // The client used to just tell us whether the payment succeeded (a
    // `success` boolean lifted straight from its own URL query string) and
    // we trusted it — meaning anyone could mark any of their own orders paid
    // by editing the address bar. Payment status now comes only from asking
    // Stripe directly, using the session id we stored server-side when the
    // session was created.
    async verifyStripe(userId, { orderId }) {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        if (order.userId !== userId) throw ApiError.forbidden('Not authorized for this order');
        if (order.payment) return { paid: true };
        if (!order.stripeSessionId) throw ApiError.badRequest('No payment session for this order');

        const session = await retrieveStripeSession(order.stripeSessionId);
        if (session.payment_status === 'paid') {
            const paid = await orderRepository.markPaid(orderId, session.payment_intent);
            await cartRepository.clearForUser(userId);
            await loyaltyService.processOrderEarning(paid);
            return { paid: true };
        }
        if (session.status === 'expired') {
            if (order.pointsRedeemed > 0) {
                await loyaltyService.refundRedeemedPoints(order.userId, order.pointsRedeemed, order.id);
            }
            await orderRepository.deleteById(orderId);
        }
        return { paid: false };
    },

    // Idempotent: Stripe retries webhook deliveries, and a user's own
    // /verify/stripe poll can race with it, so this is safe to run twice for
    // the same session.
    async confirmStripePayment(sessionId, paymentIntentId) {
        const order = await orderRepository.findByStripeSessionId(sessionId);
        if (!order || order.payment) return;
        const paid = await orderRepository.markPaid(order.id, paymentIntentId);
        await cartRepository.clearForUser(order.userId);
        await loyaltyService.processOrderEarning(paid);
    },

    async verifyRazorpay(userId, payload) {
        if (!verifyRazorpaySignature(payload)) {
            throw ApiError.badRequest('Payment verification failed');
        }

        const rpOrder = await fetchRazorpayOrder(payload.razorpay_order_id);
        const order = await orderRepository.findById(rpOrder.receipt);
        if (!order) throw ApiError.notFound('Order not found');
        if (order.userId !== userId) throw ApiError.forbidden('Not authorized for this order');

        if (rpOrder.status !== 'paid') {
            return { paid: false };
        }

        const paid = await orderRepository.markPaid(order.id, payload.razorpay_payment_id);
        await cartRepository.clearForUser(userId);
        await loyaltyService.processOrderEarning(paid);
        return { paid: true };
    },

    async getOne(userId, orderId) {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        if (order.userId !== userId) throw ApiError.forbidden('Not authorized for this order');
        return serializeOrder(order);
    },

    async listForUser(userId) {
        const orders = await orderRepository.findByUser(userId);
        return orders.map(serializeOrder);
    },

    async listAll() {
        const orders = await orderRepository.findAll();
        return orders.map(serializeOrder);
    },

    // Setting a tracking number is, in practice, "this order shipped" — so
    // one click here also advances the status instead of making the admin
    // separately flip status to SHIPPED afterward.
    async updateTracking(orderId, { trackingNumber, carrier, trackingUrl }, actorId) {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');

        await orderRepository.setTracking(orderId, { trackingNumber, carrier, trackingUrl });
        let updated = order;
        if (trackingNumber && (order.status === 'ORDER_PLACED' || order.status === 'PACKING')) {
            updated = await orderRepository.updateStatus(orderId, 'SHIPPED');
            await notifyOrderStatus({ ...order, trackingNumber, carrier }, 'SHIPPED');
        }
        await recordAudit({
            actorId, action: 'order.tracking_update', targetType: 'order', targetId: orderId,
            metadata: { trackingNumber, carrier },
        });
        return serializeOrder({ ...updated, items: order.items, trackingNumber, carrier, trackingUrl });
    },

    async updateStatus(orderId, status, actorId) {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        let updated = await orderRepository.updateStatus(orderId, status);

        if (status !== order.status) {
            await notifyOrderStatus(order, status);

            if (status === 'DELIVERED') {
                // COD is never marked paid anywhere upstream (there's no
                // gateway confirmation for it) — delivery is the actual
                // moment COD payment is realized, so this is also where it
                // finally flips `payment` true, not just where points are earned.
                if (order.paymentMethod === 'COD' && !order.payment) {
                    updated = await orderRepository.markPaid(orderId);
                }
                await loyaltyService.processOrderEarning(updated);
                // processOrderEarning flips pointsEarned in the DB but
                // `updated` was captured before that write — refetch so the
                // response this returns doesn't echo a stale false.
                updated = { ...updated, pointsEarned: true };
            } else if (status === 'CANCELLED' && order.pointsRedeemed > 0) {
                await loyaltyService.refundRedeemedPoints(order.userId, order.pointsRedeemed, orderId);
            }
        }

        await recordAudit({
            actorId, action: 'order.status_update', targetType: 'order', targetId: orderId,
            metadata: { from: order.status, to: status },
        });
        return serializeOrder({ ...updated, items: order.items });
    },
};
