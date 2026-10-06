import { prisma } from '../../config/database.js';

export const customerRepository = {
    findAll({ skip, take, search } = {}) {
        const where = {
            role: 'CUSTOMER',
            ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] } : {}),
        };
        return prisma.user.findMany({
            where,
            select: {
                id: true, name: true, email: true, createdAt: true,
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: 'desc' },
            ...(skip !== undefined ? { skip } : {}),
            ...(take !== undefined ? { take } : {}),
        });
    },
    count(search) {
        const where = {
            role: 'CUSTOMER',
            ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] } : {}),
        };
        return prisma.user.count({ where });
    },
    spendTotals(userIds) {
        return prisma.order.groupBy({
            by: ['userId'],
            where: { userId: { in: userIds } },
            _sum: { amount: true },
        });
    },
    findDetail(id) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, role: true, createdAt: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    select: { id: true, amount: true, status: true, createdAt: true, paymentMethod: true },
                },
            },
        });
    },
};
