import { Router } from 'express';
import * as inventoryController from './inventory.controller.js';
import { stockQuerySchema, lowStockQuerySchema, adjustStockSchema } from './inventory.validation.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stock', validateQuery(stockQuerySchema), inventoryController.listStock);
router.get('/low-stock', validateQuery(lowStockQuerySchema), inventoryController.listLowStock);
router.post('/adjust', validateBody(adjustStockSchema), inventoryController.adjustStock);
router.get('/activity', inventoryController.recentActivity);
router.get('/:productId/history', inventoryController.productHistory);

export default router;
