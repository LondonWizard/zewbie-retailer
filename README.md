# Zewbie Retailer Portal

**Retailer-facing** dashboard for the Zewbie marketplace: manage applications, products, inventory, orders, payouts, shipping, and account settings. Built with **React**, **Vite**, **TypeScript**, and **TailwindCSS**.

**Live:** [https://retailer.zewbie.com](https://retailer.zewbie.com)

## Quick start

```powershell
git clone <repository-url>
cd zewbie-retailer
npm install
copy .env.example .env
npm run dev
```

Dev server: **`http://localhost:5175`** (`vite.config.ts`).

## Architecture

| Piece | Purpose |
|-------|---------|
| **`ProtectedRoute`** | Auth guard component — checks `localStorage` for `retailer_token`, redirects to `/auth/login` if missing. Wraps `RetailerLayout` and `OnboardingLayout` routes. |
| **`ErrorBoundary`** | Class component wrapping the app root — catches rendering errors and shows a fallback UI. |
| **`RetailerLayout`** | Sidebar + main area for authenticated retailer tools. Includes a "Sign Out" button in the sidebar footer. |
| **`AuthLayout`** | Centered flows for login, registration, and password reset. |
| **`OnboardingLayout`** | Wizard shell for retailer onboarding. |
| **`lib/api.ts`** | Axios client targeting `VITE_API_URL`. No global `Content-Type` header (lets Axios auto-set for FormData). Includes request interceptor for auth token and response interceptor that clears token + redirects on 401. |

## Key design decisions

- **Code splitting**: All page components use `React.lazy()` with a `<Suspense>` wrapper for smaller initial bundles.
- **Auth guard pattern**: `ProtectedRoute` renders an `<Outlet>` so it composes with layout routes (`<Route element={<ProtectedRoute />}><Route element={<RetailerLayout />}>...`).
- **IDOR prevention**: All order endpoints use `/retailers/me/orders/:id` instead of `/orders/:id` so the server can scope to the authenticated retailer.
- **Shared components**: `src/components/shared.tsx` exports `Skeleton`, `ErrorBanner`, `SuccessBanner`, and `statusBadge()`. `src/constants/index.ts` exports `CATEGORIES` and `INPUT_CLASS`. Pages import these instead of duplicating.
- **Document titles**: `useDocumentTitle(title)` hook sets `document.title` per page (e.g. "Orders — Zewbie Retailer").
- **Auto-dismiss banners**: Success/error messages in `ProductDetail`, `OrderDetail`, `ShippingSettings`, `Profile`, and `Settings` auto-clear after 5 seconds via `useEffect` timers with proper cleanup.
- **Confirmation dialogs**: Destructive actions (order cancellation, variant/attribute deletion) use `window.confirm()` before proceeding.
- **Type-safe updateField**: `Apply`, `Register`, `ProductCreate`, `ProductDetail`, and `Profile` use `keyof typeof form` instead of `string` for the field parameter.
- **API Test Panel**: Only rendered in development (`import.meta.env.DEV`).
- **Performance**: Revenue chart computes `maxRevenue` once outside `.map()`. Dashboard, OrderStats, and Revenue memoize stat card arrays with `useMemo`.

## Route list

| Path | Page | Layout | Auth required |
|------|------|--------|---------------|
| `/` | Landing | — | No |
| `/apply` | Apply to sell | — | No |
| `/auth/login` | Login | Auth | No |
| `/auth/register` | Register | Auth | No |
| `/auth/forgot-password` | Forgot password | Auth | No |
| `/auth/reset-password/:token` | Reset password | Auth | No |
| `/auth/verify-email/:token` | Verify email | Auth | No |
| `/onboarding` | Onboarding wizard | Onboarding | Yes |
| `/dashboard` | Dashboard | Retailer | Yes |
| `/products` | Product list | Retailer | Yes |
| `/products/new` | Create product | Retailer | Yes |
| `/products/import` | Import products | Retailer | Yes |
| `/products/:id` | Product detail | Retailer | Yes |
| `/inventory` | Inventory | Retailer | Yes |
| `/orders` | Order list | Retailer | Yes |
| `/orders/stats` | Order stats | Retailer | Yes |
| `/orders/:id` | Order detail | Retailer | Yes |
| `/finances/payouts` | Payouts | Retailer | Yes |
| `/finances/payouts/setup` | Payout setup | Retailer | Yes |
| `/finances/revenue` | Revenue | Retailer | Yes |
| `/shipping/settings` | Shipping settings | Retailer | Yes |
| `/account/profile` | Profile | Retailer | Yes |
| `/account/settings` | Settings | Retailer | Yes |
| `/api-test` | API test panel (dev only) | Retailer | Yes |
| `*` | Catch-all → redirects to `/dashboard` | Retailer | Yes |

## Environment variables

| Variable | Description | Default (example) |
|----------|-------------|-------------------|
| `VITE_API_URL` | Zewbie API base URL (include `/v1`) | `http://localhost:3000/v1` |

## Project structure

```text
src/
├── App.tsx                    # Routes with React.lazy code splitting
├── main.tsx                   # Renders App inside ErrorBoundary + StrictMode
├── lib/api.ts                 # Axios instance with auth + 401 interceptor
├── constants/index.ts         # CATEGORIES, INPUT_CLASS shared constants
├── hooks/useDocumentTitle.ts  # Per-page document title hook
├── components/
│   ├── ProtectedRoute.tsx     # Auth guard for protected routes
│   ├── ErrorBoundary.tsx      # React error boundary
│   └── shared.tsx             # Skeleton, ErrorBanner, SuccessBanner, statusBadge
├── layouts/
│   ├── RetailerLayout.tsx     # Sidebar with nav + sign-out button
│   ├── AuthLayout.tsx
│   └── OnboardingLayout.tsx
└── pages/
    ├── auth/
    ├── onboarding/
    ├── products/
    ├── inventory/
    ├── orders/
    ├── finances/
    ├── shipping/
    └── account/
```

## Related repositories

- **zewbie-api** — Backend API.
- **zewbie-admin** — Platform administration.
- **zewbie-app** — Creator / user portal.
- **zewbie-infra** — Infrastructure and local stack.

## License

Private (see repository settings).
