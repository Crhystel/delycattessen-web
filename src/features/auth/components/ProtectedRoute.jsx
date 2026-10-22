import { Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { IsAuthenticated } from "../../../lib/permissions";

const defaultPermission = new IsAuthenticated();

export default function ProtectedRoute({
  children,
  permission = defaultPermission,
}) {
  const auth = useAuth();

  if (auth.isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-ink-400">
        Cargando sesión...
      </div>
    );
  }
  if (!permission.hasPermission(auth)) return <Navigate to="/" replace />;
  return children;
}
