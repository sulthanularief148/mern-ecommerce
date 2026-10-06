import { env, assertEnv } from './src/config/env.js';
import { initSentry, captureException } from './src/config/sentry.js';
import { logger } from './src/config/logger.js';
import { connectDatabase, disconnectDatabase } from './src/config/database.js';
import { connectRedis, redis } from './src/config/redis.js';
import { connectCloudinary } from './src/config/cloudinary.js';
import { createApp } from './src/app.js';
import { startScheduler } from './src/jobs/scheduler.js';

assertEnv(logger);
initSentry();

const app = createApp();

async function bootstrap() {
    try {
        await connectRedis();
    } catch (err) {
        logger.error(`Failed to connect to Redis: ${err.message}`);
        if (!env.isVercel) process.exit(1);
    }

    try {
        await connectDatabase();
    } catch (err) {
        logger.error(`Failed to connect to MySQL: ${err.message}`);
        if (!env.isVercel) process.exit(1);
    }

    connectCloudinary();

    app.listen(env.port, () => {
        logger.info(`Webfarm's Wear API listening on port ${env.port} [${env.nodeEnv}]`);
    });

    // Serverless (Vercel) invocations are too short-lived for a persistent
    // interval — scheduled jobs there would need a platform cron trigger
    // instead, hitting a dedicated endpoint.
    if (!env.isVercel) {
        startScheduler();
    }
}

bootstrap();

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason?.stack || reason}`);
    captureException(reason instanceof Error ? reason : new Error(String(reason)));
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await disconnectDatabase();
    redis.disconnect();
    process.exit(0);
});

export default app;
