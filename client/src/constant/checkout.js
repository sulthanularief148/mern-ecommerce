// Fallback values only — used until the live figures load from
// GET /api/settings/public (see ShopContext's `storeSettings`). The server
// is always the source of truth at order time regardless; these just avoid
// a flash of wrong numbers (or a round trip) before that fetch resolves.
export const FREE_SHIPPING_THRESHOLD = 999;
export const TAX_RATE = 0.05;

export const DELIVERY_METHODS = {
    STANDARD: { label: 'Standard Delivery', fee: 49, etaDays: [4, 6] },
    EXPRESS: { label: 'Express Delivery', fee: 149, etaDays: [1, 2] },
};

// storeSettings (from ShopContext) overrides the fee/threshold/tax-rate
// defaults above once the live values have loaded — the eta/label fields
// aren't admin-configurable so those always come from DELIVERY_METHODS.
export function deliveryMethodsFor(storeSettings) {
    if (!storeSettings) return DELIVERY_METHODS;
    return {
        STANDARD: { ...DELIVERY_METHODS.STANDARD, fee: storeSettings.standardShippingFee },
        EXPRESS: { ...DELIVERY_METHODS.EXPRESS, fee: storeSettings.expressShippingFee },
    };
}

export function estimateTotals({ subtotal, discountAmount = 0, deliveryMethod = 'STANDARD', storeSettings }) {
    const methods = deliveryMethodsFor(storeSettings);
    const freeShippingThreshold = storeSettings?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
    const taxRate = storeSettings ? storeSettings.taxRatePercent / 100 : TAX_RATE;

    const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
    const method = methods[deliveryMethod] ? deliveryMethod : 'STANDARD';
    const shippingFee = method === 'STANDARD' && discountedSubtotal >= freeShippingThreshold
        ? 0
        : methods[method].fee;
    const taxAmount = Math.round(discountedSubtotal * taxRate * 100) / 100;
    const total = Math.round((discountedSubtotal + taxAmount + shippingFee) * 100) / 100;
    return { subtotal, discountAmount, shippingFee, taxAmount, taxRate, total, deliveryMethod: method };
}

export function estimatedDeliveryDate(deliveryMethod = 'STANDARD') {
    const method = DELIVERY_METHODS[deliveryMethod] ? deliveryMethod : 'STANDARD';
    const [minDays, maxDays] = DELIVERY_METHODS[method].etaDays;
    const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const min = new Date(); min.setDate(min.getDate() + minDays);
    const max = new Date(); max.setDate(max.getDate() + maxDays);
    return `${fmt(min)} - ${fmt(max)}`;
}
