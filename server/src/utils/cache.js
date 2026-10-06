import { redis } from '../config/redis.js';
import { logger } from '../config/logger.js';

const DEFAULT_TTL_SECONDS = 300; // 5 minutes — product catalog doesn't change often

// Cache-aside: try Redis first, fall back to the DB loader on a miss (or if
// Redis itself is unreachable — caching must never be a hard dependency for
// reads to work, only for reads to be fast).
export async function cached(key, loader, ttlSeconds = DEFAULT_TTL_SECONDS) {
    try {
        const hit = await redis.get(key);
        if (hit) return JSON.parse(hit);
    } catch (err) {
        logger.warn(`Cache read failed for ${key}: ${err.message}`);
    }

    const fresh = await loader();

    try {
        await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
    } catch (err) {
        logger.warn(`Cache write failed for ${key}: ${err.message}`);
    }

    return fresh;
}

export async function invalidateByPrefix(prefix) {
    try {
        const stream = redis.scanStream({ match: `${prefix}*`, count: 100 });
        const keysToDelete = [];
        for await (const keys of stream) {
            keysToDelete.push(...keys);
        }
        if (keysToDelete.length > 0) {
            await redis.del(...keysToDelete);
        }
    } catch (err) {
        logger.warn(`Cache invalidation failed for prefix ${prefix}: ${err.message}`);
    }
}

export const CACHE_KEYS = {
    PRODUCT_LIST: 'cache:products:list',
    PRODUCT_ITEM: (id) => `cache:products:item:${id}`,
    PRODUCT_PREFIX: 'cache:products:',
    BANNERS_SLOT: (slot) => `cache:banners:slot:${slot}`,
    BANNERS_PREFIX: 'cache:banners:',
    COLLECTIONS_LIST: 'cache:collections:list',
    COLLECTIONS_PREFIX: 'cache:collections:',
};
