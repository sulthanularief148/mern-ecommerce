import { prisma } from '../config/database.js';
import { sendMail } from '../config/mailer.js';
import { abandonedCartEmail } from '../utils/emailTemplates.js';
import { settingsService } from '../modules/settings/settings.service.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // cart untouched for 24h+
const REMIND_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // at most once a week per user

// No manual "send abandoned cart campaign" step — this runs on its own from
// the scheduler and finds carts that have gone stale since it last ran.
export async function sendAbandonedCartReminders() {
    const staleCutoff = new Date(Date.now() - STALE_AFTER_MS);

    const perUser = await prisma.cartItem.groupBy({
        by: ['userId'],
        _max: { updatedAt: true },
    });
    const staleUserIds = perUser
        .filter((row) => row._max.updatedAt && row._max.updatedAt <= staleCutoff)
        .map((row) => row.userId);
    if (staleUserIds.length === 0) return 0;

    const reminders = await prisma.cartReminder.findMany({ where: { userId: { in: staleUserIds } } });
    const lastSentByUser = new Map(reminders.map((r) => [r.userId, r.lastSentAt]));
    const cooldownCutoff = new Date(Date.now() - REMIND_COOLDOWN_MS);
    const dueUserIds = staleUserIds.filter((id) => {
        const lastSent = lastSentByUser.get(id);
        return !lastSent || lastSent <= cooldownCutoff;
    });
    if (dueUserIds.length === 0) return 0;

    const settings = await settingsService.get();
    let sent = 0;

    for (const userId of dueUserIds) {
        try {
            const [user, items] = await Promise.all([
                prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
                prisma.cartItem.findMany({ where: { userId }, include: { product: { select: { name: true, price: true, images: true } } } }),
            ]);
            if (!user?.email || items.length === 0) continue;

            const { subject, text, html } = abandonedCartEmail({
                name: user.name,
                items: items.map((i) => ({ name: i.product.name, price: Number(i.product.price), image: i.product.images?.[0] })),
                cartUrl: `${env.clientUrl}/cart`,
                currency: settings.currencySymbol,
            });
            await sendMail({ to: user.email, subject, text, html });
            await prisma.cartReminder.upsert({
                where: { userId },
                update: { lastSentAt: new Date() },
                create: { userId, lastSentAt: new Date() },
            });
            sent++;
        } catch (err) {
            logger.error(`Abandoned-cart reminder failed for user ${userId}: ${err.message}`);
        }
    }
    return sent;
}
