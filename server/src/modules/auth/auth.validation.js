import { z } from 'zod';

// Mirrors the strength rule the app enforced before the rewrite: 8-64 chars,
// at least one upper/lower/digit/symbol.
const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/\d/, 'Password must include a digit')
    .regex(/[^A-Za-z0-9]/, 'Password must include a symbol');

export const registerSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: z.string().trim().toLowerCase().email('Invalid email format'),
    password: passwordSchema,
    referralCode: z.string().trim().max(20).optional().or(z.literal('').transform(() => undefined)),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(120),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
});
