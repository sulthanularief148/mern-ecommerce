import { api } from '../lib/apiClient';

export async function createReturn(orderId, reason) {
    const res = await api.post('/api/returns', { orderId, reason });
    return res.data.data.returnRequest;
}

export async function fetchMyReturns() {
    const res = await api.get('/api/returns/mine');
    return res.data.data.returnRequests;
}
