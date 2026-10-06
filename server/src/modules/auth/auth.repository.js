import { prisma } from '../../config/database.js';

export const authRepository = {
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    findById(id) {
        return prisma.user.findUnique({ where: { id } });
    },
    create({ name, email, passwordHash, role = 'CUSTOMER', referralCode, referredById }) {
        return prisma.user.create({
            data: { name, email, password: passwordHash, role, referralCode, referredById },
        });
    },
    updateName(id, name) {
        return prisma.user.update({ where: { id }, data: { name } });
    },
    updatePassword(id, passwordHash) {
        return prisma.user.update({ where: { id }, data: { password: passwordHash } });
    },
    stats(id) {
        return Promise.all([
            prisma.order.count({ where: { userId: id } }),
            prisma.wishlistItem.count({ where: { userId: id } }),
            prisma.review.count({ where: { userId: id } }),
        ]).then(([orders, wishlist, reviews]) => ({ orders, wishlist, reviews }));
    },
};
