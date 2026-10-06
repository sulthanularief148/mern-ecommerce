import { z } from 'zod';

export const applyDiscountSchema = z.object({
    scope: z.enum(['ALL', 'CATEGORY', 'SUBCATEGORY', 'PRODUCTS']),
    scopeValue: z.string().trim().max(60).optional(),
    productIds: z.array(z.string()).optional(),
    type: z.enum(['PERCENT', 'FLAT']),
    value: z.coerce.number().positive(),
}).refine((data) => data.scope !== 'PRODUCTS' || (data.productIds && data.productIds.length > 0), {
    message: 'productIds is required when scope is PRODUCTS',
    path: ['productIds'],
}).refine((data) => data.scope === 'ALL' || data.scope === 'PRODUCTS' || Boolean(data.scopeValue), {
    message: 'scopeValue is required for CATEGORY/SUBCATEGORY scope',
    path: ['scopeValue'],
});

export const clearDiscountSchema = z.object({
    scope: z.enum(['ALL', 'CATEGORY', 'SUBCATEGORY', 'PRODUCTS']),
    scopeValue: z.string().trim().max(60).optional(),
    productIds: z.array(z.string()).optional(),
});
