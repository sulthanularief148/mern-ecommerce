import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { addCartItemSchema, updateCartItemSchema } from './cart.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/items', validateBody(addCartItemSchema), cartController.addItem);
router.patch('/items/:id', validateBody(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);

export default router;
