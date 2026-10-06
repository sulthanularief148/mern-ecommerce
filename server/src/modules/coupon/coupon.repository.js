import { prisma } from '../../config/database.js';

export const couponRepository = {
    findByCode(code) {
        return prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    },
    findAll() {
        return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    },
    create(data) {
        return prisma.coupon.create({ data });
    },
    update(id, data) {
        return prisma.coupon.update({ where: { id }, data }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
    deleteById(id) {
        return prisma.coupon.delete({ where: { id } }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
    incrementUsage(id) {
        return prisma.coupon.update({ where: { id }, data: { timesUsed: { increment: 1 } } });
    },
};
