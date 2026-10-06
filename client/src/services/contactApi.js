import { api } from '../lib/apiClient';

export async function submitContactForm({ name, email, message }) {
    const res = await api.post('/api/contact', { name, email, message });
    return res.data.message;
}
