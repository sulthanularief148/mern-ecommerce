import { z } from 'zod';

export const addressSchema = z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(5).max(20),
    street: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    zipcode: z.string().trim().min(1),
    country: z.string().trim().min(1),
});

export const placeOrderSchema = z.object({
    address: addressSchema,
    paymentMethod: z.enum(['COD', 'STRIPE', 'RAZORPAY']),
    couponCode: z.string().trim().max(40).optional().or(z.literal('').transform(() => undefined)),
    deliveryMethod: z.enum(['STANDARD', 'EXPRESS']).optional(),
    redeemPoints: z.coerce.number().int().min(0).optional(),
});

export const verifyStripeSchema = z.object({
    orderId: z.string().min(1),
});

export const verifyRazorpaySchema = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
});

export const updateStatusSchema = z.object({
    orderId: z.string().min(1),
    status: z.enum(['ORDER_PLACED', 'PACKING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
});

export const updateTrackingSchema = z.object({
    orderId: z.string().min(1),
    trackingNumber: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
    carrier: z.string().trim().max(60).optional().or(z.literal('').transform(() => undefined)),
    trackingUrl: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
});
