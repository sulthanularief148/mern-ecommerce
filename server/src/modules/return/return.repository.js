import { prisma } from '../../config/database.js';

export const returnRepository = {
    create(data) {
        return prisma.returnRequest.create({ data });
    },
    findById(id) {
        return prisma.returnRequest.findUnique({
            where: { id },
            include: { order: true, user: { select: { name: true, email: true } } },
        });
    },
    findOpenForOrder(orderId) {
        return prisma.returnRequest.findFirst({
            where: { orderId, status: { in: ['REQUESTED', 'APPROVED'] } },
        });
    },
    findByUser(userId) {
        return prisma.returnRequest.findMany({
            where: { userId },
            include: { order: { select: { id: true, amount: true, createdAt: true } } },
            orderBy: { createdAt: 'desc' },
        });
    },
    findAll() {
        return prisma.returnRequest.findMany({
            include: {
                order: { select: { id: true, amount: true, createdAt: true } },
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    updateStatus(id, status, adminNote) {
        return prisma.returnRequest.update({
            where: { id },
            data: { status, ...(adminNote !== undefined ? { adminNote } : {}) },
        });
    },
};
