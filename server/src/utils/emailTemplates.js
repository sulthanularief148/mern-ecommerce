export function passwordResetEmail({ name, resetUrl }) {
    const subject = "Reset your Webfarm's Wear password";
    const text = `Hi ${name},\n\nWe received a request to reset your password. This link expires in 30 minutes:\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">Reset your password</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your Webfarm's Wear password. This link expires in 30 minutes.</p>
            <p style="margin: 24px 0;">
                <a href="${resetUrl}" style="background:#0F172A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;display:inline-block;">
                    Reset Password
                </a>
            </p>
            <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
        </div>
    `;
    return { subject, text, html };
}

const STATUS_COPY = {
    PACKING: { label: 'Packing', blurb: 'Your order is being packed and will ship soon.' },
    SHIPPED: { label: 'Shipped', blurb: 'Your order is on its way.' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', blurb: 'Your order is out for delivery — it should arrive today.' },
    DELIVERED: { label: 'Delivered', blurb: 'Your order has been delivered. We hope you love it!' },
    CANCELLED: { label: 'Cancelled', blurb: 'Your order has been cancelled.' },
};

export function orderStatusEmail({ name, order, status }) {
    const copy = STATUS_COPY[status] || { label: status, blurb: 'Your order status has been updated.' };
    const orderRef = order.id.slice(0, 8).toUpperCase();
    const tracking = order.trackingNumber
        ? `\nTracking: ${order.carrier ? `${order.carrier} — ` : ''}${order.trackingNumber}`
        : '';

    const subject = `Order #${orderRef} — ${copy.label}`;
    const text = `Hi ${name},\n\n${copy.blurb}${tracking}\n\nOrder #${orderRef}\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">Order #${orderRef}: ${copy.label}</h2>
            <p>Hi ${name},</p>
            <p>${copy.blurb}</p>
            ${order.trackingNumber ? `<p style="color:#374151;font-size:14px;"><strong>Tracking:</strong> ${order.carrier ? `${order.carrier} — ` : ''}${order.trackingNumber}</p>` : ''}
            <p style="color:#6b7280;font-size:13px;margin-top:24px;">You can view full order details anytime from your account's Orders page.</p>
        </div>
    `;
    return { subject, text, html };
}

export function abandonedCartEmail({ name, items, cartUrl, currency }) {
    const subject = 'You left something in your cart';
    const itemLines = items.map((i) => `- ${i.name} (${currency}${i.price})`).join('\n');
    const text = `Hi ${name},\n\nYou still have items waiting in your cart:\n${itemLines}\n\nComplete your order: ${cartUrl}\n\n— Webfarm's Wear`;
    const itemRows = items.map((i) => `
        <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            ${i.image ? `<img src="${i.image}" width="48" height="48" style="border-radius:8px;object-fit:cover;" />` : ''}
            <div><p style="margin:0;font-size:14px;">${i.name}</p><p style="margin:0;font-size:13px;color:#6b7280;">${currency}${i.price}</p></div>
        </div>`).join('');
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">You left something behind</h2>
            <p>Hi ${name}, these are still waiting in your cart:</p>
            <div>${itemRows}</div>
            <p style="margin: 24px 0;">
                <a href="${cartUrl}" style="background:#0F172A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;display:inline-block;">
                    Complete Your Order
                </a>
            </p>
        </div>
    `;
    return { subject, text, html };
}

export function questionAnsweredEmail({ name, productName, question, answer }) {
    const subject = `Your question about "${productName}" was answered`;
    const text = `Hi ${name},\n\nYour question: "${question}"\n\nOur answer: ${answer}\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">Your question was answered</h2>
            <p>Hi ${name}, you asked about <strong>${productName}</strong>:</p>
            <p style="color:#374151;font-style:italic;">"${question}"</p>
            <p style="margin-top:16px;">${answer}</p>
        </div>
    `;
    return { subject, text, html };
}

export function returnRequestEmail({ name, orderRef, status, adminNote }) {
    const labels = { REQUESTED: 'Received', APPROVED: 'Approved', REJECTED: 'Rejected', COMPLETED: 'Completed' };
    const label = labels[status] || status;
    const subject = `Return request for order #${orderRef} — ${label}`;
    const text = `Hi ${name},\n\nYour return request for order #${orderRef} is now: ${label}.${adminNote ? `\n\nNote from our team: ${adminNote}` : ''}\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">Return request: ${label}</h2>
            <p>Hi ${name},</p>
            <p>Your return request for order #${orderRef} is now <strong>${label}</strong>.</p>
            ${adminNote ? `<p style="color:#374151;font-size:14px;">Note from our team: ${adminNote}</p>` : ''}
        </div>
    `;
    return { subject, text, html };
}

export function pointsEarnedEmail({ name, points, orderRef, balance }) {
    const subject = `You earned ${points} points`;
    const text = `Hi ${name},\n\nYou earned ${points} loyalty points from order #${orderRef}.\n\nYour new balance: ${balance} points.\n\nRedeem them for a discount at checkout anytime.\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">You earned ${points} points</h2>
            <p>Hi ${name},</p>
            <p>Thanks for your order #${orderRef} — you just earned <strong>${points} loyalty points</strong>.</p>
            <p style="color:#374151;font-size:14px;">Your new balance: <strong>${balance} points</strong></p>
            <p style="color:#6b7280;font-size:13px;margin-top:16px;">Redeem them for a discount at checkout anytime from your account.</p>
        </div>
    `;
    return { subject, text, html };
}

export function referralSignupBonusEmail({ name, points, balance }) {
    const subject = `Welcome! You got ${points} bonus points`;
    const text = `Hi ${name},\n\nWelcome to Webfarm's Wear! Since you signed up with a referral link, you got ${points} bonus loyalty points.\n\nYour balance: ${balance} points.\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">Welcome to Webfarm's Wear!</h2>
            <p>Hi ${name},</p>
            <p>Since you signed up with a referral link, you got a bonus of <strong>${points} loyalty points</strong>.</p>
            <p style="color:#374151;font-size:14px;">Your balance: <strong>${balance} points</strong></p>
            <p style="color:#6b7280;font-size:13px;margin-top:16px;">You also have your own referral link — find it on your profile page to start earning points by inviting friends.</p>
        </div>
    `;
    return { subject, text, html };
}

export function referralBonusEmail({ name, points, balance }) {
    const subject = `Your referral earned you ${points} points`;
    const text = `Hi ${name},\n\nSomeone you referred just placed their first order — you earned ${points} loyalty points.\n\nYour balance: ${balance} points.\n\n— Webfarm's Wear`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">Your referral paid off</h2>
            <p>Hi ${name},</p>
            <p>Someone you referred just placed their first order — you earned <strong>${points} loyalty points</strong>.</p>
            <p style="color:#374151;font-size:14px;">Your balance: <strong>${balance} points</strong></p>
            <p style="color:#6b7280;font-size:13px;margin-top:16px;">Keep sharing your referral link from your profile page to earn more.</p>
        </div>
    `;
    return { subject, text, html };
}

// Sent to the store's own support inbox, not the customer — reply-to is set
// to the customer's address so a reply from the support inbox goes straight
// back to them without needing to copy/paste their email.
export function contactFormEmail({ name, email, message }) {
    const subject = `New contact form message from ${name}`;
    const text = `From: ${name} <${email}>\n\n${message}`;
    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
            <h2 style="color: #0F172A;">New contact form message</h2>
            <p style="color:#374151;font-size:14px;">From: <strong>${name}</strong> &lt;${email}&gt;</p>
            <p style="white-space:pre-line;margin-top:16px;">${message}</p>
        </div>
    `;
    return { subject, text, html };
}
