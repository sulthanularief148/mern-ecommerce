import { ApiError } from '../utils/ApiError.js';

// Validates req.body (default) against a zod schema and replaces it with the
// parsed/coerced result, so controllers can trust the shape of what they read.
export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);
        }
        req.body = result.data;
        next();
    };
}

export function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);
        }
        req.validatedQuery = result.data;
        next();
    };
}
