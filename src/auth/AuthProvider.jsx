import { useEffect, useState } from "react";
import { getMe } from "../api/auth.js";
import { AuthContext } from "./AuthContext.js";

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
