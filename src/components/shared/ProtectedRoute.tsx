import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  children: ReactNode;
  requireProfileCompleted?: boolean;
}

export default function ProtectedRoute({ children, requireProfileCompleted = true }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F0E8]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7DD3C7] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  if (requireProfileCompleted && user && !user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
}
