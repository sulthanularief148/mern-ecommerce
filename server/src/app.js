import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { globalLimiter } from './middlewares/rateLimiters.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import reviewRoutes from './modules/review/review.routes.js';
import couponRoutes from './modules/coupon/coupon.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import customerRoutes from './modules/customer/customer.routes.js';
import discountRoutes from './modules/discount/discount.routes.js';
import bannerRoutes from './modules/banner/banner.routes.js';
import collectionRoutes from './modules/collection/collection.routes.js';
import reportRoutes from './modules/report/report.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import adminUserRoutes from './modules/admin-user/admin-user.routes.js';
import stripeWebhookRoutes from './modules/order/payment/stripeWebhook.routes.js';
import returnRoutes from './modules/return/return.routes.js';
import seoRoutes from './modules/seo/seo.routes.js';
import questionRoutes from './modules/question/question.routes.js';
import loyaltyRoutes from './modules/loyalty/loyalty.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';

export function createApp() {
    const app = express();

    // Required on Vercel/Docker behind a reverse proxy so rate limiting and
    // req.ip / secure cookies see the real client connection, not the proxy's.
    app.set('trust proxy', 1);

    const corsOptions = {
        origin(origin, callback) {
            if (!origin || env.allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    };

    const cspDirectives = {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'"],
    };
    if (!env.isProduction) {
        // helmet's default CSP includes this directive; explicitly drop it
        // in dev so plain-HTTP localhost testing isn't force-upgraded.
        cspDirectives.upgradeInsecureRequests = null;
    }
    app.use(helmet({
        contentSecurityPolicy: { directives: cspDirectives },
        crossOriginResourcePolicy: { policy: 'same-origin' },
    }));
    app.use(compression());
    app.use(cors(corsOptions));

    // Stripe's signature covers the raw request bytes, so the webhook route
    // must see the unparsed body — it's mounted ahead of express.json() and
    // does its own express.raw() internally for just that one route.
    app.use('/api/orders/webhook/stripe', stripeWebhookRoutes);

    app.use(express.json({ limit: '1mb' }));
    app.use(cookieParser());
    app.use(hpp());

    if (!env.isProduction) {
        app.use((req, res, next) => {
            logger.debug(`${req.method} ${req.originalUrl}`);
            next();
        });
    }

    app.use(globalLimiter);

    app.get('/', (req, res) => {
        res.json({ success: true, message: "Webfarm's Wear API is running" });
    });
    app.get('/health', (req, res) => {
        res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/coupons', couponRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/inventory', inventoryRoutes);
    app.use('/api/customers', customerRoutes);
    app.use('/api/discounts', discountRoutes);
    app.use('/api/banners', bannerRoutes);
    app.use('/api/collections', collectionRoutes);
    app.use('/api/reports', reportRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/admin-users', adminUserRoutes);
    app.use('/api/returns', returnRoutes);
    app.use('/api/questions', questionRoutes);
    app.use('/api/loyalty', loyaltyRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api', seoRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
