import { prisma } from '../../config/database.js';

export const reviewRepository = {
    findByProduct(productId) {
        return prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    },
    findOne(userId, productId) {
        return prisma.review.findUnique({ where: { userId_productId: { userId, productId } } });
    },
    upsert(userId, productId, { rating, comment }) {
        return prisma.review.upsert({
            where: { userId_productId: { userId, productId } },
            update: { rating, comment },
            create: { userId, productId, rating, comment },
        });
    },
    aggregateForProduct(productId) {
        return prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        });
    },
    aggregateForProducts(productIds) {
        return prisma.review.groupBy({
            by: ['productId'],
            where: { productId: { in: productIds } },
            _avg: { rating: true },
            _count: { rating: true },
        });
    },

    findAllForAdmin({ skip, take } = {}) {
        return prisma.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, images: true } },
            },
            orderBy: { createdAt: 'desc' },
            ...(skip !== undefined ? { skip } : {}),
            ...(take !== undefined ? { take } : {}),
        });
    },
    countAll() {
        return prisma.review.count();
    },
    deleteById(id) {
        return prisma.review.delete({ where: { id } }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
};
