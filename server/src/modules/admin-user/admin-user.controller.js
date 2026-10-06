import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { adminUserService } from './admin-user.service.js';

export const listAdmins = asyncHandler(async (req, res) => {
    const admins = await adminUserService.listAdmins();
    sendResponse(res, 200, { admins }, 'Admins fetched');
});

export const promoteAdmin = asyncHandler(async (req, res) => {
    const admin = await adminUserService.promote(req.body.email, req.user.id);
    sendResponse(res, 200, { admin }, 'User promoted to admin');
});

export const demoteAdmin = asyncHandler(async (req, res) => {
    await adminUserService.demote(req.params.id, req.user.id);
    sendResponse(res, 200, null, 'Admin access removed');
});
