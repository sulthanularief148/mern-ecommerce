import { api } from '../lib/apiClient';

export async function fetchPublicSettings() {
    const res = await api.get('/api/settings/public');
    return res.data.data.settings;
}
