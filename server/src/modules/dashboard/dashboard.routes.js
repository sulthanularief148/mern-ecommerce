import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/summary', dashboardController.getSummary);

export default router;
