import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

const RetailerLayout = lazy(() => import('./layouts/RetailerLayout'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const OnboardingLayout = lazy(() => import('./layouts/OnboardingLayout'))

const Landing = lazy(() => import('./pages/auth/Landing'))
const Apply = lazy(() => import('./pages/auth/Apply'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'))

const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'))

const Dashboard = lazy(() => import('./pages/Dashboard'))
const ApiTestPanel = lazy(() => import('./pages/ApiTestPanel'))

const ProductList = lazy(() => import('./pages/products/ProductList'))
const ProductCreate = lazy(() => import('./pages/products/ProductCreate'))
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'))
const ProductImport = lazy(() => import('./pages/products/ProductImport'))

const Inventory = lazy(() => import('./pages/inventory/Inventory'))

const OrderList = lazy(() => import('./pages/orders/OrderList'))
const OrderDetail = lazy(() => import('./pages/orders/OrderDetail'))
const OrderStats = lazy(() => import('./pages/orders/OrderStats'))

const Payouts = lazy(() => import('./pages/finances/Payouts'))
const PayoutSetup = lazy(() => import('./pages/finances/PayoutSetup'))
const Revenue = lazy(() => import('./pages/finances/Revenue'))

const ShippingSettings = lazy(() => import('./pages/shipping/ShippingSettings'))

const Profile = lazy(() => import('./pages/account/Profile'))
const Settings = lazy(() => import('./pages/account/Settings'))

function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/** Root application component — defines all routes across three layout groups */
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Public / landing */}
          <Route path="/" element={<Landing />} />
          <Route path="/apply" element={<Apply />} />

          {/* Auth pages — centered card layout */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
            <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
          </Route>

          {/* Onboarding — step wizard layout (protected) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<OnboardingLayout />}>
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>
          </Route>

          {/* Authenticated retailer pages — sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RetailerLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductCreate />} />
              <Route path="/products/import" element={<ProductImport />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              <Route path="/inventory" element={<Inventory />} />

              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/stats" element={<OrderStats />} />
              <Route path="/orders/:id" element={<OrderDetail />} />

              <Route path="/finances/payouts" element={<Payouts />} />
              <Route path="/finances/payouts/setup" element={<PayoutSetup />} />
              <Route path="/finances/revenue" element={<Revenue />} />

              <Route path="/shipping/settings" element={<ShippingSettings />} />

              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/settings" element={<Settings />} />

              {import.meta.env.DEV && (
                <Route path="/api-test" element={<ApiTestPanel />} />
              )}

              {/* Catch-all: redirect unknown paths to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
