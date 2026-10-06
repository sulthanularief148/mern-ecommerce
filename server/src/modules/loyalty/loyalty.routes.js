import { Router } from 'express';
import * as loyaltyController from './loyalty.controller.js';
import { quoteRedemptionSchema, adminAdjustSchema } from './loyalty.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/me', loyaltyController.me);
router.post('/quote', validateBody(quoteRedemptionSchema), loyaltyController.quoteRedemption);

router.get('/admin/:userId', requireAdmin, loyaltyController.adminGetForUser);
router.post('/admin/adjust', requireAdmin, validateBody(adminAdjustSchema), loyaltyController.adminAdjust);

export default router;
