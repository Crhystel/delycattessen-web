import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { login as loginRequest, getMe } from "../features/auth/services";
import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";
import { tokenStore } from "../lib/tokenStore";

const AuthContext = createContext(null);

// Session rules: the stored session survives closing the app and is erased
// ONLY by logout() (the user signing out). If the server rejects the session
// (refresh token expired) we just leave the panel in memory and ask for a new
// login; the stored data is overwritten by that login, never wiped silently.
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.getAccess());
  const [user, setUser] = useState(() => tokenStore.getProfile());
  // Only loading when a stored session has to be validated on mount.
  const [isLoadingUser, setIsLoadingUser] = useState(() =>
    Boolean(tokenStore.getAccess()),
  );
  const [sessionExpired, setSessionExpired] = useState(false);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    tokenStore.setProfile(userData);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  const clearSessionExpired = useCallback(() => setSessionExpired(false), []);

  // Returning visitor: refresh the profile from the server. A network error
  // keeps the cached profile; a rejected session arrives as SESSION_EXPIRED.
  useEffect(() => {
    if (!tokenStore.getAccess()) return undefined;
    let cancelled = false;
    getMe()
      .then((data) => {
        if (!cancelled) updateUser(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingUser(false);
      });
    return () => {
      cancelled = true;
    };
  }, [updateUser]);

  useEffect(
    () =>
      authEvents.on(SESSION_EXPIRED, () => {
        setSessionExpired(true);
        setToken(null);
        setUser(null);
      }),
    [],
  );

  const login = useCallback(
    async (email, password) => {
      const data = await loginRequest(email, password);
      tokenStore.setTokens(data);
      updateUser(await getMe());
      setToken(data.access);
      setSessionExpired(false);
      return data;
    },
    [updateUser],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role ?? null,
      updateUser,
      login,
      logout,
      isAuthenticated: !!token,
      isLoadingUser,
      sessionExpired,
      clearSessionExpired,
    }),
    [
      token,
      user,
      updateUser,
      login,
      logout,
      isLoadingUser,
      sessionExpired,
      clearSessionExpired,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
