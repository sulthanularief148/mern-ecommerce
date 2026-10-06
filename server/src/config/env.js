import dotenv from 'dotenv';

dotenv.config();

const required = [
    'DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET',
    'ADMIN_EMAIL', 'ADMIN_PASSWORD',
    'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_SECRET_KEY',
    'REDIS_URL'
];

const missing = required.filter((key) => !process.env[key]);

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isVercel: Boolean(process.env.VERCEL),
    port: Number(process.env.PORT) || 4000,

    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresInSeconds: Number(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS) || 60 * 60 * 24 * 30, // 30d
    },

    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_SECRET_KEY,
    },

    stripe: {
        apiKey: process.env.STRIPE_API_KEY,
        // Optional in dev — without it the webhook route stays mounted but
        // rejects every event, so payment confirmation falls back to the
        // authenticated /verify/stripe poll (still safe, just not instant).
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },

    razorpay: {
        keyId: process.env.RAZORPAY_API_KEY,
        keySecret: process.env.RAZORPAY_API_SECRET,
    },

    // Optional — error tracking stays fully off until this is set. See
    // src/config/sentry.js.
    sentryDsn: process.env.SENTRY_DSN,

    // Optional — not in `required` above. When unset, password-reset links
    // are logged instead of emailed so the flow still works in local/dev
    // environments without real SMTP credentials.
    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        fromAddress: process.env.SMTP_FROM || "Webfarm's Wear <no-reply@webfarmswear.com>",
    },

    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
        : [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:8080',
            'https://mern-ecommerce-frontend-blush.vercel.app',
            'https://mern-ecommerce-adminpanel.vercel.app'
        ],

    missing,
};

export function assertEnv(logger) {
    if (env.missing.length > 0) {
        const message = `Missing required environment variables: ${env.missing.join(', ')}`;
        if (logger) logger.error(message); else console.error(message);
        // Long-running process (Docker/PM2): fail fast so the orchestrator restarts/alerts.
        // Serverless (Vercel): let requests fail per-invocation instead of crashing the function.
        if (!env.isVercel) {
            process.exit(1);
        }
    }
}
