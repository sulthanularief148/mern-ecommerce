import { api } from '../lib/apiClient';

export async function fetchProducts() {
    const res = await api.get('/api/products/list');
    return res.data.data.products;
}

export async function fetchProduct(id) {
    const res = await api.get(`/api/products/${id}`);
    return res.data.data.product;
}

export async function fetchFrequentlyBoughtTogether(id) {
    const res = await api.get(`/api/products/${id}/frequently-bought-together`);
    return res.data.data.products;
}
