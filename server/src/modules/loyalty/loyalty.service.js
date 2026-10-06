import crypto from 'crypto';
import { loyaltyRepository } from './loyalty.repository.js';
import { settingsService } from '../settings/settings.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../config/logger.js';
import { recordAudit } from '../../utils/auditLog.js';
import { sendMail } from '../../config/mailer.js';
import { pointsEarnedEmail, referralSignupBonusEmail, referralBonusEmail } from '../../utils/emailTemplates.js';

// Email delivery must never break the loyalty flow it's reporting on — every
// call site here already runs inside a try/catch for that same reason, so
// this just adds the send without a second layer of error handling at each callsite.
async function notify(templateFn, { to, ...params }) {
    if (!to) return;
    try {
        const { subject, text, html } = templateFn(params);
        await sendMail({ to, subject, text, html });
    } catch (err) {
        logger.error(`Failed to send loyalty email: ${err.message}`);
    }
}

function generateCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export const loyaltyService = {
    // Collisions are astronomically unlikely (8 hex chars = 4 billion
    // combinations) but checked anyway since a duplicate would otherwise
    // fail the unique constraint at insert time with a confusing error.
    async generateUniqueReferralCode() {
        for (let attempt = 0; attempt < 5; attempt++) {
            const code = generateCode();
            const existing = await loyaltyRepository.findByReferralCode(code);
            if (!existing) return code;
        }
        throw new Error('Failed to generate a unique referral code');
    },

    async resolveReferrer(referralCode) {
        if (!referralCode) return null;
        return loyaltyRepository.findByReferralCode(referralCode.trim().toUpperCase());
    },

    // Fire-and-forget from the caller's perspective — a signup must never
    // fail because the bonus-points step had a problem.
    async awardSignupBonus(newUserId, referredById) {
        if (!referredById) return;
        try {
            const settings = await settingsService.get();
            if (settings.referralSignupBonusPoints > 0) {
                const [, user] = await loyaltyRepository.adjustBalance(
                    newUserId, settings.referralSignupBonusPoints, 'referral_signup_bonus', null,
                );
                await notify(referralSignupBonusEmail, {
                    to: user.email, name: user.name, points: settings.referralSignupBonusPoints, balance: user.loyaltyPoints,
                });
            }
        } catch (err) {
            logger.error(`Failed to award referral signup bonus: ${err.message}`);
        }
    },

    // Called once an order's payment is realized (Stripe/Razorpay
    // confirmation, or COD reaching DELIVERED). Idempotent via
    // order.pointsEarned — safe to call more than once for the same order.
    async processOrderEarning(order) {
        if (order.pointsEarned) return;
        try {
            const settings = await settingsService.get();
            const orderRef = order.id.slice(0, 8).toUpperCase();
            const earned = Math.floor(Number(order.amount) * settings.pointsPerCurrencyUnit);
            if (earned > 0) {
                const [, buyer] = await loyaltyRepository.adjustBalance(order.userId, earned, 'order_earned', order.id);
                await notify(pointsEarnedEmail, { to: buyer.email, name: buyer.name, points: earned, orderRef, balance: buyer.loyaltyPoints });
            }
            await loyaltyRepository.markPointsEarned(order.id);

            // Referral bonus goes to the referrer only once — on the
            // referred user's first order to actually earn points, not
            // every order they ever place.
            const isFirstPaidOrder = (await loyaltyRepository.countPaidOrders(order.userId, order.id)) === 0;
            if (isFirstPaidOrder && settings.referralBonusPoints > 0) {
                const buyer = await loyaltyRepository.findUserById(order.userId);
                if (buyer?.referredById) {
                    const [, referrer] = await loyaltyRepository.adjustBalance(
                        buyer.referredById, settings.referralBonusPoints, 'referral_bonus', order.id,
                    );
                    await notify(referralBonusEmail, {
                        to: referrer.email, name: referrer.name, points: settings.referralBonusPoints, balance: referrer.loyaltyPoints,
                    });
                }
            }
        } catch (err) {
            logger.error(`Failed to process loyalty points for order ${order.id}: ${err.message}`);
        }
    },

    // Converts a points request into a currency discount, validating the
    // user actually has that balance. Does not deduct — the caller (order
    // placement) deducts atomically alongside creating the order so a
    // failed order never burns points.
    async quoteRedemption(userId, requestedPoints) {
        if (!requestedPoints || requestedPoints <= 0) return { points: 0, discount: 0 };
        const user = await loyaltyRepository.findUserById(userId);
        if (!user) throw ApiError.notFound('User not found');
        if (requestedPoints > user.loyaltyPoints) {
            throw ApiError.badRequest(`You only have ${user.loyaltyPoints} points available`);
        }
        const settings = await settingsService.get();
        const discount = Math.round(requestedPoints * settings.pointValueInCurrency * 100) / 100;
        return { points: requestedPoints, discount };
    },

    async deductRedeemedPoints(userId, points, orderId) {
        if (points <= 0) return;
        await loyaltyRepository.adjustBalance(userId, -points, 'order_redeemed', orderId);
    },

    // Cancelling an order refunds any points it redeemed. Points it earned
    // are intentionally NOT clawed back — pointsEarned only flips true once
    // payment/delivery is already realized, by which point the order is
    // past the point of being cancelled by this flow.
    async refundRedeemedPoints(userId, points, orderId) {
        if (points <= 0) return;
        await loyaltyRepository.adjustBalance(userId, points, 'order_cancelled_refund', orderId);
    },

    getLedger(userId) {
        return loyaltyRepository.getLedger(userId);
    },

    async adminAdjust(userId, points, reason, actorId) {
        const user = await loyaltyRepository.findUserById(userId);
        if (!user) throw ApiError.notFound('User not found');
        if (points < 0 && Math.abs(points) > user.loyaltyPoints) {
            throw ApiError.badRequest(`Can't deduct more than the customer's current balance (${user.loyaltyPoints})`);
        }
        await loyaltyRepository.adjustBalance(userId, points, reason || 'admin_adjustment', null);
        await recordAudit({
            actorId, action: 'loyalty.admin_adjust', targetType: 'user', targetId: userId, metadata: { points, reason },
        });
    },
};
