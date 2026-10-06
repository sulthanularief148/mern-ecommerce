import { z } from 'zod';

export const createReturnSchema = z.object({
    orderId: z.string().min(1),
    reason: z.string().trim().min(10, 'Please describe the reason in a bit more detail').max(500),
});

export const updateReturnSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'COMPLETED']),
    adminNote: z.string().trim().max(500).optional().or(z.literal('').transform(() => undefined)),
});
