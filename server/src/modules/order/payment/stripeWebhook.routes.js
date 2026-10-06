import { Router } from 'express';
import express from 'express';
import { env } from '../../../config/env.js';
import { logger } from '../../../config/logger.js';
import { constructStripeWebhookEvent } from './stripe.service.js';
import { orderService } from '../order.service.js';

const router = Router();

// Belt-and-suspenders confirmation path alongside the authenticated
// /verify/stripe poll: if a customer pays but closes the tab before the SPA
// redirects back, this is what still marks the order paid. Must be mounted
// before express.json() in app.js — Stripe's signature covers the exact raw
// request body, so a JSON-parsed-then-reserialized body would fail verification.
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!env.stripe.webhookSecret) {
        // Not configured — safe to no-op rather than throw, since the
        // authenticated verify-on-return flow still confirms payment.
        return res.status(200).json({ received: true, skipped: true });
    }

    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = constructStripeWebhookEvent(req.body, signature);
    } catch (err) {
        logger.warn('Stripe webhook signature verification failed', { error: err.message });
        return res.status(400).json({ error: 'Invalid signature' });
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data.object;
        if (session.payment_status === 'paid') {
            await orderService.confirmStripePayment(session.id, session.payment_intent);
        }
    }

    res.status(200).json({ received: true });
});

export default router;
