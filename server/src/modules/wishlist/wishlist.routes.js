import { Router } from 'express';
import * as wishlistController from './wishlist.controller.js';
import { addWishlistItemSchema } from './wishlist.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', wishlistController.getWishlist);
router.post('/', validateBody(addWishlistItemSchema), wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
