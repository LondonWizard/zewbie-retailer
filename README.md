# Zewbie Retailer Portal

**Retailer-facing** dashboard for the Zewbie marketplace: manage applications, products, inventory, orders, payouts, shipping, and account settings. Built with **React**, **Vite**, **TypeScript**, and **TailwindCSS**.

**Live:** [https://retailer.zewbie.com](https://retailer.zewbie.com)

## Quick start

```powershell
git clone https://github.com/zewbie/zewbie-retailer.git
cd zewbie-retailer
npm install
copy .env.example .env
npm run dev
```

Dev server: **`http://localhost:5175`** (`vite.config.ts`).

## Architecture

| Piece | Purpose |
|-------|---------|
| **`RetailerLayout`** | Sidebar + main area for authenticated retailer tools. |
| **`AuthLayout`** | Centered flows for login, registration, and password reset. |
| **`OnboardingLayout`** | Wizard shell for retailer onboarding. |
| **`lib/api.ts`** | Axios client targeting `VITE_API_URL` with retailer auth from `localStorage`. |

## Route list (26 pages)

The product surface is **26** screens; **`App.tsx` currently registers 24 path patterns** (expand with new `Route` entries as you add dedicated steps).

| Path | Page | Layout |
|------|------|--------|
| `/` | Landing | — |
| `/apply` | Apply to sell | — |
| `/auth/login` | Login | Auth |
| `/auth/register` | Register | Auth |
| `/auth/forgot-password` | Forgot password | Auth |
| `/auth/reset-password/:token` | Reset password | Auth |
| `/auth/verify-email/:token` | Verify email | Auth |
| `/onboarding` | Onboarding wizard | Onboarding |
| `/dashboard` | Dashboard | Retailer |
| `/products` | Product list | Retailer |
| `/products/new` | Create product | Retailer |
| `/products/import` | Import products | Retailer |
| `/products/:id` | Product detail | Retailer |
| `/inventory` | Inventory | Retailer |
| `/orders` | Order list | Retailer |
| `/orders/stats` | Order stats | Retailer |
| `/orders/:id` | Order detail | Retailer |
| `/finances/payouts` | Payouts | Retailer |
| `/finances/payouts/setup` | Payout setup | Retailer |
| `/finances/revenue` | Revenue | Retailer |
| `/shipping/settings` | Shipping settings | Retailer |
| `/account/profile` | Profile | Retailer |
| `/account/settings` | Settings | Retailer |
| `/api-test` | API test panel | Retailer |

## Environment variables

| Variable | Description | Default (example) |
|----------|-------------|-------------------|
| `VITE_API_URL` | Zewbie API base URL | `http://localhost:3000` |

## Project structure

```text
src/
├── App.tsx
├── main.tsx
├── lib/api.ts
├── layouts/
│   ├── RetailerLayout.tsx
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
