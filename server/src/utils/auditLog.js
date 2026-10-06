import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

// Fire-and-forget by design: an audit-log write failing must never block or
// fail the admin action it's recording. actorId is the only required field —
// req.user off the JWT never carries email, so this looks it up once here
// rather than making every route handler fetch it just to log.
export async function recordAudit({ actorId, action, targetType, targetId, metadata }) {
    try {
        const actor = await prisma.user.findUnique({ where: { id: actorId }, select: { email: true } });
        await prisma.auditLog.create({
            data: {
                actorId,
                actorEmail: actor?.email ?? 'unknown',
                action,
                targetType,
                targetId: targetId ?? null,
                metadata: metadata ?? undefined,
            },
        });
    } catch (err) {
        logger.error('Failed to write audit log', { action, targetType, targetId, error: err.message });
    }
}
