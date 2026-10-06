import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { bannerService } from './banner.service.js';
import { createBannerSchema, updateBannerSchema } from './banner.validation.js';

export const listAllBanners = asyncHandler(async (req, res) => {
    const banners = await bannerService.listAll();
    sendResponse(res, 200, { banners }, 'Banners fetched');
});

export const listActiveBanners = asyncHandler(async (req, res) => {
    const { slot } = req.params;
    const banners = await bannerService.listActiveBySlot(slot);
    sendResponse(res, 200, { banners }, 'Banners fetched');
});

export const createBanner = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (body.active !== undefined) body.active = body.active === 'true' || body.active === true;
    if (body.sortOrder !== undefined && body.sortOrder === '') delete body.sortOrder;

    const result = createBannerSchema.safeParse(body);
    if (!result.success) throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);

    const banner = await bannerService.create(result.data, req.file);
    sendResponse(res, 201, { banner }, 'Banner created');
});

export const updateBanner = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (body.active !== undefined) body.active = body.active === 'true' || body.active === true;
    if (body.sortOrder !== undefined && body.sortOrder === '') delete body.sortOrder;

    const result = updateBannerSchema.safeParse(body);
    if (!result.success) throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);

    const banner = await bannerService.update(req.params.id, result.data, req.file);
    sendResponse(res, 200, { banner }, 'Banner updated');
});

export const removeBanner = asyncHandler(async (req, res) => {
    await bannerService.remove(req.params.id);
    sendResponse(res, 200, null, 'Banner removed');
});
