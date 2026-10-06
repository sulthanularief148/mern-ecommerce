import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { dashboardService } from './dashboard.service.js';

export const getSummary = asyncHandler(async (req, res) => {
    const summary = await dashboardService.summary();
    sendResponse(res, 200, summary, 'Dashboard summary fetched');
});
