import PDFDocument from 'pdfkit';
import { settingsService } from '../settings/settings.service.js';

// Streams straight to the HTTP response instead of buffering the whole PDF
// in memory first — fine for a one-page invoice either way, but this is the
// pattern to keep if invoices ever grow multi-page (bulk order exports etc).
export async function streamInvoicePdf(order, res) {
    const settings = await settingsService.get();
    // pdfkit's built-in Helvetica is a standard PDF base-14 font (WinAnsi
    // encoding only) — it has no ₹ glyph and silently renders it as garbage.
    // Embedding a Unicode TTF just for one symbol isn't worth it here, so ₹
    // falls back to "Rs." (other currency symbols like $/€/£ are in WinAnsi
    // and render fine as-is).
    const currency = settings.currencySymbol === '₹' ? 'Rs. ' : (settings.currencySymbol || '$');
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.id.slice(0, 8)}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text(settings.storeName, { continued: false });
    doc.fontSize(9).fillColor('#666')
        .text(settings.address || '')
        .text(settings.supportEmail || '')
        .fillColor('#000');
    doc.moveDown(1.5);

    doc.fontSize(14).text('Invoice', { underline: true });
    doc.fontSize(10)
        .text(`Order ID: ${order.id}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
        .text(`Payment: ${order.paymentMethod}${order.payment ? ' (Paid)' : ' (Unpaid)'}`)
        .text(`Status: ${order.status}`);
    if (order.trackingNumber) {
        doc.text(`Tracking: ${order.carrier ? `${order.carrier} — ` : ''}${order.trackingNumber}`);
    }
    doc.moveDown(1);

    const address = order.address || {};
    doc.fontSize(11).text('Bill To', { underline: true });
    doc.fontSize(10).text(`${address.firstName || ''} ${address.lastName || ''}`.trim())
        .text(address.street || '')
        .text([address.city, address.state, address.zipcode].filter(Boolean).join(', '))
        .text(address.country || '')
        .text(address.phone || '');
    doc.moveDown(1.5);

    const tableTop = doc.y;
    const col = { name: 50, size: 300, qty: 360, price: 420, total: 480 };
    doc.fontSize(10).font('Helvetica-Bold')
        .text('Item', col.name, tableTop)
        .text('Size', col.size, tableTop)
        .text('Qty', col.qty, tableTop)
        .text('Price', col.price, tableTop)
        .text('Total', col.total, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).strokeColor('#ddd').stroke();
    doc.font('Helvetica');

    let y = tableTop + 22;
    for (const item of order.items || []) {
        const lineTotal = Number(item.price) * item.quantity;
        doc.fontSize(9)
            .text(item.name, col.name, y, { width: 240 })
            .text(item.size || '-', col.size, y)
            .text(String(item.quantity), col.qty, y)
            .text(`${currency}${Number(item.price).toFixed(2)}`, col.price, y)
            .text(`${currency}${lineTotal.toFixed(2)}`, col.total, y);
        y += 20;
    }

    doc.moveTo(50, y + 5).lineTo(545, y + 5).strokeColor('#ddd').stroke();
    y += 15;

    const totals = [
        ['Subtotal', order.subtotal],
        ...(Number(order.discountAmount) > 0 ? [['Discount' + (order.couponCode ? ` (${order.couponCode})` : ''), -order.discountAmount]] : []),
        ['Shipping', order.shippingFee],
        ['Tax', order.taxAmount],
    ];
    for (const [label, value] of totals) {
        doc.fontSize(9).text(label, col.price - 60, y).text(`${currency}${Number(value).toFixed(2)}`, col.total, y);
        y += 16;
    }
    doc.fontSize(11).font('Helvetica-Bold')
        .text('Total', col.price - 60, y)
        .text(`${currency}${Number(order.amount).toFixed(2)}`, col.total, y);

    doc.end();
}
