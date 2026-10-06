import { adminUserRepository } from './admin-user.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { revokeAllUserTokens } from '../../utils/tokens.js';
import { recordAudit } from '../../utils/auditLog.js';

export const adminUserService = {
    listAdmins() {
        return adminUserRepository.findAllAdmins();
    },

    // New admins are always plain ADMIN, never SUPER_ADMIN — granting the
    // ability to manage other admins is a separate, manual step (direct DB
    // update), never a one-click action, by design.
    async promote(email, actorId) {
        const user = await adminUserRepository.findByEmail(email);
        if (!user) throw ApiError.notFound('No account exists with that email — they need to register first');
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            throw ApiError.badRequest('This user is already an admin');
        }

        const updated = await adminUserRepository.setRole(user.id, 'ADMIN');
        // Force a fresh login so their new role takes effect immediately.
        await revokeAllUserTokens(user.id);
        await recordAudit({ actorId, action: 'admin.promote', targetType: 'user', targetId: user.id, metadata: { email } });
        return { id: updated.id, name: updated.name, email: updated.email };
    },

    async demote(targetId, requestingUserId) {
        if (targetId === requestingUserId) {
            throw ApiError.badRequest("You can't remove your own admin access");
        }
        const adminCount = await adminUserRepository.countAdmins();
        if (adminCount <= 1) {
            throw ApiError.badRequest('At least one admin must remain');
        }
        await adminUserRepository.setRole(targetId, 'CUSTOMER');
        await revokeAllUserTokens(targetId);
        await recordAudit({ actorId: requestingUserId, action: 'admin.demote', targetType: 'user', targetId });
    },
};
