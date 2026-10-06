import { api, setAccessToken } from '../lib/apiClient';

export async function register({ name, email, password, referralCode }) {
    const res = await api.post('/api/auth/register', { name, email, password, referralCode });
    setAccessToken(res.data.data.accessToken);
    return res.data.data.user;
}

export async function login({ email, password }) {
    const res = await api.post('/api/auth/login', { email, password });
    setAccessToken(res.data.data.accessToken);
    return res.data.data.user;
}

export async function logout() {
    try {
        await api.post('/api/auth/logout');
    } finally {
        setAccessToken(null);
    }
}

export async function fetchMe() {
    const res = await api.get('/api/auth/me');
    return res.data.data.user;
}

export async function updateProfile({ name }) {
    const res = await api.patch('/api/auth/me', { name });
    return res.data.data.user;
}

export async function changePassword({ currentPassword, newPassword }) {
    const res = await api.post('/api/auth/change-password', { currentPassword, newPassword });
    return res.data;
}

export async function fetchAccountStats() {
    const res = await api.get('/api/auth/stats');
    return res.data.data;
}

export async function forgotPassword(email) {
    const res = await api.post('/api/auth/forgot-password', { email });
    return res.data.message;
}

export async function resetPassword({ token, newPassword }) {
    const res = await api.post('/api/auth/reset-password', { token, newPassword });
    return res.data.message;
}
