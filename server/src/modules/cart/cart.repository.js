import { prisma } from '../../config/database.js';

export const cartRepository = {
    findByUser(userId) {
        return prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'asc' },
        });
    },
    findOne(userId, productId, size) {
        return prisma.cartItem.findUnique({
            where: { userId_productId_size: { userId, productId, size } },
        });
    },
    findByIdForUser(id, userId) {
        return prisma.cartItem.findFirst({ where: { id, userId } });
    },
    upsertIncrement(userId, productId, size, incrementBy) {
        return prisma.cartItem.upsert({
            where: { userId_productId_size: { userId, productId, size } },
            update: { quantity: { increment: incrementBy } },
            create: { userId, productId, size, quantity: incrementBy },
            include: { product: true },
        });
    },
    updateQuantity(id, quantity) {
        return prisma.cartItem.update({ where: { id }, data: { quantity }, include: { product: true } });
    },
    delete(id) {
        return prisma.cartItem.delete({ where: { id } });
    },
    clearForUser(userId) {
        return prisma.cartItem.deleteMany({ where: { userId } });
    },
};
