import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { loyaltyRepository } from './loyalty.repository.js';
import { loyaltyService } from './loyalty.service.js';
import { settingsService } from '../settings/settings.service.js';

export const me = asyncHandler(async (req, res) => {
    const [user, ledger, settings] = await Promise.all([
        loyaltyRepository.findUserById(req.user.id),
        loyaltyService.getLedger(req.user.id),
        settingsService.get(),
    ]);
    sendResponse(res, 200, {
        balance: user.loyaltyPoints,
        ledger,
        pointValueInCurrency: settings.pointValueInCurrency,
        pointsPerCurrencyUnit: settings.pointsPerCurrencyUnit,
    }, 'Loyalty summary fetched');
});

export const quoteRedemption = asyncHandler(async (req, res) => {
    const quote = await loyaltyService.quoteRedemption(req.user.id, req.body.points);
    sendResponse(res, 200, quote, 'Redemption quote');
});

export const adminGetForUser = asyncHandler(async (req, res) => {
    const [user, ledger] = await Promise.all([
        loyaltyRepository.findUserById(req.params.userId),
        loyaltyService.getLedger(req.params.userId),
    ]);
    sendResponse(res, 200, { balance: user?.loyaltyPoints ?? 0, ledger }, 'Loyalty summary fetched');
});

export const adminAdjust = asyncHandler(async (req, res) => {
    await loyaltyService.adminAdjust(req.body.userId, req.body.points, req.body.reason, req.user.id);
    sendResponse(res, 200, null, 'Points balance adjusted');
});
