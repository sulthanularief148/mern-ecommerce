import { api } from '../lib/apiClient';

export async function fetchCart() {
    const res = await api.get('/api/cart');
    return res.data.data.items;
}

export async function addCartItem({ productId, size, quantity = 1 }) {
    const res = await api.post('/api/cart/items', { productId, size, quantity });
    return res.data.data.item;
}

export async function updateCartItem(itemId, quantity) {
    const res = await api.patch(`/api/cart/items/${itemId}`, { quantity });
    return res.data.data.item;
}

export async function removeCartItem(itemId) {
    await api.delete(`/api/cart/items/${itemId}`);
}
