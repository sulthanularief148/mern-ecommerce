import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from './logger.js';

const isConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.password);

const transporter = isConfigured
    ? nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465,
        auth: { user: env.smtp.user, pass: env.smtp.password },
    })
    : null;

// No SMTP credentials configured (local/dev by default) — log the email
// instead of sending it so password-reset etc. still work end-to-end
// without requiring real credentials.
export async function sendMail({ to, subject, html, text, replyTo }) {
    if (!transporter) {
        logger.warn(`SMTP not configured — logging email instead of sending.\nTo: ${to}\nSubject: ${subject}\n${text || html}`);
        return { delivered: false };
    }

    try {
        await transporter.sendMail({ from: env.smtp.fromAddress, to, subject, html, text, ...(replyTo ? { replyTo } : {}) });
        return { delivered: true };
    } catch (err) {
        logger.error(`Failed to send email to ${to}: ${err.message}`);
        return { delivered: false };
    }
}
