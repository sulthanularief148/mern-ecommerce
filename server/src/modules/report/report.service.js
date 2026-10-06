import { prisma } from '../../config/database.js';

export const reportService = {
    async sales({ days = 30 } = {}) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        since.setHours(0, 0, 0, 0);

        const [byDay, totals, byPaymentMethod, byDeliveryMethod] = await Promise.all([
            prisma.$queryRaw`
                SELECT DATE(createdAt) as day, SUM(amount) as revenue, COUNT(*) as orders
                FROM orders
                WHERE status != 'CANCELLED' AND createdAt >= ${since}
                GROUP BY DATE(createdAt)
                ORDER BY day ASC
            `,
            prisma.order.aggregate({
                _sum: { amount: true, discountAmount: true, taxAmount: true, shippingFee: true },
                _count: true,
                where: { status: { not: 'CANCELLED' } },
            }),
            prisma.order.groupBy({
                by: ['paymentMethod'],
                _sum: { amount: true },
                _count: true,
                where: { status: { not: 'CANCELLED' } },
            }),
            prisma.order.groupBy({
                by: ['deliveryMethod'],
                _sum: { amount: true },
                _count: true,
                where: { status: { not: 'CANCELLED' } },
            }),
        ]);

        return {
            byDay: byDay.map((r) => ({ date: new Date(r.day).toISOString().slice(0, 10), revenue: Number(r.revenue), orders: Number(r.orders) })),
            totalRevenue: Number(totals._sum.amount || 0),
            totalDiscounts: Number(totals._sum.discountAmount || 0),
            totalTax: Number(totals._sum.taxAmount || 0),
            totalShipping: Number(totals._sum.shippingFee || 0),
            totalOrders: totals._count,
            byPaymentMethod: byPaymentMethod.map((r) => ({ method: r.paymentMethod, revenue: Number(r._sum.amount || 0), orders: r._count })),
            byDeliveryMethod: byDeliveryMethod.map((r) => ({ method: r.deliveryMethod, revenue: Number(r._sum.amount || 0), orders: r._count })),
        };
    },

    async products({ limit = 10 } = {}) {
        const [topByQty, byCategory, noSalesCount, totalProducts] = await Promise.all([
            prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true, price: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: limit,
            }),
            prisma.product.groupBy({ by: ['category'], _count: true, _sum: { stock: true } }),
            prisma.product.count({ where: { orderItems: { none: {} } } }),
            prisma.product.count(),
        ]);

        const productIds = topByQty.map((r) => r.productId);
        const products = productIds.length
            ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, images: true, price: true, category: true } })
            : [];
        const productById = new Map(products.map((p) => [p.id, p]));

        return {
            topSelling: topByQty.map((r) => ({
                product: productById.get(r.productId),
                quantitySold: r._sum.quantity,
                revenue: Number(r._sum.price || 0) * r._sum.quantity,
            })).filter((r) => r.product),
            byCategory: byCategory.map((r) => ({ category: r.category, productCount: r._count, totalStock: r._sum.stock || 0 })),
            productsWithNoSales: noSalesCount,
            totalProducts,
        };
    },

    async customers({ days = 30 } = {}) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        since.setHours(0, 0, 0, 0);

        const [newCustomersByDay, topSpenders, totalCustomers, repeatCustomers] = await Promise.all([
            prisma.$queryRaw`
                SELECT DATE(createdAt) as day, COUNT(*) as count
                FROM users
                WHERE role = 'CUSTOMER' AND createdAt >= ${since}
                GROUP BY DATE(createdAt)
                ORDER BY day ASC
            `,
            prisma.order.groupBy({
                by: ['userId'],
                _sum: { amount: true },
                _count: true,
                orderBy: { _sum: { amount: 'desc' } },
                take: 10,
            }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.$queryRaw`
                SELECT COUNT(*) as count FROM (
                    SELECT userId FROM orders GROUP BY userId HAVING COUNT(*) > 1
                ) as repeat_buyers
            `,
        ]);

        const userIds = topSpenders.map((r) => r.userId);
        const users = userIds.length
            ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
            : [];
        const userById = new Map(users.map((u) => [u.id, u]));

        return {
            newCustomersByDay: newCustomersByDay.map((r) => ({ date: new Date(r.day).toISOString().slice(0, 10), count: Number(r.count) })),
            topSpenders: topSpenders.map((r) => ({
                customer: userById.get(r.userId),
                totalSpend: Number(r._sum.amount || 0),
                orderCount: r._count,
            })).filter((r) => r.customer),
            totalCustomers,
            repeatCustomers: Number(repeatCustomers[0]?.count || 0),
        };
    },

    async inventory() {
        const [stockValueRows, lowStock, outOfStock, byCategory] = await Promise.all([
            prisma.product.findMany({ select: { price: true, stock: true } }),
            prisma.product.count({ where: { stock: { gt: 0, lte: 5 } } }),
            prisma.product.count({ where: { stock: 0 } }),
            prisma.product.groupBy({ by: ['category'], _sum: { stock: true }, _count: true }),
        ]);

        const totalStockValue = stockValueRows.reduce((sum, p) => sum + Number(p.price) * p.stock, 0);
        const totalUnits = stockValueRows.reduce((sum, p) => sum + p.stock, 0);

        return {
            totalStockValue,
            totalUnits,
            lowStockCount: lowStock,
            outOfStockCount: outOfStock,
            byCategory: byCategory.map((r) => ({ category: r.category, units: r._sum.stock || 0, productCount: r._count })),
        };
    },
};
