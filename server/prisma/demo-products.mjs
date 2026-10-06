// One-off seeding script: uploads product images from client/src/assets
// through the real admin API (so images land in Cloudinary exactly like a
// real admin submission would) and creates demo catalog products.
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
        name: 'Women Round Neck Cotton Top',
        description: 'A lightweight, breathable pullover top in soft organic cotton, cut for an easy everyday fit.',
        price: 499, category: 'Women', subCategory: 'Topwear', bestseller: true, stock: 40,
        sizes: ['S', 'M', 'L'], images: ['p_img1.png'],
    },
    {
        name: 'Men Round Neck Pure Cotton T-shirt',
        description: 'Our best-selling essential tee — pure combed cotton, tagless collar, and a relaxed regular fit.',
        price: 599, category: 'Men', subCategory: 'Topwear', bestseller: true, stock: 60,
        sizes: ['S', 'M', 'L', 'XL'], images: ['p_img2_1.png', 'p_img2_2.png', 'p_img2_3.png', 'p_img2_4.png'],
    },
    {
        name: 'Girls Round Neck Cotton Top',
        description: 'Soft, stretchy cotton top made for all-day play, with reinforced stitching that holds up to washing.',
        price: 399, category: 'Kids', subCategory: 'Topwear', bestseller: false, stock: 25,
        sizes: ['S', 'M', 'L'], images: ['p_img3.png'],
    },
    {
        name: 'Men Tapered Fit Flat-Front Trousers',
        description: 'Tailored tapered trousers with a clean flat front — smart enough for the office, comfortable enough for travel.',
        price: 899, compareAtPrice: 1199, category: 'Men', subCategory: 'Bottomwear', bestseller: false, stock: 4,
        sizes: ['S', 'L', 'XL'], images: ['p_img7.png'],
    },
    {
        name: 'Women Palazzo Pants with Waist Belt',
        description: 'Flowy wide-leg palazzo pants with a self-fabric waist belt for a flattering, adjustable fit.',
        price: 799, category: 'Women', subCategory: 'Bottomwear', bestseller: false, stock: 18,
        sizes: ['S', 'M', 'L', 'XL'], images: ['p_img20.png'],
    },
    {
        name: 'Women Zip-Front Relaxed Fit Jacket',
        description: 'A relaxed-fit jacket with a full front zip and soft brushed lining — the layering piece you reach for all season.',
        price: 1499, category: 'Women', subCategory: 'Winterwear', bestseller: true, stock: 15,
        sizes: ['S', 'M', 'L'], images: ['p_img21.png'],
    },
    {
        name: 'Boy Round Neck Pure Cotton T-shirt',
        description: 'Durable, easy-care cotton tee built for active kids, with a fade-resistant print.',
        price: 349, category: 'Kids', subCategory: 'Topwear', bestseller: false, stock: 30,
        sizes: ['S', 'M', 'L'], images: ['p_img14.png'],
    },
    {
        name: 'Men Slim Fit Relaxed Denim Jacket',
        description: 'Washed denim jacket with a slim silhouette and just enough stretch to move with you.',
        price: 1899, compareAtPrice: 2399, category: 'Men', subCategory: 'Winterwear', bestseller: true, stock: 3,
        sizes: ['M', 'L', 'XL'], images: ['p_img28.png'],
    },
    {
        name: 'Kid Tapered Slim Fit Trouser',
        description: 'Flexible-waist tapered trousers built for growing kids, with reinforced knees.',
        price: 599, category: 'Kids', subCategory: 'Bottomwear', bestseller: false, stock: 22,
        sizes: ['S', 'M', 'L'], images: ['p_img43.png'],
    },
    {
        name: 'Men Printed Plain Cotton Shirt',
        description: 'A versatile button-down in breathable cotton with a subtle printed texture.',
        price: 699, category: 'Men', subCategory: 'Topwear', bestseller: false, stock: 35,
        sizes: ['S', 'M', 'L', 'XL'], images: ['p_img39.png'],
    },
    {
        name: 'Women Relaxed Crewneck Top',
        description: 'An easy, relaxed crewneck top in a soft cotton blend — pairs with everything in your wardrobe.',
        price: 549, category: 'Women', subCategory: 'Topwear', bestseller: false, stock: 28,
        sizes: ['S', 'M', 'L'], images: ['p_img34.png'],
    },
    {
        name: 'Men Classic Round Neck Tee',
        description: 'A wardrobe staple: classic round-neck tee in mid-weight cotton jersey that keeps its shape wash after wash.',
        price: 449, category: 'Men', subCategory: 'Topwear', bestseller: false, stock: 50,
        sizes: ['S', 'M', 'L', 'XL'], images: ['p_img8.png'],
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
    if (product.compareAtPrice) form.append('compareAtPrice', String(product.compareAtPrice));
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
    console.log(`Logging in as ${ADMIN_EMAIL}...`);
    const token = await login();

    for (const product of products) {
        try {
            const created = await createProduct(token, product);
            console.log(`✔ ${created.name} (${created.id})`);
        } catch (err) {
            console.error(`✘ ${product.name}: ${err.message}`);
        }
    }
    console.log(`Done. ${products.length} products submitted.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
