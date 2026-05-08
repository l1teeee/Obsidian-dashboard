import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../services/users.service';

const SUPERADMIN_PATHS = ['/admin/users', '/admin/admins', '/admin/permissions', '/admin/roles'];
// /admin (exact) is also superadmin-only
function isSuperAdminPath(pathname: string): boolean {
  if (pathname === '/admin') return true;
  return SUPERADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

type Role = 'superadmin' | 'admin' | 'user' | null | undefined;

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();
  const [role, setRole] = useState<Role>(undefined);

  useEffect(() => {
    if (!isAuthenticated) return;
    getProfile()
      .then(p => {
        if (p.is_superadmin) setRole('superadmin');
        else if (p.is_admin) setRole('admin');
        else setRole('user');
      })
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
  if (role === 'user' || role === null) return <Navigate to="/dashboard" replace />;
  if (role === 'admin' && isSuperAdminPath(pathname)) return <Navigate to="/admin/workspaces" replace />;

  return <>{children}</>;
}
