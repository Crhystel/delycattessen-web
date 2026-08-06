import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IsAuthenticated } from "../../auth/permissions";

const defaultPermission = new IsAuthenticated();

export default function ProtectedRoute({ children, permission = defaultPermission }) {
  const auth = useAuth();
  if (!permission.hasPermission(auth)) return <Navigate to="/" replace />;
  return children;
}
