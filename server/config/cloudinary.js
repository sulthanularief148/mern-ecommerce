import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';

dotenv.config();
const cloudinaryConnect = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
        })
    } catch (error) {
        console.log("Cloudinary connection Error", error);

    }
}
export default cloudinaryConnect;
