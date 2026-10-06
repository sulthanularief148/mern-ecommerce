import { Router } from 'express';
import * as bannerController from './banner.controller.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../../middlewares/upload.middleware.js';

const router = Router();

// Public — storefront reads active banners for a slot (HERO/PROMO/EDITORS_PICK)
router.get('/slot/:slot', bannerController.listActiveBanners);

// Admin
router.get('/admin/list', requireAuth, requireAdmin, bannerController.listAllBanners);
router.post('/admin', requireAuth, requireAdmin, uploadSingleImage, bannerController.createBanner);
router.patch('/admin/:id', requireAuth, requireAdmin, uploadSingleImage, bannerController.updateBanner);
router.delete('/admin/:id', requireAuth, requireAdmin, bannerController.removeBanner);

export default router;
