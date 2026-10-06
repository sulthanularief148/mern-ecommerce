import { prisma } from '../../config/database.js';

const LOW_STOCK_THRESHOLD = 5;
const ACTIVE_STATUSES = ['ORDER_PLACED', 'PACKING', 'SHIPPED', 'OUT_FOR_DELIVERY'];

export const dashboardService = {
    async summary() {
        const [
            revenueAgg, totalOrders, totalCustomers, totalProducts,
            lowStockCount, pendingOrders, recentOrders, revenueRows, topProductRows,
        ] = await Promise.all([
            prisma.order.aggregate({ _sum: { amount: true }, where: { status: { not: 'CANCELLED' } } }),
            prisma.order.count(),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.product.count(),
            prisma.product.count({ where: { stock: { lte: LOW_STOCK_THRESHOLD } } }),
            prisma.order.count({ where: { status: { in: ACTIVE_STATUSES } } }),
            prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: { select: { name: true, email: true } } },
            }),
            prisma.$queryRaw`
                SELECT DATE(createdAt) as day, SUM(amount) as revenue
                FROM orders
                WHERE status != 'CANCELLED' AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(createdAt)
                ORDER BY day ASC
            `,
            prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),
        ]);

        const productIds = topProductRows.map((r) => r.productId);
        const products = productIds.length
            ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, images: true, price: true } })
            : [];
        const productById = new Map(products.map((p) => [p.id, p]));

        const revenueByDay = new Map(
            revenueRows.map((r) => [new Date(r.day).toISOString().slice(0, 10), Number(r.revenue)]),
        );
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = d.toISOString().slice(0, 10);
            return { date: key, revenue: revenueByDay.get(key) || 0 };
        });

        return {
            totalRevenue: Number(revenueAgg._sum.amount || 0),
            totalOrders,
            totalCustomers,
            totalProducts,
            lowStockCount,
            pendingOrders,
            recentOrders: recentOrders.map((o) => ({
                id: o.id, amount: Number(o.amount), status: o.status, createdAt: o.createdAt,
                customerName: o.user?.name, customerEmail: o.user?.email,
            })),
            revenueLast7Days: last7Days,
            topProducts: topProductRows.map((r) => ({
                product: productById.get(r.productId),
                quantitySold: r._sum.quantity,
            })).filter((r) => r.product),
        };
    },
};
