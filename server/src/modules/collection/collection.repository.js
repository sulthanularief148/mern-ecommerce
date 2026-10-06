import { prisma } from '../../config/database.js';

export const collectionRepository = {
    findAll() {
        return prisma.collection.findMany({ orderBy: { sortOrder: 'asc' } });
    },
    findActive() {
        return prisma.collection.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
    },
    findByName(name) {
        return prisma.collection.findUnique({ where: { name } });
    },
    create(data) {
        return prisma.collection.create({ data });
    },
    update(id, data) {
        return prisma.collection.update({ where: { id }, data }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
    deleteById(id) {
        return prisma.collection.delete({ where: { id } }).catch((err) => {
            if (err.code === 'P2025') return null;
            throw err;
        });
    },
    productCount(name) {
        return prisma.product.count({ where: { collectionName: name } });
    },
};
