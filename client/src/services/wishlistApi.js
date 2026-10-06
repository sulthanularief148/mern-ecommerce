import { api } from '../lib/apiClient';

export async function fetchWishlist() {
    const res = await api.get('/api/wishlist');
    return res.data.data.items;
}

export async function addToWishlist(productId) {
    await api.post('/api/wishlist', { productId });
}

export async function removeFromWishlist(productId) {
    await api.delete(`/api/wishlist/${productId}`);
}
