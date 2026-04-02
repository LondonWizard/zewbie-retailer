import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

import RetailerLayout from './layouts/RetailerLayout'
import AuthLayout from './layouts/AuthLayout'
import OnboardingLayout from './layouts/OnboardingLayout'
import ProtectedRoute from './components/ProtectedRoute'

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
const NotFound = lazy(() => import('./pages/NotFound'))

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

/** Root application component — defines all routes across layout groups */
export default function App() {
  return (
    <Routes>
      {/* Public / landing */}
      <Route path="/" element={<Landing />} />
      <Route path="/apply" element={<Apply />} />

      {/* Auth pages — centered card layout */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login/*" element={<Login />} />
        <Route path="/auth/register/*" element={<Register />} />
        <Route path="/auth/forgot-password/*" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding */}
        <Route element={<OnboardingLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* Authenticated retailer pages */}
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

          {import.meta.env.DEV && <Route path="/api-test" element={<ApiTestPanel />} />}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
