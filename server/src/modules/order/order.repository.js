import { prisma } from '../../config/database.js';

export const orderRepository = {
    createWithItems({
        userId, amount, subtotal, discountAmount, taxAmount, shippingFee,
        couponCode, deliveryMethod, address, paymentMethod, items, pointsRedeemed,
    }) {
        return prisma.order.create({
            data: {
                userId,
                amount,
                subtotal,
                discountAmount,
                taxAmount,
                shippingFee,
                couponCode,
                deliveryMethod,
                address,
                paymentMethod,
                pointsRedeemed: pointsRedeemed || 0,
                items: { create: items },
            },
            include: { items: { include: { product: { select: { images: true } } } } },
        });
    },
    findById(id) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: { select: { images: true } } } },
                user: { select: { name: true, email: true } },
            },
        });
    },
    findByStripeSessionId(stripeSessionId) {
        return prisma.order.findFirst({ where: { stripeSessionId } });
    },
    setStripeSessionId(id, stripeSessionId) {
        return prisma.order.update({ where: { id }, data: { stripeSessionId } });
    },
    findByUser(userId) {
        return prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: { select: { images: true } } } } },
            orderBy: { createdAt: 'desc' },
        });
    },
    findAll() {
        return prisma.order.findMany({
            include: {
                items: { include: { product: { select: { images: true } } } },
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    markPaid(id, paymentRef) {
        return prisma.order.update({ where: { id }, data: { payment: true, ...(paymentRef ? { paymentRef } : {}) } });
    },
    updateStatus(id, status) {
        return prisma.order.update({ where: { id }, data: { status } });
    },
    setTracking(id, { trackingNumber, carrier, trackingUrl }) {
        return prisma.order.update({ where: { id }, data: { trackingNumber, carrier, trackingUrl } });
    },
    deleteById(id) {
        return prisma.order.delete({ where: { id } }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
};
