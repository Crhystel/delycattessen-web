import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { login as loginRequest, getMe } from "../services/authService";
import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token"),
  );
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user_profile", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user_profile");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  // On mount, if a token is already stored (page reload, or returning
  // visitor), fetch the user's role and details so permission checks like IsAdmin
  // work right away instead of defaulting to "not admin" until login.
  useEffect(() => {
    if (!token) {
      setIsLoadingUser(false);
      return;
    }
    getMe(token)
      .then((data) => {
        setRole(data.role);
        updateUser(data);
      })
      .catch(() => logout())
      .finally(() => setIsLoadingUser(false));
  }, [token, logout, updateUser]);

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

    const me = await getMe(data.access);
    setRole(me.role);
    updateUser(me);

    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        updateUser,
        login,
        logout,
        isAuthenticated: !!token,
        isLoadingUser,
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
