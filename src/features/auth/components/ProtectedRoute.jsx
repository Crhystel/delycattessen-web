import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { IsAuthenticated } from "../../../lib/permissions";

const defaultPermission = new IsAuthenticated();

// `allowPendingPasswordChange` is only for the screen where that change is made: every
// other protected route sends an account with a temporary password there first.
export default function ProtectedRoute({
  children,
  permission = defaultPermission,
  allowPendingPasswordChange = false,
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
  if (auth.mustChangePassword && !allowPendingPasswordChange) {
    return <Navigate to="/cambiar-contrasena" replace />;
  }
  return children;
}
