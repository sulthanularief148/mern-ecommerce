import * as Sentry from '@sentry/node';
import { env } from './env.js';
import { logger } from './logger.js';

let enabled = false;

// No-ops everywhere below until SENTRY_DSN is set — no account required to
// run this app, and no silent network calls to a Sentry project that
// doesn't exist yet.
export function initSentry() {
    if (!env.sentryDsn) return;
    Sentry.init({ dsn: env.sentryDsn, environment: env.nodeEnv, tracesSampleRate: 0.1 });
    enabled = true;
    logger.info('Sentry error tracking enabled');
}

export function captureException(err) {
    if (enabled) Sentry.captureException(err);
}
