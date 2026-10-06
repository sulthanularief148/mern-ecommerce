import bcrypt from 'bcryptjs';
import { authRepository } from './auth.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import {
    signAccessToken, issueRefreshToken, verifyRefreshToken,
    rotateRefreshToken, revokeRefreshToken, revokeAllUserTokens,
    issuePasswordResetToken, verifyPasswordResetToken, revokePasswordResetToken,
} from '../../utils/tokens.js';
import { sendMail } from '../../config/mailer.js';
import { passwordResetEmail } from '../../utils/emailTemplates.js';
import { env } from '../../config/env.js';
import { loyaltyService } from '../loyalty/loyalty.service.js';

const DUMMY_HASH = '$2a$10$invalidsaltinvalidsaltinvalidsaltinvalidsaltinvalidsa';

function toPublicUser(user) {
    return {
        id: user.id, name: user.name, email: user.email, role: user.role,
        loyaltyPoints: user.loyaltyPoints, referralCode: user.referralCode,
    };
}

export const authService = {
    async register({ name, email, password, referralCode }) {
        const existing = await authRepository.findByEmail(email);
        if (existing) {
            throw ApiError.conflict('User already exists. Try logging in.');
        }

        const referrer = referralCode ? await loyaltyService.resolveReferrer(referralCode) : null;
        const passwordHash = await bcrypt.hash(password, 12);
        const ownReferralCode = await loyaltyService.generateUniqueReferralCode();
        const user = await authRepository.create({
            name, email, passwordHash, referralCode: ownReferralCode, referredById: referrer?.id,
        });
        await loyaltyService.awardSignupBonus(user.id, referrer?.id);

        const accessToken = signAccessToken(user);
        const refreshToken = await issueRefreshToken(user.id);

        // loyaltyPoints on `user` is stale (0, from before the signup bonus
        // write above) — refetch so the register response reflects the
        // bonus that was just credited instead of momentarily lying about it.
        const fresh = referrer ? await authRepository.findById(user.id) : user;
        return { user: toPublicUser(fresh), accessToken, refreshToken };
    },

    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        // Always run bcrypt.compare, even when the user doesn't exist, so
        // response timing doesn't leak which emails are registered.
        const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

        if (!user || !isMatch) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        const accessToken = signAccessToken(user);
        const refreshToken = await issueRefreshToken(user.id);

        return { user: toPublicUser(user), accessToken, refreshToken };
    },

    async refresh(oldRefreshToken) {
        const userId = await verifyRefreshToken(oldRefreshToken);
        if (!userId) {
            throw ApiError.unauthorized('Refresh token is invalid or expired');
        }

        const user = await authRepository.findById(userId);
        if (!user) {
            await revokeRefreshToken(oldRefreshToken, userId);
            throw ApiError.unauthorized('User no longer exists');
        }

        const accessToken = signAccessToken(user);
        const refreshToken = await rotateRefreshToken(oldRefreshToken, userId);

        return { user: toPublicUser(user), accessToken, refreshToken };
    },

    async logout(refreshToken, userId) {
        if (refreshToken) {
            await revokeRefreshToken(refreshToken, userId);
        }
    },

    async updateProfile(userId, { name }) {
        const user = await authRepository.updateName(userId, name);
        return toPublicUser(user);
    },

    async changePassword(userId, { currentPassword, newPassword }) {
        const user = await authRepository.findById(userId);
        if (!user) throw ApiError.notFound('User not found');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await authRepository.updatePassword(userId, passwordHash);
        // Password change invalidates every other session — force re-login everywhere else.
        await revokeAllUserTokens(userId);
    },

    async getStats(userId) {
        return authRepository.stats(userId);
    },

    async forgotPassword(email) {
        const user = await authRepository.findByEmail(email);
        // Always behave the same whether or not the account exists — the
        // response can't be allowed to reveal which emails are registered.
        if (user) {
            const token = await issuePasswordResetToken(user.id);
            const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;
            const { subject, text, html } = passwordResetEmail({ name: user.name, resetUrl });
            await sendMail({ to: user.email, subject, text, html });
        }
    },

    async resetPassword(token, newPassword) {
        const userId = await verifyPasswordResetToken(token);
        if (!userId) throw ApiError.badRequest('This reset link is invalid or has expired');

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await authRepository.updatePassword(userId, passwordHash);
        await revokePasswordResetToken(token);
        // A password reset is a credential change just like changePassword —
        // every existing session (stolen or not) must stop being valid.
        await revokeAllUserTokens(userId);
    },
};
