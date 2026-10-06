import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { wishlistService } from './wishlist.service.js';

export const getWishlist = asyncHandler(async (req, res) => {
    const items = await wishlistService.list(req.user.id);
    sendResponse(res, 200, { items }, 'Wishlist fetched');
});

export const addToWishlist = asyncHandler(async (req, res) => {
    await wishlistService.add(req.user.id, req.body.productId);
    sendResponse(res, 201, null, 'Added to wishlist');
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    await wishlistService.remove(req.user.id, req.params.productId);
    sendResponse(res, 200, null, 'Removed from wishlist');
});
