import { z } from 'zod';

export const quoteRedemptionSchema = z.object({
    points: z.coerce.number().int().positive(),
});

export const adminAdjustSchema = z.object({
    userId: z.string().min(1),
    points: z.coerce.number().int().refine((v) => v !== 0, 'Points must be non-zero'),
    reason: z.string().trim().max(100).optional(),
});
