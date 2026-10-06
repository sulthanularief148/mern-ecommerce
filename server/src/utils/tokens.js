import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { redis } from '../config/redis.js';

const REFRESH_PREFIX = 'refresh:';
const USER_TOKENS_PREFIX = 'user_tokens:';
const PASSWORD_RESET_PREFIX = 'pwreset:';
const PASSWORD_RESET_TTL_SECONDS = 30 * 60; // 30 minutes

export function signAccessToken(user) {
    return jwt.sign({ sub: user.id, role: user.role }, env.jwt.accessSecret, {
        expiresIn: env.jwt.accessExpiresIn,
    });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, env.jwt.accessSecret);
}

// Refresh tokens are opaque random strings stored server-side in Redis, not
// JWTs — validity is "does this key exist in Redis", which makes instant
// revocation (logout, password change, admin action) trivial. A JWT refresh
// token would stay "valid" per its signature until it naturally expired.
export async function issueRefreshToken(userId) {
    const token = crypto.randomBytes(48).toString('hex');
    const ttl = env.jwt.refreshExpiresInSeconds;
    await redis.set(`${REFRESH_PREFIX}${token}`, userId, 'EX', ttl);
    await redis.sadd(`${USER_TOKENS_PREFIX}${userId}`, token);
    await redis.expire(`${USER_TOKENS_PREFIX}${userId}`, ttl);
    return token;
}

export async function verifyRefreshToken(token) {
    if (!token) return null;
    const userId = await redis.get(`${REFRESH_PREFIX}${token}`);
    return userId;
}

// Rotation: every refresh consumes the old token and issues a new one, so a
// stolen-but-unused refresh token can only be replayed once before the
// legitimate client's next refresh invalidates it (a reuse-detection signal).
export async function rotateRefreshToken(oldToken, userId) {
    await revokeRefreshToken(oldToken, userId);
    return issueRefreshToken(userId);
}

export async function revokeRefreshToken(token, userId) {
    await redis.del(`${REFRESH_PREFIX}${token}`);
    if (userId) await redis.srem(`${USER_TOKENS_PREFIX}${userId}`, token);
}

export async function revokeAllUserTokens(userId) {
    const tokens = await redis.smembers(`${USER_TOKENS_PREFIX}${userId}`);
    if (tokens.length > 0) {
        await redis.del(...tokens.map((t) => `${REFRESH_PREFIX}${t}`));
    }
    await redis.del(`${USER_TOKENS_PREFIX}${userId}`);
}

// Opaque, single-use, short-lived — same "existence in Redis is validity"
// model as refresh tokens, so a reset link that's already been used or has
// expired fails cleanly with no separate revocation bookkeeping needed.
export async function issuePasswordResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`${PASSWORD_RESET_PREFIX}${token}`, userId, 'EX', PASSWORD_RESET_TTL_SECONDS);
    return token;
}

export async function verifyPasswordResetToken(token) {
    if (!token) return null;
    return redis.get(`${PASSWORD_RESET_PREFIX}${token}`);
}

export async function revokePasswordResetToken(token) {
    await redis.del(`${PASSWORD_RESET_PREFIX}${token}`);
}

export const REFRESH_COOKIE_NAME = 'refreshToken';

export function refreshCookieOptions() {
    return {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: env.jwt.refreshExpiresInSeconds * 1000,
    };
}
