import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { returnService } from './return.service.js';

export const createReturn = asyncHandler(async (req, res) => {
    const returnRequest = await returnService.create(req.user.id, req.body);
    sendResponse(res, 201, { returnRequest }, 'Return request submitted');
});

export const myReturns = asyncHandler(async (req, res) => {
    const returnRequests = await returnService.listForUser(req.user.id);
    sendResponse(res, 200, { returnRequests }, 'Return requests fetched');
});

export const allReturns = asyncHandler(async (req, res) => {
    const returnRequests = await returnService.listAll();
    sendResponse(res, 200, { returnRequests }, 'Return requests fetched');
});

export const updateReturn = asyncHandler(async (req, res) => {
    const returnRequest = await returnService.updateStatus(req.params.id, req.body, req.user.id);
    sendResponse(res, 200, { returnRequest }, 'Return request updated');
});
