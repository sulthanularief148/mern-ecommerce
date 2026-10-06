// One-off backfill: populates the new textile attribute fields (fabric,
// composition, pattern, color, occasion, collection, GSM, dimensions, care
// instructions, size chart, SKU) for the products created before those
// columns existed, and seeds a couple of demo coupons. Safe to re-run —
// upserts by SKU / coupon code.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TOP_CHART = {
    S: { chest: '36 in', length: '26 in', shoulder: '17 in' },
    M: { chest: '38 in', length: '27 in', shoulder: '18 in' },
    L: { chest: '40 in', length: '28 in', shoulder: '19 in' },
    XL: { chest: '42 in', length: '29 in', shoulder: '20 in' },
};

const BOTTOM_CHART = {
    S: { waist: '30 in', inseam: '30 in', hip: '38 in' },
    M: { waist: '32 in', inseam: '31 in', hip: '40 in' },
    L: { waist: '34 in', inseam: '32 in', hip: '42 in' },
    XL: { waist: '36 in', inseam: '32 in', hip: '44 in' },
};

function sizeChartFor(sizes, kind) {
    if (sizes.length === 1 && sizes[0] === 'One Size') return null;
    const table = kind === 'bottom' ? BOTTOM_CHART : TOP_CHART;
    return sizes.filter((s) => table[s]).map((s) => ({ size: s, ...table[s] }));
}

const products = [
    {
        name: 'Minimalist Wool Scarf',
        sku: 'WFW-ACC-SCF-001',
        fabric: 'Merino Wool Blend', fabricComposition: '70% Merino Wool, 30% Acrylic',
        pattern: 'Solid', color: 'Charcoal Grey', occasion: 'Casual', collectionName: 'Winter Essentials',
        gsm: 220, dimensions: '180cm x 30cm',
        careInstructions: 'Dry clean only. Do not bleach. Lay flat to dry. Cool iron if needed.',
        sizeChart: null,
    },
    {
        name: 'Everyday Canvas Tote Bag',
        sku: 'WFW-ACC-BAG-001',
        fabric: 'Cotton Canvas', fabricComposition: '100% Cotton Canvas',
        pattern: 'Solid', color: 'Natural Beige', occasion: 'Casual', collectionName: 'Everyday Carry',
        gsm: 340, dimensions: '40cm x 35cm x 12cm',
        careInstructions: 'Spot clean with a damp cloth. Machine washable cold, gentle cycle. Do not tumble dry.',
        sizeChart: null,
    },
    {
        name: 'Men Classic Round Neck Tee',
        sku: 'WFW-MEN-TOP-001',
        fabric: 'Cotton', fabricComposition: '100% Combed Cotton',
        pattern: 'Solid', color: 'Navy Blue', occasion: 'Casual', collectionName: 'Everyday Basics',
        gsm: 180, dimensions: null,
        careInstructions: 'Machine wash cold with like colors. Tumble dry low. Do not bleach. Warm iron if needed.',
        kind: 'top',
    },
    {
        name: 'Women Relaxed Crewneck Top',
        sku: 'WFW-WOM-TOP-001',
        fabric: 'Cotton Jersey', fabricComposition: '95% Cotton, 5% Elastane',
        pattern: 'Solid', color: 'Blush Pink', occasion: 'Casual', collectionName: 'New Arrivals',
        gsm: 190, dimensions: null,
        careInstructions: 'Machine wash cold, gentle cycle. Do not wring. Dry flat in shade.',
        kind: 'top',
    },
    {
        name: 'Men Printed Plain Cotton Shirt',
        sku: 'WFW-MEN-TOP-002',
        fabric: 'Cotton Poplin', fabricComposition: '100% Cotton',
        pattern: 'Printed', color: 'White', occasion: 'Formal', collectionName: 'Office Edit',
        gsm: 140, dimensions: null,
        careInstructions: 'Machine wash cold. Iron on medium heat. Do not tumble dry.',
        kind: 'top',
    },
    {
        name: 'Kid Tapered Slim Fit Trouser',
        sku: 'WFW-KID-BTM-001',
        fabric: 'Cotton Twill', fabricComposition: '98% Cotton, 2% Elastane',
        pattern: 'Solid', color: 'Khaki', occasion: 'Casual', collectionName: 'Kids Essentials',
        gsm: 240, dimensions: null,
        careInstructions: 'Machine wash warm. Tumble dry low. Iron inside out.',
        kind: 'bottom',
    },
    {
        name: 'Men Slim Fit Relaxed Denim Jacket',
        sku: 'WFW-MEN-WNT-001',
        fabric: 'Denim', fabricComposition: '98% Cotton, 2% Elastane',
        pattern: 'Solid', color: 'Indigo Blue', occasion: 'Casual', collectionName: 'Winter Essentials',
        gsm: 380, dimensions: null,
        careInstructions: 'Machine wash cold inside out. Do not bleach. Hang dry. Wash sparingly to preserve color.',
        kind: 'top',
    },
    {
        name: 'Boy Round Neck Pure Cotton T-shirt',
        sku: 'WFW-KID-TOP-001',
        fabric: 'Cotton', fabricComposition: '100% Cotton',
        pattern: 'Solid', color: 'Sky Blue', occasion: 'Casual', collectionName: 'Kids Essentials',
        gsm: 160, dimensions: null,
        careInstructions: 'Machine wash warm with like colors. Tumble dry low.',
        kind: 'top',
    },
    {
        name: 'Women Zip-Front Relaxed Fit Jacket',
        sku: 'WFW-WOM-WNT-001',
        fabric: 'Fleece', fabricComposition: '80% Polyester, 20% Cotton',
        pattern: 'Solid', color: 'Olive Green', occasion: 'Casual', collectionName: 'Winter Essentials',
        gsm: 320, dimensions: null,
        careInstructions: 'Machine wash cold. Do not iron directly on zip. Hang dry.',
        kind: 'top',
    },
    {
        name: 'Women Palazzo Pants with Waist Belt',
        sku: 'WFW-WOM-BTM-001',
        fabric: 'Rayon', fabricComposition: '100% Rayon',
        pattern: 'Solid', color: 'Terracotta', occasion: 'Ethnic', collectionName: 'New Arrivals',
        gsm: 150, dimensions: null,
        careInstructions: 'Hand wash cold or dry clean. Do not wring. Cool iron on reverse.',
        kind: 'bottom',
    },
    {
        name: 'Men Tapered Fit Flat-Front Trousers',
        sku: 'WFW-MEN-BTM-001',
        fabric: 'Cotton Blend', fabricComposition: '65% Cotton, 33% Polyester, 2% Elastane',
        pattern: 'Solid', color: 'Stone Grey', occasion: 'Formal', collectionName: 'Office Edit',
        gsm: 260, dimensions: null,
        careInstructions: 'Machine wash cold. Iron on medium heat. Dry clean recommended for crease retention.',
        kind: 'bottom',
    },
    {
        name: 'Girls Round Neck Cotton Top',
        sku: 'WFW-KID-TOP-002',
        fabric: 'Cotton', fabricComposition: '100% Cotton',
        pattern: 'Printed', color: 'Coral Pink', occasion: 'Casual', collectionName: 'Kids Essentials',
        gsm: 165, dimensions: null,
        careInstructions: 'Machine wash warm. Tumble dry low. Do not bleach.',
        kind: 'top',
    },
    {
        name: 'Men Round Neck Pure Cotton T-shirt',
        sku: 'WFW-MEN-TOP-003',
        fabric: 'Cotton', fabricComposition: '100% Combed Cotton',
        pattern: 'Solid', color: 'Black', occasion: 'Casual', collectionName: 'Everyday Basics',
        gsm: 180, dimensions: null,
        careInstructions: 'Machine wash cold with like colors. Tumble dry low. Do not bleach.',
        kind: 'top',
    },
    {
        name: 'Women Round Neck Cotton Top',
        sku: 'WFW-WOM-TOP-002',
        fabric: 'Cotton', fabricComposition: '100% Cotton',
        pattern: 'Striped', color: 'Ivory White', occasion: 'Casual', collectionName: 'Everyday Basics',
        gsm: 170, dimensions: null,
        careInstructions: 'Machine wash cold, gentle cycle. Dry flat in shade.',
        kind: 'top',
    },
];

