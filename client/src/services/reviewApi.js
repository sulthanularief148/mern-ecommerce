import { api } from '../lib/apiClient';

export async function fetchReviews(productId) {
    const res = await api.get(`/api/reviews/${productId}`);
    return res.data.data;
}

export async function submitReview(productId, { rating, comment }) {
    const res = await api.post(`/api/reviews/${productId}`, { rating, comment });
    return res.data.data.review;
}
