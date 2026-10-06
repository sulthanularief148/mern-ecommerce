import { Router } from 'express';
import * as couponController from './coupon.controller.js';
import { validateCouponSchema, createCouponSchema, updateCouponSchema } from './coupon.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { paymentLimiter } from '../../middlewares/rateLimiters.js';

const router = Router();

router.use(requireAuth);

router.post('/validate', paymentLimiter, validateBody(validateCouponSchema), couponController.validateCoupon);

// Admin
router.get('/admin/list', requireAdmin, couponController.listCoupons);
router.post('/admin', requireAdmin, validateBody(createCouponSchema), couponController.createCoupon);
router.patch('/admin/:id', requireAdmin, validateBody(updateCouponSchema), couponController.updateCoupon);
router.delete('/admin/:id', requireAdmin, couponController.removeCoupon);

export default router;
