import { settingsRepository } from './settings.repository.js';
import { cached, invalidateByPrefix } from '../../utils/cache.js';

const CACHE_KEY = 'cache:settings:store';
const CACHE_PREFIX = 'cache:settings:';

const DEFAULTS = {
    storeName: "Webfarm's Wear",
    supportEmail: 'support@webfarmswear.com',
    supportPhone: '+91 8248566678',
    address: '3/12, Royal Street, Chennai',
    currencySymbol: '₹',
    taxRatePercent: 5,
    standardShippingFee: 49,
    expressShippingFee: 149,
    freeShippingThreshold: 999,
    socialInstagram: '',
    socialFacebook: '',
    // Loyalty & referrals
    pointsPerCurrencyUnit: 0.1, // 1 point per ₹10 spent
    pointValueInCurrency: 0.1, // 1 point = ₹0.1 when redeemed (100 points = ₹10)
    referralSignupBonusPoints: 50, // credited to a new signup that used a referral code
    referralBonusPoints: 100, // credited to the referrer once the referred user's first order is paid/delivered
};

export const settingsService = {
    // Read on essentially every order-placement and now every storefront
    // page load (via /public) — worth caching like the product catalog is.
    async get() {
        return cached(CACHE_KEY, async () => {
            const row = await settingsRepository.find();
            return { ...DEFAULTS, ...(row?.value || {}) };
        });
    },

    async update(patch) {
        const current = await this.get();
        const merged = { ...current, ...patch };
        await settingsRepository.upsert(merged);
        await invalidateByPrefix(CACHE_PREFIX);
        return merged;
    },
};
