import { reviewRepository } from './review.repository.js';
import { productRepository } from '../product/product.repository.js';
import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';

function serializeReview(review) {
    return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        authorName: review.user?.name || 'Anonymous',
    };
}

export const reviewService = {
    async listForProduct(productId) {
        const [reviews, aggregate] = await Promise.all([
            reviewRepository.findByProduct(productId),
            reviewRepository.aggregateForProduct(productId),
        ]);
        return {
            reviews: reviews.map(serializeReview),
            averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0,
            reviewCount: aggregate._count.rating,
        };
    },

    async create(userId, productId, { rating, comment }) {
        const product = await productRepository.findById(productId);
        if (!product) throw ApiError.notFound('Product not found');

        // Only customers who actually bought the item can review it — the
        // classic "verified purchase" pattern, and it keeps review spam out.
        const purchase = await prisma.orderItem.findFirst({
            where: { productId, order: { userId } },
        });
        if (!purchase) {
            throw ApiError.forbidden('You can only review products you have purchased');
        }

        const review = await reviewRepository.upsert(userId, productId, { rating, comment });
        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
        return review;
    },

    async listAllForAdmin({ page = 1, limit = 20 }) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            reviewRepository.findAllForAdmin({ skip, take: limit }),
            reviewRepository.countAll(),
        ]);
        return {
            reviews: reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                customerName: r.user?.name || 'Deleted user',
                customerEmail: r.user?.email,
                productId: r.productId,
                productName: r.product?.name,
                productImage: r.product?.images?.[0],
            })),
            total, page, totalPages: Math.ceil(total / limit),
        };
    },

    async remove(id) {
        const deleted = await reviewRepository.deleteById(id);
        if (!deleted) throw ApiError.notFound('Review not found');
        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
    },
};
