import axios from 'axios';

const backendurl = import.meta.env.VITE_BACKEND_URL || '';

// The access token lives in memory only (module-level variable), never in
// localStorage/sessionStorage — that's what keeps it safe from XSS reading
// it off disk. The refresh token is an httpOnly cookie the browser handles
// automatically; withCredentials lets it round-trip on every request.
let accessToken = null;
let onAuthChange = () => {};

export function setAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

// Lets ShopContext react to forced logouts (refresh failed) without this
// module needing to know anything about React state.
export function setAuthChangeListener(listener) {
    onAuthChange = listener;
}

export const api = axios.create({
    baseURL: backendurl,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${backendurl}/api/auth/refresh`, {}, { withCredentials: true })
            .then((res) => {
                const token = res.data?.data?.accessToken;
                setAccessToken(token);
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            try {
                const token = await refreshAccessToken();
                if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch {
                setAccessToken(null);
                onAuthChange(null);
            }
        }

        return Promise.reject(error);
    }
);

export { refreshAccessToken, backendurl };
