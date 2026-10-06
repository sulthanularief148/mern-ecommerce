import { Router } from 'express';
import * as collectionController from './collection.controller.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../../middlewares/upload.middleware.js';

const router = Router();

router.get('/active', collectionController.listActiveCollections);

router.get('/admin/list', requireAuth, requireAdmin, collectionController.listAllCollections);
router.post('/admin', requireAuth, requireAdmin, uploadSingleImage, collectionController.createCollection);
router.patch('/admin/:id', requireAuth, requireAdmin, uploadSingleImage, collectionController.updateCollection);
router.delete('/admin/:id', requireAuth, requireAdmin, collectionController.removeCollection);

export default router;
