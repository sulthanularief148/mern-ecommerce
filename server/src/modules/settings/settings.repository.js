import { prisma } from '../../config/database.js';

const SETTINGS_KEY = 'store';

export const settingsRepository = {
    find() {
        return prisma.storeSetting.findUnique({ where: { key: SETTINGS_KEY } });
    },
    upsert(value) {
        return prisma.storeSetting.upsert({
            where: { key: SETTINGS_KEY },
            update: { value },
            create: { key: SETTINGS_KEY, value },
        });
    },
};
