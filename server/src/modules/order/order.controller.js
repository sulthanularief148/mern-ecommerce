import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/ApiResponse.js';
import { orderService } from './order.service.js';
import { orderRepository } from './order.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { streamInvoicePdf } from './invoice.pdf.js';

export const placeOrderCOD = asyncHandler(async (req, res) => {
    const order = await orderService.placeOrderCOD(req.user.id, req.body);
    sendResponse(res, 201, { order }, 'Order placed successfully');
});

export const placeOrderStripe = asyncHandler(async (req, res) => {
    const origin = req.headers.origin || req.headers.referer || '';
    const result = await orderService.placeOrderStripe(req.user.id, req.body, origin);
    sendResponse(res, 201, { sessionUrl: result.sessionUrl, orderId: result.orderId }, 'Stripe session created');
});

export const placeOrderRazorpay = asyncHandler(async (req, res) => {
    const result = await orderService.placeOrderRazorpay(req.user.id, req.body);
    sendResponse(res, 201, { order: result.order, orderId: result.orderId }, 'Razorpay order created');
});

export const verifyStripe = asyncHandler(async (req, res) => {
    const result = await orderService.verifyStripe(req.user.id, req.body);
    sendResponse(res, 200, result, result.paid ? 'Payment confirmed' : 'Order cancelled');
});

export const verifyRazorpay = asyncHandler(async (req, res) => {
    const result = await orderService.verifyRazorpay(req.user.id, req.body);
    sendResponse(res, 200, result, result.paid ? 'Payment confirmed' : 'Payment not completed');
});

export const myOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.listForUser(req.user.id);
    sendResponse(res, 200, { orders }, 'Orders fetched');
});

export const getMyOrder = asyncHandler(async (req, res) => {
    const order = await orderService.getOne(req.user.id, req.params.id);
    sendResponse(res, 200, { order }, 'Order fetched');
});

export const allOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.listAll();
    sendResponse(res, 200, { orders }, 'Orders fetched');
});

export const updateStatus = asyncHandler(async (req, res) => {
    const order = await orderService.updateStatus(req.body.orderId, req.body.status, req.user.id);
    sendResponse(res, 200, { order }, 'Order status updated');
});

export const updateTracking = asyncHandler(async (req, res) => {
    const { orderId, trackingNumber, carrier, trackingUrl } = req.body;
    const order = await orderService.updateTracking(orderId, { trackingNumber, carrier, trackingUrl }, req.user.id);
    sendResponse(res, 200, { order }, 'Tracking info updated');
});

export const downloadInvoice = asyncHandler(async (req, res) => {
    const order = await orderRepository.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.userId !== req.user.id) throw ApiError.forbidden('Not authorized for this order');
    await streamInvoicePdf(order, res);
});

export const downloadInvoiceAdmin = asyncHandler(async (req, res) => {
    const order = await orderRepository.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');
    await streamInvoicePdf(order, res);
});
