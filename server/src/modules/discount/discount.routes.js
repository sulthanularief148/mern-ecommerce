import { Router } from 'express';
import * as discountController from './discount.controller.js';
import { applyDiscountSchema, clearDiscountSchema } from './discount.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/on-sale', discountController.listOnSale);
router.post('/apply', validateBody(applyDiscountSchema), discountController.applyDiscount);
router.post('/clear', validateBody(clearDiscountSchema), discountController.clearDiscount);

export default router;