async function main() {
    for (const p of products) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } });
        if (!existing) {
            console.warn(`✘ Skipped (not found): ${p.name}`);
            continue;
        }
        const sizeChart = p.sizeChart !== undefined ? p.sizeChart : sizeChartFor(existing.sizes, p.kind);
        await prisma.product.update({
            where: { id: existing.id },
            data: {
                sku: p.sku,
                fabric: p.fabric,
                fabricComposition: p.fabricComposition,
                pattern: p.pattern,
                color: p.color,
                occasion: p.occasion,
                collectionName: p.collectionName,
                gsm: p.gsm,
                dimensions: p.dimensions,
                careInstructions: p.careInstructions,
                sizeChart,
            },
        });
        console.log(`✔ ${p.name}`);
    }

    const coupons = [
        { code: 'WELCOME10', type: 'PERCENT', value: 10, minOrderAmount: 0, maxDiscount: 500, usageLimit: null, active: true },
        { code: 'FLAT150', type: 'FLAT', value: 150, minOrderAmount: 999, maxDiscount: null, usageLimit: null, active: true },
        { code: 'SAVE20', type: 'PERCENT', value: 20, minOrderAmount: 1999, maxDiscount: 800, usageLimit: 500, active: true },
    ];
    for (const c of coupons) {
        await prisma.coupon.upsert({ where: { code: c.code }, create: c, update: c });
        console.log(`✔ Coupon ${c.code}`);
    }
}

main()
    .catch((err) => { console.error(err); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
