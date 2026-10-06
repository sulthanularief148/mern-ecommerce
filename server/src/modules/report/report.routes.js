import { Router } from 'express';
import * as reportController from './report.controller.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/sales', reportController.salesReport);
router.get('/products', reportController.productsReport);
router.get('/customers', reportController.customersReport);
router.get('/inventory', reportController.inventoryReport);

export default router;
