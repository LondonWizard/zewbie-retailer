import axios from 'axios'

/**
 * Axios instance for the Zewbie Retailer API.
 * Ensures the base URL always ends with /v1 to match the API's global prefix.
 */
function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1'
  return raw.endsWith('/v1') ? raw : `${raw.replace(/\/+$/, '')}/v1`
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('retailer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('retailer_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
