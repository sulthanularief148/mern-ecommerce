import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
import { logger } from './logger.js';

// A single Prisma instance is reused across the process (and across hot
// reloads in dev) — creating a new PrismaClient per request/import exhausts
// MySQL's connection pool under load.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.__prisma__ ?? new PrismaClient({
    log: env.isProduction ? ['error', 'warn'] : ['warn', 'error'],
});

if (!env.isProduction) {
    globalForPrisma.__prisma__ = prisma;
}

export async function connectDatabase() {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Connected to MySQL via Prisma');
}

export async function disconnectDatabase() {
    await prisma.$disconnect();
}
