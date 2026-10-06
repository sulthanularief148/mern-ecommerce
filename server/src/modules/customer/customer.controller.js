import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { customerService } from './customer.service.js';

export const listCustomers = asyncHandler(async (req, res) => {
    const result = await customerService.list(req.validatedQuery || {});
    sendResponse(res, 200, result, 'Customers fetched');
});

export const getCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.detail(req.params.id);
    sendResponse(res, 200, { customer }, 'Customer fetched');
});
