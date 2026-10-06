import { collectionRepository } from './collection.repository.js';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryUpload.js';
import { ApiError } from '../../utils/ApiError.js';
import { cached, invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';

export const collectionService = {
    async listAllForAdmin() {
        const collections = await collectionRepository.findAll();
        const withCounts = await Promise.all(
            collections.map(async (c) => ({ ...c, productCount: await collectionRepository.productCount(c.name) })),
        );
        return withCounts;
    },

    listActive() {
        return cached(CACHE_KEYS.COLLECTIONS_LIST, () => collectionRepository.findActive());
    },

    async create(data, file) {
        const existing = await collectionRepository.findByName(data.name);
        if (existing) throw ApiError.badRequest('A collection with this name already exists');

        let imageUrl = data.imageUrl;
        if (file) imageUrl = await uploadBufferToCloudinary(file.buffer, 'webfarmswear/collections');

        const collection = await collectionRepository.create({ ...data, imageUrl });
        await invalidateByPrefix(CACHE_KEYS.COLLECTIONS_PREFIX);
        return collection;
    },

    async update(id, data, file) {
        const updateData = { ...data };
        if (file) updateData.imageUrl = await uploadBufferToCloudinary(file.buffer, 'webfarmswear/collections');

        const collection = await collectionRepository.update(id, updateData);
        if (!collection) throw ApiError.notFound('Collection not found');
        await invalidateByPrefix(CACHE_KEYS.COLLECTIONS_PREFIX);
        return collection;
    },

    async remove(id) {
        const deleted = await collectionRepository.deleteById(id);
        if (!deleted) throw ApiError.notFound('Collection not found');
        await invalidateByPrefix(CACHE_KEYS.COLLECTIONS_PREFIX);
    },
};
