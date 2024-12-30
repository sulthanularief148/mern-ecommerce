import { v2 as cloudinary } from 'cloudinary'
import upload from "../middlewares/multer.js"
import productModel from '../models/productModel.js';
// Add Product
const addProduct = async (req, res) => {
    try {

        const { name, description, category, price, subCategory, bestseller, sizes } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        let images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "No images provided" });
        }

        let imageUrls = await Promise.all(
            images.map(async (item) => {
                try {
                    const url = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                    return url.secure_url;
                } catch (uploadError) {
                    console.error(`Upload error for ${item.path}:`, uploadError.message);
                    return null;
                }
            })
        );

        imageUrls = imageUrls.filter((url) => url !== null);
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            images: imageUrls,
            date: Date.now()
        }
        const product = new productModel(productData)
        await product.save()
        res.json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).json({ success: false, message: `Error adding product: ${error.message}` });
    }
};

// Remove Product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.error("Error listing Removing:", error.message);
        res.status(500).json({ success: false, message: `Error Removing products: ${error.message}` });
    }
}


// List Product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error listing products:", error.message);
        res.status(500).json({ success: false, message: `Error listing products: ${error.message}` });
    }
};


// Single Product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, message: "Requested product fetched from DB", product: product })
    } catch (error) {
        console.error("Error fetching selected product:", error.message);
        res.status(500).json({ success: false, message: `Error fetching selected product: ${error.message}` });
    }
}

export { addProduct, removeProduct, listProduct, singleProduct };