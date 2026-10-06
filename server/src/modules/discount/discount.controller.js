import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { discountService } from './discount.service.js';

export const applyDiscount = asyncHandler(async (req, res) => {
    const result = await discountService.apply(req.body);
    sendResponse(res, 200, result, 'Discount applied');
});

export const clearDiscount = asyncHandler(async (req, res) => {
    const result = await discountService.clear(req.body);
    sendResponse(res, 200, result, 'Discount cleared');
});

export const listOnSale = asyncHandler(async (req, res) => {
    const products = await discountService.onSale();
    sendResponse(res, 200, { products }, 'Products on sale fetched');
});
