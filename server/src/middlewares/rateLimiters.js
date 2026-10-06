import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';

// Backing rate limits with Redis (instead of express-rate-limit's default
// in-memory store) means the limits are shared and correct across every
// container/instance behind the load balancer, not reset per-instance.
const redisStoreFor = (prefix) => new RedisStore({
    prefix,
    sendCommand: (...args) => redis.call(...args),
});

const baseOptions = {
    standardHeaders: true,
    legacyHeaders: false,
};

export const globalLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 300,
    store: redisStoreFor('rl:global:'),
});

export const authLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 10,
    store: redisStoreFor('rl:auth:'),
    message: { success: false, message: 'Too many attempts. Please try again later.' },
});

export const paymentLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 30,
    store: redisStoreFor('rl:payment:'),
});

// Public, unauthenticated, and triggers a real email send per request —
// a tighter limit than auth's since there's no login attempt to slow an
// attacker down otherwise.
export const contactLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 5,
    store: redisStoreFor('rl:contact:'),
    message: { success: false, message: 'Too many messages sent. Please try again later.' },
});
