import { Navigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../services/users.service';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [role, setRole] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) return;
    getProfile()
      .then(p => setRole(p.is_admin ? 'admin' : 'user'))
      .catch(() => setRole(null));
  }, [isAuthenticated]);

  if (isLoading || role === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#f87171] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin')  return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
