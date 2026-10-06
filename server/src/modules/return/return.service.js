import { returnRepository } from './return.repository.js';
import { orderRepository } from '../order/order.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { recordAudit } from '../../utils/auditLog.js';
import { sendMail } from '../../config/mailer.js';
import { returnRequestEmail } from '../../utils/emailTemplates.js';
import { logger } from '../../config/logger.js';
import { RETURN_WINDOW_DAYS } from '../../constants/index.js';
import { serializeReturnRequest } from '../../utils/serialize.js';

async function notify(returnRequest, status) {
    const order = returnRequest.order;
    const user = returnRequest.user;
    if (!user?.email) return;
    try {
        const { subject, text, html } = returnRequestEmail({
            name: user.name, orderRef: order.id.slice(0, 8).toUpperCase(), status, adminNote: returnRequest.adminNote,
        });
        await sendMail({ to: user.email, subject, text, html });
    } catch (err) {
        logger.error(`Failed to send return-status email: ${err.message}`);
    }
}

export const returnService = {
    async create(userId, { orderId, reason }) {
        const order = await orderRepository.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        if (order.userId !== userId) throw ApiError.forbidden('Not authorized for this order');
        if (order.status !== 'DELIVERED') {
            throw ApiError.badRequest('Only delivered orders can be returned');
        }

        // order.updatedAt is an approximation of "delivered at" — the schema
        // doesn't track a separate delivery timestamp, so an admin editing
        // tracking info after delivery would nudge this window forward. Not
        // worth a dedicated column for how rarely that overlap would happen.
        const daysSinceUpdate = (Date.now() - new Date(order.updatedAt).getTime()) / (24 * 60 * 60 * 1000);
        if (daysSinceUpdate > RETURN_WINDOW_DAYS) {
            throw ApiError.badRequest(`Returns must be requested within ${RETURN_WINDOW_DAYS} days of delivery`);
        }

        const existing = await returnRepository.findOpenForOrder(orderId);
        if (existing) throw ApiError.badRequest('A return request for this order is already in progress');

        return returnRepository.create({ orderId, userId, reason });
    },

    async listForUser(userId) {
        const rows = await returnRepository.findByUser(userId);
        return rows.map(serializeReturnRequest);
    },

    async listAll() {
        const rows = await returnRepository.findAll();
        return rows.map(serializeReturnRequest);
    },

    async updateStatus(id, { status, adminNote }, actorId) {
        const existing = await returnRepository.findById(id);
        if (!existing) throw ApiError.notFound('Return request not found');

        await returnRepository.updateStatus(id, status, adminNote);
        const updated = await returnRepository.findById(id);

        await notify(updated, status);
        await recordAudit({
            actorId, action: 'return.status_update', targetType: 'return_request', targetId: id,
            metadata: { from: existing.status, to: status },
        });
        return serializeReturnRequest(updated);
    },
};
