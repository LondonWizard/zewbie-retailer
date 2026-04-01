# Contributing to Zewbie Retailer Portal

Thank you for contributing to the Zewbie Retailer Portal. This guide covers the conventions and workflow for making changes.

## Branch Naming

All branches must follow this convention:

| Prefix      | Use Case                         | Example                            |
|-------------|----------------------------------|------------------------------------|
| eature/  | New functionality                | eature/product-import-csv       |
| ix/      | Bug fixes                        | ix/payout-calculation           |
| chore/    | Tooling, deps, config            | chore/upgrade-tailwind-5         |
| docs/     | Documentation only               | docs/onboarding-flow             |
| efactor/ | Code restructuring (no behavior change) | efactor/order-list-table  |
| 	est/     | Adding or fixing tests           | 	est/product-create-form         |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

`
<type>(<scope>): <short description>
`

**Types:** eat, ix, chore, docs, efactor, 	est, perf, ci

**Examples:**
`
feat(products): add CSV import for bulk product creation
fix(orders): correct shipping status display on detail page
chore(deps): upgrade @tanstack/react-query to 5.97
`

## Pull Request Process

1. Create a branch from main using the naming convention above.
2. Make your changes, ensuring the app builds cleanly (
pm run build).
3. Run the linter: 
pm run lint.
4. Push your branch and open a PR against main.
5. Fill in the PR template with what changed, why, and how to test.
6. Request review from at least one team member.
7. Squash-merge once approved.

## Code Style

- **Linter:** ESLint with the project config (
pm run lint)
- **Language:** TypeScript — no ny unless unavoidable and documented.
- **Styling:** TailwindCSS utility classes. Avoid custom CSS unless necessary.
- **Components:** Functional components with hooks. No class components.
- **File naming:** PascalCase for components (ProductList.tsx), kebab-case for utilities.
- **Imports:** Group by: React/external libs, then internal modules, then styles.

## Project Conventions

- **Three layouts:** RetailerLayout (sidebar for authenticated pages), AuthLayout (centered card for login/register), OnboardingLayout (step wizard).
- **API calls:** Use the shared Axios instance from src/lib/api.ts. Never create standalone fetch/axios calls.
- **Routing:** All routes are defined centrally in App.tsx. Keep the route table in the README in sync.
- **State:** Use Zustand for global client state, TanStack Query for server state. Avoid prop drilling beyond 2 levels.

## Environment Variables

- Never commit real secrets. Use .env.example as the template.
- All env vars must be prefixed with VITE_ to be accessible in the browser.
- New env vars must be added to .env.example and documented in the README.

## Getting Help

Open an issue or reach out in the team Slack channel if you have questions.
