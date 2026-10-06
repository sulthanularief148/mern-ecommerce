import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { captureException } from '../config/sentry.js';

export function notFoundHandler(req, res) {
    res.status(404).json({ success: false, message: 'Route not found' });
}

// Centralized error handler — every thrown/rejected error in the app funnels
// here (via asyncHandler), so this is the one place that decides what a
// client is allowed to see vs what only gets logged.
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    if (err instanceof ApiError) {
        if (err.statusCode >= 500) {
            logger.error(err.stack || err.message);
            captureException(err);
        }
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details ? { errors: err.details } : {}),
        });
    }

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ success: false, message: 'Not allowed by CORS' });
    }

    if (err.code === 'P2002') { // Prisma unique constraint violation
        return res.status(409).json({ success: false, message: 'A record with this value already exists' });
    }
    if (err.code === 'P2025') { // Prisma "record not found"
        return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Request payload too large' });
    }

    logger.error(err.stack || err.message);
    captureException(err);
    res.status(500).json({
        success: false,
        message: env.isProduction ? 'Internal server error' : err.message,
    });
}
