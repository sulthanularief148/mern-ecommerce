import { wishlistRepository } from './wishlist.repository.js';
import { productRepository } from '../product/product.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeProduct } from '../../utils/serialize.js';

export const wishlistService = {
    async list(userId) {
        const items = await wishlistRepository.findByUser(userId);
        return items.map((item) => ({ id: item.id, productId: item.productId, product: serializeProduct(item.product) }));
    },

    async add(userId, productId) {
        const product = await productRepository.findById(productId);
        if (!product) throw ApiError.notFound('Product not found');
        await wishlistRepository.add(userId, productId);
    },

    async remove(userId, productId) {
        await wishlistRepository.remove(userId, productId);
    },
};
