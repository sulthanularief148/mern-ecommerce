import { prisma } from '../../config/database.js';

export const productRepository = {
    findAll({ skip, take } = {}) {
        return prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            ...(skip !== undefined ? { skip } : {}),
            ...(take !== undefined ? { take } : {}),
        });
    },
    count() {
        return prisma.product.count();
    },
    findById(id) {
        return prisma.product.findUnique({ where: { id } });
    },
    findBySku(sku) {
        return prisma.product.findUnique({ where: { sku } });
    },
    create(data) {
        return prisma.product.create({ data });
    },
    update(id, data) {
        return prisma.product.update({ where: { id }, data }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
    deleteById(id) {
        return prisma.product.delete({ where: { id } }).catch((err) => {
            if (err.code === 'P2025') return null; // already gone
            throw err;
        });
    },

    // Co-purchase heuristic: products that showed up in the same past orders
    // as this one, ranked by how often that happened.
    async findCoPurchased(productId, limit) {
        const coOrders = await prisma.orderItem.findMany({
            where: { productId },
            select: { orderId: true },
        });
        const orderIds = [...new Set(coOrders.map((o) => o.orderId))];
        if (orderIds.length === 0) return [];

        const counts = await prisma.orderItem.groupBy({
            by: ['productId'],
            where: { orderId: { in: orderIds }, productId: { not: productId } },
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: limit,
        });
        if (counts.length === 0) return [];

        const products = await prisma.product.findMany({ where: { id: { in: counts.map((c) => c.productId) } } });
        const rank = new Map(counts.map((c, i) => [c.productId, i]));
        return products.sort((a, b) => rank.get(a.id) - rank.get(b.id));
    },

    findSameCategory({ category, subCategory, excludeId, limit }) {
        return prisma.product.findMany({
            where: { category, subCategory, id: { not: excludeId } },
            orderBy: [{ bestseller: 'desc' }, { createdAt: 'desc' }],
            take: limit,
        });
    },
};
