import { Router } from 'express';
import * as authController from './auth.controller.js';
import {
    registerSchema, loginSchema, updateProfileSchema, changePasswordSchema,
    forgotPasswordSchema, resetPasswordSchema,
} from './auth.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiters.js';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), authController.register);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.patch('/me', requireAuth, validateBody(updateProfileSchema), authController.updateProfile);
router.post('/change-password', requireAuth, authLimiter, validateBody(changePasswordSchema), authController.changePassword);
router.get('/stats', requireAuth, authController.stats);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), authController.resetPassword);

export default router;
