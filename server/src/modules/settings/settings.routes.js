import { Router } from 'express';
import * as settingsController from './settings.controller.js';
import { updateSettingsSchema } from './settings.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/public', settingsController.getPublicSettings);

router.use(requireAuth, requireAdmin);

router.get('/', settingsController.getSettings);
router.patch('/', validateBody(updateSettingsSchema), settingsController.updateSettings);

export default router;
