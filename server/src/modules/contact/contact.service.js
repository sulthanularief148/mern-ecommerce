import { sendMail } from '../../config/mailer.js';
import { contactFormEmail } from '../../utils/emailTemplates.js';
import { settingsService } from '../settings/settings.service.js';

export const contactService = {
    // Same convention as password-reset/order emails elsewhere in this app:
    // sendMail() logs instead of sending when SMTP isn't configured (local
    // dev), and this never blocks the customer-facing success response on
    // whether delivery actually happened server-side.
    async submit({ name, email, message }) {
        const settings = await settingsService.get();
        const { subject, text, html } = contactFormEmail({ name, email, message });
        await sendMail({ to: settings.supportEmail, subject, text, html, replyTo: email });
    },
};
