import Stripe from 'stripe';
import { env } from '../../../config/env.js';
import { CURRENCY } from '../../../constants/index.js';

const stripe = new Stripe(env.stripe.apiKey);

export async function createStripeSession({ order, origin }) {
    const line_items = order.items.map((item) => ({
        price_data: {
            currency: CURRENCY,
            product_data: { name: item.name },
            unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
    }));

    if (Number(order.shippingFee) > 0) {
        line_items.push({
            price_data: {
                currency: CURRENCY,
                product_data: { name: 'Delivery Charges' },
                unit_amount: Math.round(Number(order.shippingFee) * 100),
            },
            quantity: 1,
        });
    }

    if (Number(order.taxAmount) > 0) {
        line_items.push({
            price_data: {
                currency: CURRENCY,
                product_data: { name: 'Tax' },
                unit_amount: Math.round(Number(order.taxAmount) * 100),
            },
            quantity: 1,
        });
    }

    // Stripe line items can't carry a negative unit_amount, so a coupon
    // discount has to be applied via a one-time Stripe coupon + `discounts`
    // instead of an itemized negative line.
    let discounts;
    if (Number(order.discountAmount) > 0) {
        const stripeCoupon = await stripe.coupons.create({
            amount_off: Math.round(Number(order.discountAmount) * 100),
            currency: CURRENCY,
            duration: 'once',
            name: order.couponCode ? `Coupon ${order.couponCode}` : 'Discount',
        });
        discounts = [{ coupon: stripeCoupon.id }];
    }

    return stripe.checkout.sessions.create({
        // No ?success=true in these URLs on purpose — the client used to read
        // that flag straight off the query string and pass it back to
        // /verify/stripe, which the server then trusted verbatim, letting
        // anyone mark their own order paid by editing the address bar. The
        // server now looks up payment_status from Stripe itself instead.
        success_url: `${origin}/verify?orderId=${order.id}`,
        cancel_url: `${origin}/verify?orderId=${order.id}`,
        line_items,
        ...(discounts ? { discounts } : {}),
        mode: 'payment',
        metadata: { orderId: order.id },
    });
}

export function retrieveStripeSession(sessionId) {
    return stripe.checkout.sessions.retrieve(sessionId);
}

export function constructStripeWebhookEvent(rawBody, signature) {
    return stripe.webhooks.constructEvent(rawBody, signature, env.stripe.webhookSecret);
}
