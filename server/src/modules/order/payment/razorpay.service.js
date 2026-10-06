import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../../config/env.js';
import { CURRENCY } from '../../../constants/index.js';

const razorpayInstance = new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
});

export async function createRazorpayOrder(order) {
    return razorpayInstance.orders.create({
        amount: Math.round(Number(order.amount) * 100),
        currency: CURRENCY.toUpperCase(),
        receipt: order.id,
    });
}

export function verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', env.razorpay.keySecret).update(body).digest('hex');
    return expected === razorpay_signature;
}

export function fetchRazorpayOrder(razorpayOrderId) {
    return razorpayInstance.orders.fetch(razorpayOrderId);
}
