import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cloudinaryConnect from './config/cloudinary.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import upload from './middleware/multer.js';


dotenv.config();

// App Config
const app = express();
const port = process.env.PORT || 3000;


cloudinaryConnect()
    .then(() => {
        console.log('Connected to Cloudinary Successfully');
    })
    .catch((error) => {
        console.error('Failed to connect to Cloudinary:', error);
    });


app.use(express.json());
app.use(cors());




const imageFields = [...Array(200).keys()].map(i => ({
    name: `image${i + 1}`,
    maxCount: 1
}));


app.post("/add", upload.fields(imageFields), async (req, res) => {
    try {

        const images = Object.keys(req.files).map(field => req.files[field][0]).filter(item => item !== undefined);
        console.log(images, "images");


        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "No images provided" });
        }

        const imageUrls = await Promise.all(
            images.map(async (item) => {
                try {
                    const result = await cloudinary.v2.uploader.upload(item.path, { resource_type: "image" });
                    return result.secure_url;
                } catch (uploadError) {
                    console.error(`Upload error for ${item.path}:`, uploadError.message);
                    return null;
                }
            })
        );
        const productData = {
            images: imageUrls.filter(url => url !== null),
        };
        console.log(productData, "Product Data");
        res.json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).json({ success: false, message: `Error adding product: ${error.message}` });
    }
});

// Server listen
app.listen(port, () => console.log(`The server running on PORT ${port}`));
