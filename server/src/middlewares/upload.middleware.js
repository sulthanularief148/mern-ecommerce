import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const fileFilter = (req, file, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Only JPEG, PNG, WEBP and AVIF images are allowed'));
    }
};

// Serverless deploy targets (Vercel) have a read-only filesystem, and even in
// Docker there's no reason to touch disk — files are held in memory and
// streamed straight to Cloudinary.
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 4 },
});

export const uploadProductImages = (req, res, next) => {
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return next(ApiError.badRequest(`Upload error: ${err.message}`));
        }
        if (err) return next(ApiError.badRequest(err.message));
        next();
    });
};

export const uploadSingleImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return next(ApiError.badRequest(`Upload error: ${err.message}`));
        }
        if (err) return next(ApiError.badRequest(err.message));
        next();
    });
};

const csvUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => {
        const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/plain'];
        if (allowed.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.csv')) {
            callback(null, true);
        } else {
            callback(new Error('Only CSV files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

export const uploadCsv = (req, res, next) => {
    csvUpload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return next(ApiError.badRequest(`Upload error: ${err.message}`));
        }
        if (err) return next(ApiError.badRequest(err.message));
        next();
    });
};
