import { productRepository } from './product.repository.js';
import { prisma } from '../../config/database.js';
import { cloudinary } from '../../config/cloudinary.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeProduct } from '../../utils/serialize.js';
import { cached, invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';
import { reviewRepository } from '../review/review.repository.js';

function uploadBufferToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'webfarmswear/products' }, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
}

async function attachRatings(products) {
    if (products.length === 0) return products;
    const aggregates = await reviewRepository.aggregateForProducts(products.map((p) => p.id));
    const byProductId = new Map(aggregates.map((a) => [a.productId, a]));
    return products.map((product) => {
        const agg = byProductId.get(product.id);
        return {
            ...product,
            averageRating: agg?._avg.rating ? Number(agg._avg.rating.toFixed(1)) : 0,
            reviewCount: agg?._count.rating || 0,
        };
    });
}

export const productService = {
    async list({ page, limit, category, subCategory }) {
        const hasFilters = Boolean(category || subCategory);

        // Filtered/admin-paginated queries skip the cache (low traffic, high
        // cardinality); the plain storefront catalog read is what benefits
        // from caching since it's hit on every homepage/collection load.
        if (hasFilters || page || limit) {
            const where = {
                ...(category ? { category } : {}),
                ...(subCategory ? { subCategory } : {}),
            };

            if (page || limit) {
                const take = limit || 20;
                const skip = ((page || 1) - 1) * take;
                const [products, total] = await Promise.all([
                    prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
                    prisma.product.count({ where }),
                ]);
                return {
                    products: await attachRatings(products.map(serializeProduct)),
                    total, page: page || 1, totalPages: Math.ceil(total / take),
                };
            }

            const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
            return { products: await attachRatings(products.map(serializeProduct)) };
        }

        const products = await cached(CACHE_KEYS.PRODUCT_LIST, async () => {
            const rows = await productRepository.findAll();
            return attachRatings(rows.map(serializeProduct));
        });
        return { products };
    },

    async getById(id) {
        const product = await cached(CACHE_KEYS.PRODUCT_ITEM(id), async () => {
            const row = await productRepository.findById(id);
            if (!row) return null;
            const [withRating] = await attachRatings([serializeProduct(row)]);
            return withRating;
        });
        if (!product) throw ApiError.notFound('Product not found');
        return product;
    },

    async create(data, files) {
        const images = ['image1', 'image2', 'image3', 'image4']
            .map((key) => files?.[key]?.[0])
            .filter(Boolean);

        if (images.length === 0) {
            throw ApiError.badRequest('At least one product image is required');
        }

        let imageUrls;
        try {
            imageUrls = await Promise.all(images.map((file) => uploadBufferToCloudinary(file.buffer)));
        } catch (err) {
            throw new ApiError(502, 'Failed to upload one or more images');
        }

        const product = await productRepository.create({
            name: data.name,
            description: data.description,
            price: data.price,
            compareAtPrice: data.compareAtPrice ?? null,
            stock: data.stock ?? 50,
            category: data.category,
            subCategory: data.subCategory,
            bestseller: data.bestseller,
            sizes: data.sizes,
            images: imageUrls,
            sku: data.sku ?? null,
            fabric: data.fabric ?? null,
            fabricComposition: data.fabricComposition ?? null,
            pattern: data.pattern ?? null,
            color: data.color ?? null,
            occasion: data.occasion ?? null,
            collectionName: data.collectionName ?? null,
            gsm: data.gsm ?? null,
            dimensions: data.dimensions ?? null,
            careInstructions: data.careInstructions ?? null,
            videoUrl: data.videoUrl ?? null,
            sizeChart: data.sizeChart ?? null,
        });

        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
        return serializeProduct(product);
    },

    async update(id, data, files, existingImages) {
        const existing = await productRepository.findById(id);
        if (!existing) throw ApiError.notFound('Product not found');

        const newFiles = ['image1', 'image2', 'image3', 'image4']
            .map((key) => files?.[key]?.[0])
            .filter(Boolean);

        let images = Array.isArray(existingImages) ? existingImages : existing.images;
        if (newFiles.length > 0) {
            let uploadedUrls;
            try {
                uploadedUrls = await Promise.all(newFiles.map((file) => uploadBufferToCloudinary(file.buffer)));
            } catch (err) {
                throw new ApiError(502, 'Failed to upload one or more images');
            }
            images = [...images, ...uploadedUrls].slice(0, 4);
        }
        if (images.length === 0) {
            throw ApiError.badRequest('At least one product image is required');
        }

        const updateData = { images };
        const fields = [
            'name', 'description', 'price', 'compareAtPrice', 'stock', 'category', 'subCategory',
            'bestseller', 'sizes', 'sku', 'fabric', 'fabricComposition', 'pattern', 'color',
            'occasion', 'collectionName', 'gsm', 'dimensions', 'careInstructions', 'videoUrl', 'sizeChart',
        ];
        for (const field of fields) {
            if (data[field] !== undefined) updateData[field] = data[field];
        }

        const product = await productRepository.update(id, updateData);
        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
        return serializeProduct(product);
    },

    async frequentlyBoughtWith(id, limit = 4) {
        const product = await productRepository.findById(id);
        if (!product) throw ApiError.notFound('Product not found');

        let matches = await productRepository.findCoPurchased(id, limit);
        if (matches.length < limit) {
            const fallback = await productRepository.findSameCategory({
                category: product.category,
                subCategory: product.subCategory,
                excludeId: id,
                limit: limit - matches.length,
            });
            const seen = new Set(matches.map((m) => m.id));
            matches = [...matches, ...fallback.filter((f) => !seen.has(f.id))];
        }

        return attachRatings(matches.map(serializeProduct));
    },

    async remove(id) {
        const deleted = await productRepository.deleteById(id);
        if (!deleted) throw ApiError.notFound('Product not found');
        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
    },
};
