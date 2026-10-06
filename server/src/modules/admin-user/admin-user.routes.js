import { Router } from 'express';
import * as adminUserController from './admin-user.controller.js';
import { promoteUserSchema } from './admin-user.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireSuperAdmin } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiters.js';

const router = Router();

// Managing who has admin access is the single highest-privilege action in
// the app — gated to SUPER_ADMIN only, not every ADMIN.
router.use(requireAuth, requireSuperAdmin);

router.get('/', adminUserController.listAdmins);
router.post('/promote', authLimiter, validateBody(promoteUserSchema), adminUserController.promoteAdmin);
router.delete('/:id', adminUserController.demoteAdmin);

export default router;
