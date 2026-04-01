# Zewbie Retailer Portal

React + Vite + TypeScript front-end for the Zewbie retailer dashboard. Retailers use this portal to manage products, fulfill orders, track finances, and configure shipping.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 19 + TypeScript               |
| Build       | Vite 6                              |
| Styling     | TailwindCSS 4 (Vite plugin)         |
| Routing     | React Router v7 (BrowserRouter)     |
| State       | Zustand (global), React Query (server) |
| HTTP        | Axios (`src/lib/api.ts`)            |
| Icons       | Lucide React                        |

## Project Structure

```
src/
├── App.tsx                   # Route definitions
├── main.tsx                  # Entry point
├── index.css                 # Tailwind import
├── lib/
│   └── api.ts                # Axios instance (VITE_API_URL)
├── layouts/
│   ├── RetailerLayout.tsx    # Sidebar + main content (authenticated)
│   ├── AuthLayout.tsx        # Centered card (login/register)
│   └── OnboardingLayout.tsx  # Step wizard wrapper
└── pages/
    ├── Dashboard.tsx
    ├── ApiTestPanel.tsx
    ├── auth/                 # Landing, Apply, Login, Register, ForgotPassword, ResetPassword, VerifyEmail
    ├── onboarding/           # Onboarding (multi-step wizard)
    ├── products/             # ProductList, ProductCreate, ProductDetail, ProductImport
    ├── inventory/            # Inventory
    ├── orders/               # OrderList, OrderDetail, OrderStats
    ├── finances/             # Payouts, PayoutSetup, Revenue
    ├── shipping/             # ShippingSettings
    └── account/              # Profile, Settings
```

## Routes

| Path                          | Page              | Layout          |
|-------------------------------|-------------------|-----------------|
| `/`                           | Landing           | standalone      |
| `/apply`                      | Apply             | standalone      |
| `/auth/login`                 | Login             | AuthLayout      |
| `/auth/register`              | Register          | AuthLayout      |
| `/auth/forgot-password`       | ForgotPassword    | AuthLayout      |
| `/auth/reset-password/:token` | ResetPassword     | AuthLayout      |
| `/auth/verify-email/:token`   | VerifyEmail       | AuthLayout      |
| `/onboarding`                 | Onboarding        | OnboardingLayout|
| `/dashboard`                  | Dashboard         | RetailerLayout  |
| `/products`                   | ProductList       | RetailerLayout  |
| `/products/new`               | ProductCreate     | RetailerLayout  |
| `/products/import`            | ProductImport     | RetailerLayout  |
| `/products/:id`               | ProductDetail     | RetailerLayout  |
| `/inventory`                  | Inventory         | RetailerLayout  |
| `/orders`                     | OrderList         | RetailerLayout  |
| `/orders/stats`               | OrderStats        | RetailerLayout  |
| `/orders/:id`                 | OrderDetail       | RetailerLayout  |
| `/finances/payouts`           | Payouts           | RetailerLayout  |
| `/finances/payouts/setup`     | PayoutSetup       | RetailerLayout  |
| `/finances/revenue`           | Revenue           | RetailerLayout  |
| `/shipping/settings`          | ShippingSettings  | RetailerLayout  |
| `/account/profile`            | Profile           | RetailerLayout  |
| `/account/settings`           | Settings          | RetailerLayout  |
| `/api-test`                   | ApiTestPanel      | RetailerLayout  |

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev          # starts on http://localhost:5175
```

## Environment Variables

| Variable       | Description            | Default                |
|----------------|------------------------|------------------------|
| `VITE_API_URL` | Backend API base URL   | `http://localhost:3000` |

## Design Decisions

- **All pages are placeholders** — every route renders a consistent stub showing its name, path, and description. Implement each page incrementally.
- **Three layouts** — `RetailerLayout` (sidebar for authenticated), `AuthLayout` (centered card), `OnboardingLayout` (wizard wrapper).
- **API client** — centralised Axios instance in `src/lib/api.ts` with automatic auth token attachment from `localStorage`.
- **API Test Panel** — `/api-test` provides one-click endpoint testing against the backend during development.
