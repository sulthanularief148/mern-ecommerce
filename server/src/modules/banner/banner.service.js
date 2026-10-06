import { bannerRepository } from './banner.repository.js';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryUpload.js';
import { ApiError } from '../../utils/ApiError.js';
import { cached, invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';

export const bannerService = {
    listAll() {
        return bannerRepository.findAll();
    },

    listActiveBySlot(slot) {
        return cached(CACHE_KEYS.BANNERS_SLOT(slot), () => bannerRepository.findActiveBySlot(slot));
    },

    async create(data, file) {
        let imageUrl = data.imageUrl;
        if (file) {
            imageUrl = await uploadBufferToCloudinary(file.buffer, 'webfarmswear/banners');
        }
        if (!imageUrl) throw ApiError.badRequest('An image (file or URL) is required');

        const banner = await bannerRepository.create({ ...data, imageUrl });
        await invalidateByPrefix(CACHE_KEYS.BANNERS_PREFIX);
        return banner;
    },

    async update(id, data, file) {
        const updateData = { ...data };
        if (file) {
            updateData.imageUrl = await uploadBufferToCloudinary(file.buffer, 'webfarmswear/banners');
        }
        const banner = await bannerRepository.update(id, updateData);
        if (!banner) throw ApiError.notFound('Banner not found');
        await invalidateByPrefix(CACHE_KEYS.BANNERS_PREFIX);
        return banner;
    },

    async remove(id) {
        const deleted = await bannerRepository.deleteById(id);
        if (!deleted) throw ApiError.notFound('Banner not found');
        await invalidateByPrefix(CACHE_KEYS.BANNERS_PREFIX);
    },
};
