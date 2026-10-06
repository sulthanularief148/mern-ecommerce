import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { settingsService } from './settings.service.js';

export const getSettings = asyncHandler(async (req, res) => {
    const settings = await settingsService.get();
    sendResponse(res, 200, { settings }, 'Settings fetched');
});

// Only the fields the storefront needs to render accurate checkout/contact
// info — deliberately not the full settings object (no reason to expose
// admin-only config to an unauthenticated request).
export const getPublicSettings = asyncHandler(async (req, res) => {
    const settings = await settingsService.get();
    sendResponse(res, 200, {
        settings: {
            storeName: settings.storeName,
            supportEmail: settings.supportEmail,
            supportPhone: settings.supportPhone,
            address: settings.address,
            currencySymbol: settings.currencySymbol,
            taxRatePercent: settings.taxRatePercent,
            standardShippingFee: settings.standardShippingFee,
            expressShippingFee: settings.expressShippingFee,
            freeShippingThreshold: settings.freeShippingThreshold,
            socialInstagram: settings.socialInstagram,
            socialFacebook: settings.socialFacebook,
        },
    }, 'Settings fetched');
});

export const updateSettings = asyncHandler(async (req, res) => {
    const settings = await settingsService.update(req.body);
    sendResponse(res, 200, { settings }, 'Settings updated');
});
