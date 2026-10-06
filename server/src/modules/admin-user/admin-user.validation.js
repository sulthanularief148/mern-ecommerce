import { z } from 'zod';

export const promoteUserSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email format'),
});
