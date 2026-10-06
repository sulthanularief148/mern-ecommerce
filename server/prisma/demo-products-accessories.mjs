// Additive follow-up to demo-products.mjs — adds a couple of Accessories
// items so the new category isn't empty. Safe to run once; re-running will
// create duplicates since products aren't matched by name.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, '../../client/src/assets');
const API_URL = process.env.API_URL || 'http://localhost:4000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL_SEED || 'webfarmtechfreelancers@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_SEED || 'Webfarmtech@123';

const products = [
    {
        name: 'Everyday Canvas Tote Bag',
        description: 'A sturdy, roomy canvas tote for daily errands or a day at the market — reinforced straps, machine washable.',
        price: 349, category: 'Accessories', subCategory: 'Bags', bestseller: false, stock: 45,
        sizes: ['One Size'], images: ['p_img45.png'],
    },
    {
        name: 'Minimalist Wool Scarf',
        description: 'A soft, lightweight wool-blend scarf that layers easily over any outfit as the seasons change.',
        price: 599, category: 'Accessories', subCategory: 'Topwear', bestseller: false, stock: 32,
        sizes: ['One Size'], images: ['p_img50.png'],
    },
];

async function login() {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const body = await res.json();
    if (!body.success) throw new Error(`Admin login failed: ${body.message}`);
    return body.data.accessToken;
}

async function createProduct(token, product) {
    const form = new FormData();
    form.append('name', product.name);
    form.append('description', product.description);
    form.append('price', String(product.price));
    form.append('stock', String(product.stock));
    form.append('category', product.category);
    form.append('subCategory', product.subCategory);
    form.append('bestseller', String(product.bestseller));
    form.append('sizes', JSON.stringify(product.sizes));

    product.images.forEach((filename, i) => {
        const filePath = path.join(ASSETS_DIR, filename);
        const buffer = fs.readFileSync(filePath);
        form.append(`image${i + 1}`, new Blob([buffer], { type: 'image/png' }), filename);
    });

    const res = await fetch(`${API_URL}/api/products/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    const body = await res.json();
    if (!body.success) throw new Error(`Failed to create "${product.name}": ${body.message}`);
    return body.data.product;
}

async function main() {
    const token = await login();
    for (const product of products) {
        try {
            const created = await createProduct(token, product);
            console.log(`✔ ${created.name} (${created.id})`);
        } catch (err) {
            console.error(`✘ ${product.name}: ${err.message}`);
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
