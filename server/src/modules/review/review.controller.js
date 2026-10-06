import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { reviewService } from './review.service.js';

export const listReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.listForProduct(req.params.productId);
    sendResponse(res, 200, result, 'Reviews fetched');
});

export const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.create(req.user.id, req.params.productId, req.body);
    sendResponse(res, 201, { review }, 'Review submitted');
});

export const listAllReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.listAllForAdmin(req.validatedQuery || {});
    sendResponse(res, 200, result, 'Reviews fetched');
});

export const removeReview = asyncHandler(async (req, res) => {
    await reviewService.remove(req.params.id);
    sendResponse(res, 200, null, 'Review removed');
});
