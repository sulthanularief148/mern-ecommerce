import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { contactService } from './contact.service.js';

export const submitContactForm = asyncHandler(async (req, res) => {
    await contactService.submit(req.body);
    sendResponse(res, 200, null, "Thanks for reaching out — we'll get back to you within 1-2 business days.");
});
