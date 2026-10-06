import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { collectionService } from './collection.service.js';
import { createCollectionSchema, updateCollectionSchema } from './collection.validation.js';

export const listAllCollections = asyncHandler(async (req, res) => {
    const collections = await collectionService.listAllForAdmin();
    sendResponse(res, 200, { collections }, 'Collections fetched');
});

export const listActiveCollections = asyncHandler(async (req, res) => {
    const collections = await collectionService.listActive();
    sendResponse(res, 200, { collections }, 'Collections fetched');
});

export const createCollection = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (body.active !== undefined) body.active = body.active === 'true' || body.active === true;

    const result = createCollectionSchema.safeParse(body);
    if (!result.success) throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);

    const collection = await collectionService.create(result.data, req.file);
    sendResponse(res, 201, { collection }, 'Collection created');
});

export const updateCollection = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (body.active !== undefined) body.active = body.active === 'true' || body.active === true;

    const result = updateCollectionSchema.safeParse(body);
    if (!result.success) throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);

    const collection = await collectionService.update(req.params.id, result.data, req.file);
    sendResponse(res, 200, { collection }, 'Collection updated');
});

export const removeCollection = asyncHandler(async (req, res) => {
    await collectionService.remove(req.params.id);
    sendResponse(res, 200, null, 'Collection removed');
});
