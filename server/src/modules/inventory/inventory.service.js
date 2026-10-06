import { inventoryRepository } from './inventory.repository.js';
import { serializeProduct } from '../../utils/serialize.js';
import { invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';
import { ApiError } from '../../utils/ApiError.js';

const LOW_STOCK_DEFAULT_THRESHOLD = 5;

export const inventoryService = {
    async listStock({ page = 1, limit = 20, search }) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            inventoryRepository.findStock({ skip, take: limit, search }),
            inventoryRepository.countStock(search),
        ]);
        return {
            items: items.map(serializeProduct),
            total, page, totalPages: Math.ceil(total / limit),
        };
    },

    async listLowStock(threshold = LOW_STOCK_DEFAULT_THRESHOLD) {
        const items = await inventoryRepository.findLowStock(threshold);
        return { items: items.map(serializeProduct), threshold };
    },

    async adjust(adjustedById, { productId, delta, reason }) {
        const updated = await inventoryRepository.adjustStock({ productId, delta, reason, adjustedById });
        if (!updated) throw ApiError.notFound('Product not found');
        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
        return serializeProduct(updated);
    },

    async history(productId) {
        return inventoryRepository.findAdjustmentsForProduct(productId);
    },

    async recentActivity() {
        return inventoryRepository.findRecentAdjustments();
    },
};
