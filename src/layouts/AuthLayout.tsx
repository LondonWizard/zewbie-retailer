import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PageSkeleton } from '../components/ui/PageSkeleton'

/**
 * Auth layout is a minimal passthrough ? individual auth pages
 * (Login, Register, etc.) control their own centering and layout
 * because the Clerk components and custom pages have their own styling.
 */
export default function AuthLayout() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Outlet />
    </Suspense>
  )
}
