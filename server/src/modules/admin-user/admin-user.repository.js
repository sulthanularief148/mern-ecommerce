import { prisma } from '../../config/database.js';

export const adminUserRepository = {
    findAllAdmins() {
        return prisma.user.findMany({
            where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
    },
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    setRole(id, role) {
        return prisma.user.update({ where: { id }, data: { role } });
    },
    countAdmins() {
        return prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } });
    },
};
