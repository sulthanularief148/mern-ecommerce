import { z } from 'zod';

export const contactFormSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: z.string().trim().toLowerCase().email('Invalid email format'),
    message: z.string().trim().min(10, 'Please write a bit more detail').max(2000),
});
