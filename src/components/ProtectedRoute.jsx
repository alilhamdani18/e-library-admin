import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// pastikan ini export-nya BUKAN default
export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
}
