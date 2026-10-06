import { Router } from 'express';
import * as questionController from './question.controller.js';
import { createQuestionSchema, answerQuestionSchema } from './question.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/product/:productId', questionController.listForProduct);

router.use(requireAuth);
router.post('/', validateBody(createQuestionSchema), questionController.createQuestion);

router.get('/admin/list', requireAdmin, questionController.listAllForAdmin);
router.patch('/admin/:id', requireAdmin, validateBody(answerQuestionSchema), questionController.answerQuestion);

export default router;
