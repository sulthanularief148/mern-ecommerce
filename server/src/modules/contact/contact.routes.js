import { Router } from 'express';
import * as contactController from './contact.controller.js';
import { contactFormSchema } from './contact.validation.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { contactLimiter } from '../../middlewares/rateLimiters.js';

const router = Router();

router.post('/', contactLimiter, validateBody(contactFormSchema), contactController.submitContactForm);

export default router;
