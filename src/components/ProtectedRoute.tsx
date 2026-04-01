import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../providers/AuthProvider';

/** Route guard — redirects to login when unauthenticated or non-RETAILER, shows spinner while loading */
export default function ProtectedRoute() {
  const { isLoaded, isSignedIn, user } = useAuthContext();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isSignedIn || user?.role !== 'RETAILER') {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
