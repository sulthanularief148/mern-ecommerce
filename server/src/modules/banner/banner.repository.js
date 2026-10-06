import { prisma } from '../../config/database.js';

export const bannerRepository = {
    findAll() {
        return prisma.banner.findMany({ orderBy: [{ slot: 'asc' }, { sortOrder: 'asc' }] });
    },
    findActiveBySlot(slot) {
        return prisma.banner.findMany({
            where: { slot, active: true },
            orderBy: { sortOrder: 'asc' },
        });
    },
    findById(id) {
        return prisma.banner.findUnique({ where: { id } });
    },
    create(data) {
        return prisma.banner.create({ data });
    },
    update(id, data) {
        return prisma.banner.update({ where: { id }, data }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
    deleteById(id) {
        return prisma.banner.delete({ where: { id } }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
};
