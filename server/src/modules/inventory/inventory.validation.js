import { z } from 'zod';

export const stockQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().max(200).optional(),
});

export const lowStockQuerySchema = z.object({
    threshold: z.coerce.number().int().min(0).optional(),
});

export const adjustStockSchema = z.object({
    productId: z.string().min(1),
    delta: z.coerce.number().int().refine((v) => v !== 0, 'Delta cannot be zero'),
    reason: z.string().trim().min(1, 'Reason is required').max(200),
});
