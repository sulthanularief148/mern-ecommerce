import { api } from '../lib/apiClient';
import { downloadBlob } from '../lib/downloadBlob';

export async function placeOrderCOD(address, { couponCode, deliveryMethod } = {}) {
    const res = await api.post('/api/orders/place/cod', { address, paymentMethod: 'COD', couponCode, deliveryMethod });
    return res.data.data.order;
}

export async function placeOrderStripe(address, { couponCode, deliveryMethod } = {}) {
    const res = await api.post('/api/orders/place/stripe', { address, paymentMethod: 'STRIPE', couponCode, deliveryMethod });
    return res.data.data;
}

export async function placeOrderRazorpay(address, { couponCode, deliveryMethod } = {}) {
    const res = await api.post('/api/orders/place/razorpay', { address, paymentMethod: 'RAZORPAY', couponCode, deliveryMethod });
    return res.data.data;
}

export async function verifyStripe({ orderId }) {
    const res = await api.post('/api/orders/verify/stripe', { orderId });
    return res.data.data;
}

export async function verifyRazorpay(payload) {
    const res = await api.post('/api/orders/verify/razorpay', payload);
    return res.data.data;
}

export async function fetchMyOrders() {
    const res = await api.get('/api/orders/mine');
    return res.data.data.orders;
}

export async function fetchMyOrder(id) {
    const res = await api.get(`/api/orders/mine/${id}`);
    return res.data.data.order;
}

export async function downloadInvoice(id) {
    const res = await api.get(`/api/orders/mine/${id}/invoice`, { responseType: 'blob' });
    downloadBlob(res.data, `invoice-${id.slice(0, 8)}.pdf`);
}
