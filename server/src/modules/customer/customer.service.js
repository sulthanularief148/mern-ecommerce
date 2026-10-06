import { customerRepository } from './customer.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const customerService = {
    async list({ page = 1, limit = 20, search }) {
        const skip = (page - 1) * limit;
        const [customers, total] = await Promise.all([
            customerRepository.findAll({ skip, take: limit, search }),
            customerRepository.count(search),
        ]);

        const spendRows = await customerRepository.spendTotals(customers.map((c) => c.id));
        const spendByUser = new Map(spendRows.map((r) => [r.userId, Number(r._sum.amount || 0)]));

        return {
            customers: customers.map((c) => ({
                id: c.id, name: c.name, email: c.email, createdAt: c.createdAt,
                orderCount: c._count.orders,
                totalSpend: spendByUser.get(c.id) || 0,
            })),
            total, page, totalPages: Math.ceil(total / limit),
        };
    },

    async detail(id) {
        const user = await customerRepository.findDetail(id);
        if (!user) throw ApiError.notFound('Customer not found');
        return {
            ...user,
            orders: user.orders.map((o) => ({ ...o, amount: Number(o.amount) })),
            totalSpend: user.orders.reduce((sum, o) => sum + Number(o.amount), 0),
        };
    },
};
