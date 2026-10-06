import { api } from '../lib/apiClient';

export async function validateCoupon(code, subtotal) {
    const res = await api.post('/api/coupons/validate', { code, subtotal });
    return res.data.data;
}
