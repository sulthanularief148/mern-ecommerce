import { z } from 'zod';

const optionalText = (max) => z.string().trim().max(max).optional()
    .or(z.literal('').transform(() => undefined));

const productBaseSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    description: z.string().trim().min(1, 'Description is required'),
    price: z.coerce.number().positive('Price must be a positive number'),
    compareAtPrice: z.coerce.number().positive().optional()
        .or(z.literal('').transform(() => undefined)),
    stock: z.coerce.number().int().min(0).optional(),
    category: z.string().trim().min(1, 'Category is required').max(60),
    subCategory: z.string().trim().min(1, 'Sub-category is required').max(60),
    bestseller: z.union([z.boolean(), z.string()]).optional()
        .transform((v) => v === true || v === 'true'),
    sizes: z.array(z.string().min(1)).min(1, 'At least one size is required'),
    sku: optionalText(40),
    fabric: optionalText(80),
    fabricComposition: optionalText(160),
    pattern: optionalText(60),
    color: optionalText(40),
    occasion: optionalText(60),
    collectionName: optionalText(80),
    gsm: z.coerce.number().int().positive().optional()
        .or(z.literal('').transform(() => undefined)),
    dimensions: optionalText(120),
    careInstructions: z.string().trim().max(2000).optional()
        .or(z.literal('').transform(() => undefined)),
    videoUrl: optionalText(500),
    sizeChart: z.array(z.record(z.string())).optional().nullable(),
});

export const createProductSchema = productBaseSchema.refine(
    (data) => !data.compareAtPrice || data.compareAtPrice > data.price,
    { message: 'Compare-at price must be greater than the price', path: ['compareAtPrice'] },
);

export const updateProductSchema = productBaseSchema.partial().refine(
    (data) => !data.compareAtPrice || !data.price || data.compareAtPrice > data.price,
    { message: 'Compare-at price must be greater than the price', path: ['compareAtPrice'] },
);

export const listProductsQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    category: z.string().optional(),
    subCategory: z.string().optional(),
});
