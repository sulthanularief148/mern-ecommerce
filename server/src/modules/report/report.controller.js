import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { reportService } from './report.service.js';

export const salesReport = asyncHandler(async (req, res) => {
    const data = await reportService.sales({ days: req.query.days ? Number(req.query.days) : undefined });
    sendResponse(res, 200, data, 'Sales report fetched');
});

export const productsReport = asyncHandler(async (req, res) => {
    const data = await reportService.products({ limit: req.query.limit ? Number(req.query.limit) : undefined });
    sendResponse(res, 200, data, 'Products report fetched');
});

export const customersReport = asyncHandler(async (req, res) => {
    const data = await reportService.customers({ days: req.query.days ? Number(req.query.days) : undefined });
    sendResponse(res, 200, data, 'Customers report fetched');
});

export const inventoryReport = asyncHandler(async (req, res) => {
    const data = await reportService.inventory();
    sendResponse(res, 200, data, 'Inventory report fetched');
});
