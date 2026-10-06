import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';
import { serializeProduct } from '../../utils/serialize.js';

function whereForScope({ scope, scopeValue, productIds }) {
    switch (scope) {
        case 'CATEGORY': return { category: scopeValue };
        case 'SUBCATEGORY': return { subCategory: scopeValue };
        case 'PRODUCTS': return { id: { in: productIds } };
        default: return {};
    }
}

export const discountService = {
    async apply({ scope, scopeValue, productIds, type, value }) {
        if (type === 'PERCENT' && value >= 100) {
            throw ApiError.badRequest('Percent discount must be less than 100');
        }
        const where = whereForScope({ scope, scopeValue, productIds });
        const products = await prisma.product.findMany({ where, select: { id: true, price: true, compareAtPrice: true } });
        if (products.length === 0) throw ApiError.notFound('No matching products found');

        await prisma.$transaction(products.map((p) => {
            // If a compareAtPrice already exists, treat it as the "true" original
            // price so re-applying a discount doesn't compound on an already-discounted price.
            const basePrice = p.compareAtPrice != null ? Number(p.compareAtPrice) : Number(p.price);
            const discounted = type === 'PERCENT' ? basePrice * (1 - value / 100) : basePrice - value;
            const newPrice = Math.max(Math.round(discounted * 100) / 100, 1);

            return prisma.product.update({
                where: { id: p.id },
                data: { price: newPrice, compareAtPrice: basePrice },
            });
        }));

        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
        return { updatedCount: products.length };
    },

    async clear({ scope, scopeValue, productIds }) {
        const where = { ...whereForScope({ scope, scopeValue, productIds }), compareAtPrice: { not: null } };
        const products = await prisma.product.findMany({ where, select: { id: true, compareAtPrice: true } });
        if (products.length === 0) return { updatedCount: 0 };

        await prisma.$transaction(products.map((p) => prisma.product.update({
            where: { id: p.id },
            data: { price: p.compareAtPrice, compareAtPrice: null },
        })));

        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
        return { updatedCount: products.length };
    },

    async onSale() {
        const products = await prisma.product.findMany({
            where: { compareAtPrice: { not: null } },
            orderBy: { updatedAt: 'desc' },
        });
        return products.map(serializeProduct);
    },
};
