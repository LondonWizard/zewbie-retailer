import axios from 'axios';

/** Axios instance pre-configured with the backend base URL from env */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

type TokenGetter = () => Promise<string | null>;
let _getToken: TokenGetter | null = null;

/** Called by AuthProvider to wire up Clerk's getToken for API requests */
export function registerTokenGetter(fn: TokenGetter | null) {
  _getToken = fn;
}

api.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token retrieval failed — continue without auth header
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  },
);

export default api;
