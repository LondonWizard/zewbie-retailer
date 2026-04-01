import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RetailerLayout from './layouts/RetailerLayout'
import AuthLayout from './layouts/AuthLayout'
import OnboardingLayout from './layouts/OnboardingLayout'

import Landing from './pages/auth/Landing'
import Apply from './pages/auth/Apply'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'

import Onboarding from './pages/onboarding/Onboarding'

import Dashboard from './pages/Dashboard'
import ApiTestPanel from './pages/ApiTestPanel'

import ProductList from './pages/products/ProductList'
import ProductCreate from './pages/products/ProductCreate'
import ProductDetail from './pages/products/ProductDetail'
import ProductImport from './pages/products/ProductImport'

import Inventory from './pages/inventory/Inventory'

import OrderList from './pages/orders/OrderList'
import OrderDetail from './pages/orders/OrderDetail'
import OrderStats from './pages/orders/OrderStats'

import Payouts from './pages/finances/Payouts'
import PayoutSetup from './pages/finances/PayoutSetup'
import Revenue from './pages/finances/Revenue'

import ShippingSettings from './pages/shipping/ShippingSettings'

import Profile from './pages/account/Profile'
import Settings from './pages/account/Settings'

/** Root application component — defines all routes across three layout groups */
export default function App() {
  return (
    <BrowserRouter>
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

        {/* Onboarding — step wizard layout */}
        <Route element={<OnboardingLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* Authenticated retailer pages — sidebar layout */}
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

          <Route path="/api-test" element={<ApiTestPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
