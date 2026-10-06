import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { cartService } from './cart.service.js';

export const getCart = asyncHandler(async (req, res) => {
    const items = await cartService.getCart(req.user.id);
    sendResponse(res, 200, { items }, 'Cart fetched');
});

export const addItem = asyncHandler(async (req, res) => {
    const item = await cartService.addItem(req.user.id, req.body);
    sendResponse(res, 201, { item }, 'Added to cart');
});

export const updateItem = asyncHandler(async (req, res) => {
    const item = await cartService.updateItem(req.user.id, req.params.id, req.body.quantity);
    sendResponse(res, 200, { item }, item ? 'Cart item updated' : 'Cart item removed');
});

export const removeItem = asyncHandler(async (req, res) => {
    await cartService.removeItem(req.user.id, req.params.id);
    sendResponse(res, 200, null, 'Cart item removed');
});
