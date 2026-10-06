import { prisma } from '../../config/database.js';

export const questionRepository = {
    create(data) {
        return prisma.productQuestion.create({ data });
    },
    findById(id) {
        return prisma.productQuestion.findUnique({
            where: { id },
            include: { user: { select: { name: true, email: true } } },
        });
    },
    findAnsweredForProduct(productId) {
        return prisma.productQuestion.findMany({
            where: { productId, answer: { not: null } },
            include: { user: { select: { name: true } } },
            orderBy: { answeredAt: 'desc' },
        });
    },
    findAllForAdmin() {
        return prisma.productQuestion.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, images: true } },
            },
            orderBy: [{ answer: 'asc' }, { createdAt: 'desc' }],
        });
    },
    answer(id, answer) {
        return prisma.productQuestion.update({ where: { id }, data: { answer, answeredAt: new Date() } });
    },
};
