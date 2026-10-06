import { verifyAccessToken } from '../utils/tokens.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Populates req.user = { id, role } from a valid Bearer access token.
export const requireAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        throw ApiError.unauthorized('No token provided');
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch {
        throw ApiError.unauthorized('Access token is invalid or expired');
    }
});

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

export const requireAdmin = (req, res, next) => {
    if (!req.user || !ADMIN_ROLES.has(req.user.role)) {
        throw ApiError.forbidden('Admin access required');
    }
    next();
};

// For the highest-risk surface only (granting/revoking admin access) — a
// regular ADMIN can run the store but can't create or remove other admins.
export const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        throw ApiError.forbidden('Super admin access required');
    }
    next();
};
