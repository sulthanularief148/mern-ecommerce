import { z } from 'zod';

export const createCollectionSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(80),
    description: z.string().trim().max(300).optional().or(z.literal('').transform(() => undefined)),
    imageUrl: z.string().trim().url('Must be a valid URL').max(500).optional().or(z.literal('').transform(() => undefined)),
    sortOrder: z.coerce.number().int().optional(),
    active: z.boolean().optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();
