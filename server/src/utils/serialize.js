// Prisma returns money columns as Decimal.js instances and JSON columns as-is.
// Controllers must never leak a Decimal object straight into res.json (it
// serializes as {"s":1,"e":2,"d":[100]} instead of a plain number), so every
// Prisma row that reaches a response goes through one of these first.
export function serializeProduct(product) {
    if (!product) return product;
    return {
        ...product,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice != null ? Number(product.compareAtPrice) : null,
    };
}

export function serializeOrder(order) {
    if (!order) return order;
    return {
        ...order,
        amount: Number(order.amount),
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discountAmount),
        taxAmount: Number(order.taxAmount),
        shippingFee: Number(order.shippingFee),
        items: order.items?.map((item) => ({
            ...item,
            price: Number(item.price),
        })),
    };
}

export function serializeCoupon(coupon) {
    if (!coupon) return coupon;
    return {
        ...coupon,
        value: Number(coupon.value),
        minOrderAmount: Number(coupon.minOrderAmount),
        maxDiscount: coupon.maxDiscount != null ? Number(coupon.maxDiscount) : null,
    };
}

export function serializeReturnRequest(returnRequest) {
    if (!returnRequest) return returnRequest;
    return {
        ...returnRequest,
        order: returnRequest.order ? {
            ...returnRequest.order,
            ...(returnRequest.order.amount !== undefined ? { amount: Number(returnRequest.order.amount) } : {}),
            ...(returnRequest.order.subtotal !== undefined ? { subtotal: Number(returnRequest.order.subtotal) } : {}),
            ...(returnRequest.order.discountAmount !== undefined ? { discountAmount: Number(returnRequest.order.discountAmount) } : {}),
            ...(returnRequest.order.taxAmount !== undefined ? { taxAmount: Number(returnRequest.order.taxAmount) } : {}),
            ...(returnRequest.order.shippingFee !== undefined ? { shippingFee: Number(returnRequest.order.shippingFee) } : {}),
        } : returnRequest.order,
    };
}

export function serializeCartItem(item) {
    if (!item) return item;
    return {
        ...item,
        product: item.product ? serializeProduct(item.product) : undefined,
    };
}
