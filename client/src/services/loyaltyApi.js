import { api } from '../lib/apiClient';

export async function fetchLoyaltySummary() {
    const res = await api.get('/api/loyalty/me');
    return res.data.data;
}

export async function quoteRedemption(points) {
    const res = await api.post('/api/loyalty/quote', { points });
    return res.data.data;
}
