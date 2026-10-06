import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { authService } from './auth.service.js';
import { authRepository } from './auth.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from '../../utils/tokens.js';

function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions());
}

export const register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);
    sendResponse(res, 201, { user, accessToken }, 'Registered successfully');
});

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    sendResponse(res, 200, { user, accessToken }, 'Logged in successfully');
});

export const refresh = asyncHandler(async (req, res) => {
    const oldToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const { user, accessToken, refreshToken } = await authService.refresh(oldToken);
    setRefreshCookie(res, refreshToken);
    sendResponse(res, 200, { user, accessToken }, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    await authService.logout(token, req.user?.id);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
    sendResponse(res, 200, null, 'Logged out successfully');
});

export const me = asyncHandler(async (req, res) => {
    const user = await authRepository.findById(req.user.id);
    if (!user) throw ApiError.notFound('User not found');
    sendResponse(res, 200, {
        user: {
            id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt,
            loyaltyPoints: user.loyaltyPoints, referralCode: user.referralCode,
        },
    }, 'Current user');
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    sendResponse(res, 200, { user }, 'Profile updated');
});

export const changePassword = asyncHandler(async (req, res) => {
    await authService.changePassword(req.user.id, req.body);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
    sendResponse(res, 200, null, 'Password changed. Please log in again.');
});

export const stats = asyncHandler(async (req, res) => {
    const data = await authService.getStats(req.user.id);
    sendResponse(res, 200, data, 'Account stats fetched');
});

export const forgotPassword = asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    sendResponse(res, 200, null, "If that email is registered, we've sent a password reset link.");
});

export const resetPassword = asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    sendResponse(res, 200, null, 'Password reset successfully. Please log in.');
});
