import { logger } from '../config/logger.js';
import { sendAbandonedCartReminders } from './abandonedCart.job.js';

const HOUR_MS = 60 * 60 * 1000;

// A single always-on container (this app's deploy shape) can safely run
// scheduled work with an in-process interval — no separate cron
// infrastructure to stand up or forget to configure. Would need a
// distributed lock (e.g. a Redis SETNX) if this ever ran as multiple replicas.
export function startScheduler() {
    const runAbandonedCartJob = async () => {
        try {
            const sent = await sendAbandonedCartReminders();
            if (sent > 0) logger.info(`Sent ${sent} abandoned-cart reminder email(s)`);
        } catch (err) {
            logger.error(`Abandoned-cart job failed: ${err.message}`);
        }
    };

    runAbandonedCartJob();
    setInterval(runAbandonedCartJob, HOUR_MS);
}
