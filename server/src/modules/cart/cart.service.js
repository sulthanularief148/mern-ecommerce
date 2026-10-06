import { cartRepository } from './cart.repository.js';
import { productRepository } from '../product/product.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeCartItem } from '../../utils/serialize.js';

export const cartService = {
    async getCart(userId) {
        const items = await cartRepository.findByUser(userId);
        return items.map(serializeCartItem);
    },

    async addItem(userId, { productId, size, quantity }) {
        const product = await productRepository.findById(productId);
        if (!product) throw ApiError.notFound('Product not found');

        const sizes = Array.isArray(product.sizes) ? product.sizes : [];
        if (sizes.length > 0 && !sizes.includes(size)) {
            throw ApiError.badRequest('Selected size is not available for this product');
        }

        const item = await cartRepository.upsertIncrement(userId, productId, size, quantity);
        return serializeCartItem(item);
    },

    async updateItem(userId, itemId, quantity) {
        const existing = await cartRepository.findByIdForUser(itemId, userId);
        if (!existing) throw ApiError.notFound('Cart item not found');

        if (quantity === 0) {
            await cartRepository.delete(itemId);
            return null;
        }

        const updated = await cartRepository.updateQuantity(itemId, quantity);
        return serializeCartItem(updated);
    },

    async removeItem(userId, itemId) {
        const existing = await cartRepository.findByIdForUser(itemId, userId);
        if (!existing) throw ApiError.notFound('Cart item not found');
        await cartRepository.delete(itemId);
    },

    async clear(userId) {
        await cartRepository.clearForUser(userId);
    },
};
