import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.js";

function AuthRoute({ children, guestOnly = false }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthRoute;
