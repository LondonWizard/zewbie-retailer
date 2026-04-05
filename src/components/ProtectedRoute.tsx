import { Navigate, Outlet } from 'react-router-dom'

/** Redirects to login if no auth token is present in localStorage */
export default function ProtectedRoute() {
  const token = localStorage.getItem('retailer_token')
  if (!token) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
