import { Router } from 'express';
import * as orderController from './order.controller.js';
import {
    placeOrderSchema, verifyStripeSchema, verifyRazorpaySchema, updateStatusSchema, updateTrackingSchema,
} from './order.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { paymentLimiter } from '../../middlewares/rateLimiters.js';

const router = Router();

router.use(requireAuth);

// Admin
router.post('/admin/list', requireAdmin, orderController.allOrders);
router.post('/admin/status', requireAdmin, validateBody(updateStatusSchema), orderController.updateStatus);
router.post('/admin/tracking', requireAdmin, validateBody(updateTrackingSchema), orderController.updateTracking);
router.get('/admin/:id/invoice', requireAdmin, orderController.downloadInvoiceAdmin);

// Checkout
router.post('/place/cod', validateBody(placeOrderSchema), orderController.placeOrderCOD);
router.post('/place/stripe', paymentLimiter, validateBody(placeOrderSchema), orderController.placeOrderStripe);
router.post('/place/razorpay', paymentLimiter, validateBody(placeOrderSchema), orderController.placeOrderRazorpay);

router.post('/verify/stripe', paymentLimiter, validateBody(verifyStripeSchema), orderController.verifyStripe);
router.post('/verify/razorpay', paymentLimiter, validateBody(verifyRazorpaySchema), orderController.verifyRazorpay);

// Customer
router.get('/mine', orderController.myOrders);
router.get('/mine/:id', orderController.getMyOrder);
router.get('/mine/:id/invoice', orderController.downloadInvoice);

export default router;
