import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

export const redis = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 200, 2000),
    lazyConnect: true,
});

redis.on('error', (err) => logger.error(`Redis error: ${err.message}`));
redis.on('connect', () => logger.info('Connected to Redis'));

export async function connectRedis() {
    if (redis.status === 'ready' || redis.status === 'connecting') return;
    await redis.connect();
}
