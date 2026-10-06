import { Router } from 'express';
import * as returnController from './return.controller.js';
import { createReturnSchema, updateReturnSchema } from './return.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createReturnSchema), returnController.createReturn);
router.get('/mine', returnController.myReturns);

router.get('/admin/list', requireAdmin, returnController.allReturns);
router.patch('/admin/:id', requireAdmin, validateBody(updateReturnSchema), returnController.updateReturn);

export default router;
