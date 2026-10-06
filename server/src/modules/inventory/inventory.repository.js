import { prisma } from '../../config/database.js';

const LOW_STOCK_DEFAULT_THRESHOLD = 5;

export const inventoryRepository = {
    findStock({ skip, take, search } = {}) {
        const where = search
            ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] }
            : {};
        return prisma.product.findMany({
            where,
            select: {
                id: true, name: true, images: true, sku: true, category: true, subCategory: true, stock: true, price: true,
            },
            orderBy: { stock: 'asc' },
            ...(skip !== undefined ? { skip } : {}),
            ...(take !== undefined ? { take } : {}),
        });
    },
    countStock(search) {
        const where = search
            ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] }
            : {};
        return prisma.product.count({ where });
    },
    findLowStock(threshold = LOW_STOCK_DEFAULT_THRESHOLD) {
        return prisma.product.findMany({
            where: { stock: { lte: threshold } },
            select: {
                id: true, name: true, images: true, sku: true, category: true, subCategory: true, stock: true, price: true,
            },
            orderBy: { stock: 'asc' },
        });
    },
    async adjustStock({ productId, delta, reason, adjustedById }) {
        return prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) return null;

            const newStock = Math.max(product.stock + delta, 0);
            const updated = await tx.product.update({
                where: { id: productId },
                data: { stock: newStock },
            });
            await tx.stockAdjustment.create({
                data: {
                    productId, delta, reason, adjustedById,
                    previousStock: product.stock, newStock,
                },
            });
            return updated;
        });
    },
    findAdjustmentsForProduct(productId, limit = 20) {
        return prisma.stockAdjustment.findMany({
            where: { productId },
            include: { adjustedBy: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },
    findRecentAdjustments(limit = 20) {
        return prisma.stockAdjustment.findMany({
            include: {
                adjustedBy: { select: { name: true, email: true } },
                product: { select: { name: true, images: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },
};
