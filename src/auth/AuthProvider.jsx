import { useEffect, useState } from "react";
import { getMe } from "../api/auth.js";
import { AuthContext } from "./AuthContext.js";

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getMe()
      .then((member) => {
        setCurrentUser(member);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setCurrentUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
        setCurrentUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
