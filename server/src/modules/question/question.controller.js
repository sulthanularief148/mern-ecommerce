import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { questionService } from './question.service.js';

export const createQuestion = asyncHandler(async (req, res) => {
    const question = await questionService.create(req.user.id, req.body);
    sendResponse(res, 201, { question }, 'Question submitted — we\'ll notify you once it\'s answered');
});

export const listForProduct = asyncHandler(async (req, res) => {
    const questions = await questionService.listAnsweredForProduct(req.params.productId);
    sendResponse(res, 200, { questions }, 'Questions fetched');
});

export const listAllForAdmin = asyncHandler(async (req, res) => {
    const questions = await questionService.listAllForAdmin();
    sendResponse(res, 200, { questions }, 'Questions fetched');
});

export const answerQuestion = asyncHandler(async (req, res) => {
    const question = await questionService.answer(req.params.id, req.body.answer, req.user.id);
    sendResponse(res, 200, { question }, 'Answer submitted');
});
