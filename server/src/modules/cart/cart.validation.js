import { z } from 'zod';

export const addCartItemSchema = z.object({
    productId: z.string().min(1, 'productId is required'),
    size: z.string().min(1, 'size is required'),
    quantity: z.coerce.number().int().positive().max(50).optional().default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.coerce.number().int().min(0).max(50),
});
