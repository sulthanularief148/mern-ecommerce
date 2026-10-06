import { z } from 'zod';

export const createBannerSchema = z.object({
    slot: z.enum(['HERO', 'PROMO', 'EDITORS_PICK']),
    title: z.string().trim().min(1, 'Title is required').max(160),
    subtitle: z.string().trim().max(300).optional().or(z.literal('').transform(() => undefined)),
    imageUrl: z.string().trim().url('Must be a valid URL').max(500),
    linkUrl: z.string().trim().max(300).optional().or(z.literal('').transform(() => undefined)),
    ctaLabel: z.string().trim().max(60).optional().or(z.literal('').transform(() => undefined)),
    sortOrder: z.coerce.number().int().optional(),
    active: z.boolean().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();
