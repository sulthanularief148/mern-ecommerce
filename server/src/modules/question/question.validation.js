import { z } from 'zod';

export const createQuestionSchema = z.object({
    productId: z.string().min(1),
    question: z.string().trim().min(5, 'Please ask a more complete question').max(500),
});

export const answerQuestionSchema = z.object({
    answer: z.string().trim().min(1).max(1000),
});
