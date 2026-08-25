import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IsAuthenticated } from "../../lib/permissions";

const defaultPermission = new IsAuthenticated();

export default function ProtectedRoute({
  children,
  permission = defaultPermission,
}) {
  const auth = useAuth();
  if (auth.isAuthenticated && auth.isLoadingUser) return null;
  if (!permission.hasPermission(auth)) return <Navigate to="/" replace />;
  return children;
}
