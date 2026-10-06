import { z } from 'zod';

export const updateSettingsSchema = z.object({
    storeName: z.string().trim().min(1).max(120).optional(),
    supportEmail: z.string().trim().email().optional(),
    supportPhone: z.string().trim().max(30).optional(),
    address: z.string().trim().max(300).optional(),
    currencySymbol: z.string().trim().max(5).optional(),
    taxRatePercent: z.coerce.number().min(0).max(100).optional(),
    standardShippingFee: z.coerce.number().min(0).optional(),
    expressShippingFee: z.coerce.number().min(0).optional(),
    freeShippingThreshold: z.coerce.number().min(0).optional(),
    socialInstagram: z.string().trim().max(300).optional().or(z.literal('')),
    socialFacebook: z.string().trim().max(300).optional().or(z.literal('')),
    pointsPerCurrencyUnit: z.coerce.number().min(0).optional(),
    pointValueInCurrency: z.coerce.number().min(0).optional(),
    referralSignupBonusPoints: z.coerce.number().int().min(0).optional(),
    referralBonusPoints: z.coerce.number().int().min(0).optional(),
});
