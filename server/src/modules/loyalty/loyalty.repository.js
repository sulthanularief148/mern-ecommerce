import { prisma } from '../../config/database.js';

export const loyaltyRepository = {
    findByReferralCode(code) {
        return prisma.user.findUnique({ where: { referralCode: code } });
    },
    findUserById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, loyaltyPoints: true, referredById: true },
        });
    },
    // Ledger entry + denormalized balance update happen atomically — a
    // crash between the two would otherwise leave the running total
    // (User.loyaltyPoints) out of sync with its own history.
    async adjustBalance(userId, points, reason, orderId) {
        return prisma.$transaction([
            prisma.pointsLedgerEntry.create({ data: { userId, points, reason, orderId } }),
            prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { increment: points } } }),
        ]);
    },
    getLedger(userId) {
        return prisma.pointsLedgerEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    },
    countPaidOrders(userId, excludeOrderId) {
        return prisma.order.count({ where: { userId, pointsEarned: true, id: { not: excludeOrderId } } });
    },
    markPointsEarned(orderId) {
        return prisma.order.update({ where: { id: orderId }, data: { pointsEarned: true } });
    },
};
