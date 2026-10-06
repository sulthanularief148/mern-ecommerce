import { questionRepository } from './question.repository.js';
import { productRepository } from '../product/product.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { sendMail } from '../../config/mailer.js';
import { questionAnsweredEmail } from '../../utils/emailTemplates.js';
import { logger } from '../../config/logger.js';
import { recordAudit } from '../../utils/auditLog.js';

export const questionService = {
    async create(userId, { productId, question }) {
        const product = await productRepository.findById(productId);
        if (!product) throw ApiError.notFound('Product not found');
        return questionRepository.create({ productId, userId, question });
    },

    listAnsweredForProduct(productId) {
        return questionRepository.findAnsweredForProduct(productId);
    },

    listAllForAdmin() {
        return questionRepository.findAllForAdmin();
    },

    async answer(id, answer, actorId) {
        const existing = await questionRepository.findById(id);
        if (!existing) throw ApiError.notFound('Question not found');

        await questionRepository.answer(id, answer);

        if (existing.user?.email) {
            try {
                const product = await productRepository.findById(existing.productId);
                const { subject, text, html } = questionAnsweredEmail({
                    name: existing.user.name, productName: product?.name || 'the product', question: existing.question, answer,
                });
                await sendMail({ to: existing.user.email, subject, text, html });
            } catch (err) {
                logger.error(`Failed to send question-answered email: ${err.message}`);
            }
        }

        await recordAudit({ actorId, action: 'question.answer', targetType: 'product_question', targetId: id });
        return questionRepository.findById(id);
    },
};
