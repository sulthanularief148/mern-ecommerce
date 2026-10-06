import { Router } from 'express';
import * as productController from './product.controller.js';
import { listProductsQuerySchema } from './product.validation.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { uploadProductImages, uploadCsv } from '../../middlewares/upload.middleware.js';

const router = Router();

// Bulk CSV import/export — mounted ahead of /:id so "export"/"import" never
// get swallowed by the :id param route.
router.get('/admin/export', requireAuth, requireAdmin, productController.exportProducts);
router.post('/admin/import', requireAuth, requireAdmin, uploadCsv, productController.importProducts);

router.get('/list', validateQuery(listProductsQuerySchema), productController.listProducts);
router.get('/:id/frequently-bought-together', productController.frequentlyBoughtTogether);
router.get('/:id', productController.getProduct);

router.post('/add', requireAuth, requireAdmin, uploadProductImages, productController.createProduct);
router.patch('/:id', requireAuth, requireAdmin, uploadProductImages, productController.updateProduct);
router.post('/remove', requireAuth, requireAdmin, productController.removeProduct);

export default router;
