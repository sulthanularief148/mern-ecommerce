import { Router } from 'express';
import * as reviewController from './review.controller.js';
import { createReviewSchema, listReviewsQuerySchema } from './review.validation.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/admin/list', requireAuth, requireAdmin, validateQuery(listReviewsQuerySchema), reviewController.listAllReviews);
router.delete('/admin/:id', requireAuth, requireAdmin, reviewController.removeReview);

router.get('/:productId', reviewController.listReviews);
router.post('/:productId', requireAuth, validateBody(createReviewSchema), reviewController.createReview);

export default router;
