import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { productService } from './product.service.js';
import { createProductSchema, updateProductSchema } from './product.validation.js';
import { exportProductsCsv, importProductsCsv } from './product.csv.js';

export const listProducts = asyncHandler(async (req, res) => {
    const query = req.validatedQuery || {};
    const result = await productService.list(query);
    sendResponse(res, 200, result, 'Products fetched');
});

export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getById(id);
    sendResponse(res, 200, { product }, 'Product fetched');
});

export const createProduct = asyncHandler(async (req, res) => {
    let sizes;
    try {
        sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
    } catch {
        throw ApiError.badRequest('Sizes must be valid JSON');
    }

    let sizeChart;
    try {
        sizeChart = typeof req.body.sizeChart === 'string' && req.body.sizeChart
            ? JSON.parse(req.body.sizeChart)
            : req.body.sizeChart;
    } catch {
        throw ApiError.badRequest('Size chart must be valid JSON');
    }

    const result = createProductSchema.safeParse({ ...req.body, sizes, sizeChart });
    if (!result.success) {
        throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);
    }

    const product = await productService.create(result.data, req.files);
    sendResponse(res, 201, { product }, 'Product added successfully');
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let sizes;
    try {
        sizes = req.body.sizes !== undefined && typeof req.body.sizes === 'string'
            ? JSON.parse(req.body.sizes) : req.body.sizes;
    } catch {
        throw ApiError.badRequest('Sizes must be valid JSON');
    }

    let sizeChart;
    try {
        sizeChart = typeof req.body.sizeChart === 'string' && req.body.sizeChart
            ? JSON.parse(req.body.sizeChart)
            : req.body.sizeChart;
    } catch {
        throw ApiError.badRequest('Size chart must be valid JSON');
    }

    let existingImages;
    try {
        existingImages = typeof req.body.existingImages === 'string' && req.body.existingImages
            ? JSON.parse(req.body.existingImages)
            : undefined;
    } catch {
        throw ApiError.badRequest('existingImages must be valid JSON');
    }

    const result = updateProductSchema.safeParse({ ...req.body, sizes, sizeChart });
    if (!result.success) {
        throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);
    }

    const product = await productService.update(id, result.data, req.files, existingImages);
    sendResponse(res, 200, { product }, 'Product updated successfully');
});

export const frequentlyBoughtTogether = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const products = await productService.frequentlyBoughtWith(id);
    sendResponse(res, 200, { products }, 'Frequently bought together fetched');
});

export const removeProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) throw ApiError.badRequest('Product id is required');
    await productService.remove(id);
    sendResponse(res, 200, null, 'Product removed successfully');
});

export const exportProducts = asyncHandler(async (req, res) => {
    const csv = await exportProductsCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
});

export const importProducts = asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('A CSV file is required');
    const result = await importProductsCsv(req.file.buffer.toString('utf-8'));
    sendResponse(res, 200, result, `Imported: ${result.created} created, ${result.updated} updated, ${result.errors.length} error(s)`);
});
