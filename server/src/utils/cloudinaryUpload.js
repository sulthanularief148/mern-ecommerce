import { cloudinary } from '../config/cloudinary.js';

export function uploadBufferToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image', folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
}
