import axios from 'axios'

/** Axios instance pre-configured with the API base URL from environment */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1',
})

/** Attach auth token to every outgoing request when available */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('retailer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Clear token and redirect to login on 401 responses */
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
