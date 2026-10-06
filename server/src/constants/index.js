export const CURRENCY = 'inr';
export const DELIVERY_FEE = 10; // kept for backward-compat imports; prefer DELIVERY_METHODS below

export const ORDER_STATUSES = [
    'ORDER_PLACED', 'PACKING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
];

export const PAYMENT_METHODS = ['COD', 'STRIPE', 'RAZORPAY'];

export const FREE_SHIPPING_THRESHOLD = 999;
export const TAX_RATE = 0.05; // flat 5% GST-style tax on the discounted subtotal

export const DELIVERY_METHODS = {
    STANDARD: { label: 'Standard Delivery', fee: 49, etaDays: [4, 6] },
    EXPRESS: { label: 'Express Delivery', fee: 149, etaDays: [1, 2] },
};

export const RETURN_WINDOW_DAYS = 7;
