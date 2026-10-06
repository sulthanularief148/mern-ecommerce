import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { inventoryService } from './inventory.service.js';

export const listStock = asyncHandler(async (req, res) => {
    const result = await inventoryService.listStock(req.validatedQuery || {});
    sendResponse(res, 200, result, 'Stock fetched');
});

export const listLowStock = asyncHandler(async (req, res) => {
    const result = await inventoryService.listLowStock(req.validatedQuery?.threshold);
    sendResponse(res, 200, result, 'Low stock items fetched');
});

export const adjustStock = asyncHandler(async (req, res) => {
    const product = await inventoryService.adjust(req.user.id, req.body);
    sendResponse(res, 200, { product }, 'Stock adjusted');
});

export const productHistory = asyncHandler(async (req, res) => {
    const adjustments = await inventoryService.history(req.params.productId);
    sendResponse(res, 200, { adjustments }, 'Adjustment history fetched');
});

export const recentActivity = asyncHandler(async (req, res) => {
    const adjustments = await inventoryService.recentActivity();
    sendResponse(res, 200, { adjustments }, 'Recent stock activity fetched');
});
