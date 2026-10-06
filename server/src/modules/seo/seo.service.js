import { prisma } from '../../config/database.js';
import { cached } from '../../utils/cache.js';
import { env } from '../../config/env.js';

const SITEMAP_CACHE_KEY = 'cache:seo:sitemap';
const SITEMAP_TTL_SECONDS = 3600;

const STATIC_PATHS = [
    '', 'collection', 'about', 'contact', 'faq',
    'shipping-policy', 'return-policy', 'cancellation-policy', 'privacy-policy', 'terms', 'cookie-policy',
];

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function urlEntry(loc, { changefreq, priority, lastmod } = {}) {
    return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
        changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
        priority !== undefined ? `    <priority>${priority}</priority>` : '',
        '  </url>',
    ].filter(Boolean).join('\n');
}

export async function generateSitemap() {
    return cached(SITEMAP_CACHE_KEY, async () => {
        const base = env.clientUrl.replace(/\/$/, '');
        const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });

        const entries = [
            ...STATIC_PATHS.map((path) => urlEntry(`${base}/${path}`, { changefreq: 'daily', priority: path === '' ? '1.0' : '0.6' })),
            ...products.map((p) => urlEntry(`${base}/product/${p.id}`, { changefreq: 'weekly', priority: '0.8', lastmod: p.updatedAt })),
        ];

        return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
    }, SITEMAP_TTL_SECONDS);
}
