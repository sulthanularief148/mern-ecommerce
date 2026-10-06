import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { couponService } from './coupon.service.js';

export const validateCoupon = asyncHandler(async (req, res) => {
    const { code, subtotal } = req.body;
    const result = await couponService.validate(code, subtotal);
    sendResponse(res, 200, result, 'Coupon applied');
});

export const listCoupons = asyncHandler(async (req, res) => {
    const coupons = await couponService.list();
    sendResponse(res, 200, { coupons }, 'Coupons fetched');
});

export const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await couponService.create(req.body);
    sendResponse(res, 201, { coupon }, 'Coupon created');
});

export const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw ApiError.badRequest('Coupon id is required');
    const coupon = await couponService.update(id, req.body);
    sendResponse(res, 200, { coupon }, 'Coupon updated');
});

export const removeCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await couponService.remove(id);
    sendResponse(res, 200, null, 'Coupon removed');
});
