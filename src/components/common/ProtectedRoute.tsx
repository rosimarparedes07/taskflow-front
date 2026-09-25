import { type ReactNode } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children?: ReactNode;
}

/**
 * Componente Guardián que restringe el acceso a rutas privadas.
 *
 * - Si la sesión se está validando tras un F5 (isLoading), muestra un spinner centrado.
 * - Si no hay usuario autenticado, redirige a /login recordando la ruta de origen.
 * - Si está autenticado, renderiza los children o el Outlet de React Router.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Mientras se valida la persistencia del token con GET /auth/me
  if (isLoading) {
    return (
      <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // 2. Si terminó de cargar y no está autenticado, expulsamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Acceso autorizado: soporta tanto envoltura directa como rutas anidadas (Outlet)
  return children ? <>{children}</> : <Outlet />;
}
