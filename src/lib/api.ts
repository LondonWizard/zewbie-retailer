import axios from 'axios'

/** Axios instance pre-configured with the API base URL from environment */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

/** Attach auth token to every outgoing request when available */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('retailer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
