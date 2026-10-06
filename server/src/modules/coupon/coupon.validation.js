import { z } from 'zod';

export const validateCouponSchema = z.object({
    code: z.string().trim().min(1, 'Coupon code is required').max(40),
    subtotal: z.coerce.number().nonnegative(),
});

const couponBaseSchema = z.object({
    code: z.string().trim().min(3).max(40).transform((v) => v.toUpperCase()),
    type: z.enum(['PERCENT', 'FLAT']),
    value: z.coerce.number().positive(),
    minOrderAmount: z.coerce.number().nonnegative().optional(),
    maxDiscount: z.coerce.number().positive().optional(),
    usageLimit: z.coerce.number().int().positive().optional(),
    active: z.boolean().optional(),
    expiresAt: z.coerce.date().optional(),
});

export const createCouponSchema = couponBaseSchema.refine((data) => data.type !== 'PERCENT' || data.value <= 100, {
    message: 'Percent coupons cannot exceed 100%',
    path: ['value'],
});

export const updateCouponSchema = couponBaseSchema.partial().refine(
    (data) => data.type !== 'PERCENT' || data.value === undefined || data.value <= 100,
    { message: 'Percent coupons cannot exceed 100%', path: ['value'] },
);
