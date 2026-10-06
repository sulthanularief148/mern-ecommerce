import { prisma } from '../../config/database.js';

export const wishlistRepository = {
    findByUser(userId) {
        return prisma.wishlistItem.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    },
    findOne(userId, productId) {
        return prisma.wishlistItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });
    },
    add(userId, productId) {
        return prisma.wishlistItem.upsert({
            where: { userId_productId: { userId, productId } },
            update: {},
            create: { userId, productId },
        });
    },
    remove(userId, productId) {
        return prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    },
};
