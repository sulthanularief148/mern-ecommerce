import { Router } from 'express';
import * as customerController from './customer.controller.js';
import { listCustomersQuerySchema } from './customer.validation.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', validateQuery(listCustomersQuerySchema), customerController.listCustomers);
router.get('/:id', customerController.getCustomer);

export default router;
