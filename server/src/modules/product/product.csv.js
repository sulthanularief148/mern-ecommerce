import Papa from 'papaparse';
import { productRepository } from './product.repository.js';
import { invalidateByPrefix, CACHE_KEYS } from '../../utils/cache.js';

// Column order is the import/export contract: exporting then re-importing
// unmodified must be a no-op, and admins editing the file in Excel need
// stable, predictable columns.
const COLUMNS = [
    'id', 'sku', 'name', 'description', 'price', 'compareAtPrice', 'stock',
    'category', 'subCategory', 'bestseller', 'sizes', 'images',
    'fabric', 'fabricComposition', 'pattern', 'color', 'occasion',
    'collectionName', 'gsm', 'dimensions', 'careInstructions', 'videoUrl',
];

const REQUIRED_FOR_NEW = ['name', 'price', 'category', 'subCategory'];

function toCsvRow(p) {
    return {
        id: p.id,
        sku: p.sku || '',
        name: p.name,
        description: p.description || '',
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : '',
        stock: p.stock,
        category: p.category,
        subCategory: p.subCategory,
        bestseller: p.bestseller ? 'true' : 'false',
        sizes: Array.isArray(p.sizes) ? p.sizes.join(',') : '',
        images: Array.isArray(p.images) ? p.images.join('|') : '',
        fabric: p.fabric || '',
        fabricComposition: p.fabricComposition || '',
        pattern: p.pattern || '',
        color: p.color || '',
        occasion: p.occasion || '',
        collectionName: p.collectionName || '',
        gsm: p.gsm ?? '',
        dimensions: p.dimensions || '',
        careInstructions: p.careInstructions || '',
        videoUrl: p.videoUrl || '',
    };
}

export async function exportProductsCsv() {
    const products = await productRepository.findAll();
    return Papa.unparse(products.map(toCsvRow), { columns: COLUMNS });
}

function parseBool(v) {
    return ['true', '1', 'yes'].includes(String(v).trim().toLowerCase());
}

function parseNumber(v) {
    if (v === undefined || v === null || String(v).trim() === '') return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
}

// Row -> Prisma data, only including fields the row actually set (so a
// partial edit — e.g. a CSV with just id/price/stock columns filled in —
// doesn't null out every other field on update).
function rowToProductData(row) {
    const data = {};
    if (row.name !== undefined && row.name !== '') data.name = row.name.trim();
    if (row.description !== undefined && row.description !== '') data.description = row.description;
    if (row.price !== undefined && row.price !== '') data.price = parseNumber(row.price);
    if (row.compareAtPrice !== undefined) data.compareAtPrice = row.compareAtPrice === '' ? null : parseNumber(row.compareAtPrice);
    if (row.stock !== undefined && row.stock !== '') data.stock = parseNumber(row.stock);
    if (row.category !== undefined && row.category !== '') data.category = row.category.trim();
    if (row.subCategory !== undefined && row.subCategory !== '') data.subCategory = row.subCategory.trim();
    if (row.bestseller !== undefined && row.bestseller !== '') data.bestseller = parseBool(row.bestseller);
    if (row.sizes !== undefined && row.sizes !== '') data.sizes = row.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    if (row.images !== undefined && row.images !== '') data.images = row.images.split('|').map((s) => s.trim()).filter(Boolean);
    if (row.sku !== undefined) data.sku = row.sku === '' ? null : row.sku.trim();
    if (row.fabric !== undefined) data.fabric = row.fabric === '' ? null : row.fabric;
    if (row.fabricComposition !== undefined) data.fabricComposition = row.fabricComposition === '' ? null : row.fabricComposition;
    if (row.pattern !== undefined) data.pattern = row.pattern === '' ? null : row.pattern;
    if (row.color !== undefined) data.color = row.color === '' ? null : row.color;
    if (row.occasion !== undefined) data.occasion = row.occasion === '' ? null : row.occasion;
    if (row.collectionName !== undefined) data.collectionName = row.collectionName === '' ? null : row.collectionName;
    if (row.gsm !== undefined) data.gsm = row.gsm === '' ? null : parseNumber(row.gsm);
    if (row.dimensions !== undefined) data.dimensions = row.dimensions === '' ? null : row.dimensions;
    if (row.careInstructions !== undefined) data.careInstructions = row.careInstructions === '' ? null : row.careInstructions;
    if (row.videoUrl !== undefined) data.videoUrl = row.videoUrl === '' ? null : row.videoUrl;
    return data;
}

// Matches an existing product by id first, falling back to sku, so an
// export-edit-reimport round trip updates in place, but a row with only a
// sku (no id) still finds the right product to update instead of duplicating it.
async function findExistingForRow(row) {
    if (row.id) {
        const byId = await productRepository.findById(row.id.trim());
        if (byId) return byId;
    }
    if (row.sku) {
        const bySku = await productRepository.findBySku(row.sku.trim());
        if (bySku) return bySku;
    }
    return null;
}

export async function importProductsCsv(csvText) {
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data;

    let created = 0;
    let updated = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const lineNumber = i + 2; // +1 for header row, +1 for 1-indexing
        try {
            const existing = await findExistingForRow(row);
            const data = rowToProductData(row);

            if (existing) {
                await productRepository.update(existing.id, data);
                updated++;
            } else {
                const missing = REQUIRED_FOR_NEW.filter((field) => !data[field] && data[field] !== 0);
                if (missing.length > 0) {
                    errors.push({ line: lineNumber, message: `New product missing required field(s): ${missing.join(', ')}` });
                    continue;
                }
                await productRepository.create({
                    ...data,
                    stock: data.stock ?? 50,
                    sizes: data.sizes ?? [],
                    images: data.images ?? [],
                });
                created++;
            }
        } catch (err) {
            const message = err.code === 'P2002' ? 'Duplicate SKU' : (err.message || 'Unknown error');
            errors.push({ line: lineNumber, message });
        }
    }

    if (created > 0 || updated > 0) {
        await invalidateByPrefix(CACHE_KEYS.PRODUCT_PREFIX);
    }
    return { created, updated, errors };
}
