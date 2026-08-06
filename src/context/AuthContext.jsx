import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { login as loginRequest } from "../services/authService";
import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token"),
  );
  const [sessionExpired, setSessionExpired] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
  }, []);

  // apiClient has no direct reference to this context; it signals through
  // the event bus whenever a request comes back 401 with an expired token.
  useEffect(() => {
    return authEvents.on(SESSION_EXPIRED, () => {
      setSessionExpired(true);
      logout();
    });
  }, [logout]);

  async function login(email, password) {
    const data = await loginRequest(email, password);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setToken(data.access);
    setSessionExpired(false);
    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
        sessionExpired,
        clearSessionExpired: () => setSessionExpired(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
