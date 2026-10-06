import { couponRepository } from './coupon.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeCoupon } from '../../utils/serialize.js';

// Single source of truth for discount math — used by both the cart-page
// preview (validate) and real order placement, so a coupon can never be
// honored client-side without the server agreeing on the same amount.
export async function resolveDiscount(code, subtotal) {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon || !coupon.active) {
        throw ApiError.badRequest('Invalid or inactive coupon code');
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw ApiError.badRequest('This coupon has expired');
    }
    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
        throw ApiError.badRequest('This coupon has reached its usage limit');
    }
    if (subtotal < Number(coupon.minOrderAmount)) {
        throw ApiError.badRequest(`This coupon requires a minimum order of ₹${Number(coupon.minOrderAmount)}`);
    }

    let discountAmount = coupon.type === 'PERCENT'
        ? (subtotal * Number(coupon.value)) / 100
        : Number(coupon.value);

    if (coupon.maxDiscount != null) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
    }
    discountAmount = Math.min(discountAmount, subtotal);

    return { coupon, discountAmount: Math.round(discountAmount * 100) / 100 };
}

export const couponService = {
    async validate(code, subtotal) {
        const { coupon, discountAmount } = await resolveDiscount(code, subtotal);
        return { valid: true, code: coupon.code, discountAmount, type: coupon.type, value: Number(coupon.value) };
    },

    async list() {
        const coupons = await couponRepository.findAll();
        return coupons.map(serializeCoupon);
    },

    async create(data) {
        const existing = await couponRepository.findByCode(data.code);
        if (existing) throw ApiError.badRequest('A coupon with this code already exists');
        const coupon = await couponRepository.create(data);
        return serializeCoupon(coupon);
    },

    async update(id, data) {
        const coupon = await couponRepository.update(id, data);
        if (!coupon) throw ApiError.notFound('Coupon not found');
        return serializeCoupon(coupon);
    },

    async remove(id) {
        const deleted = await couponRepository.deleteById(id);
        if (!deleted) throw ApiError.notFound('Coupon not found');
    },
};
