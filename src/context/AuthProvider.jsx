import { useState, useEffect, useCallback, useMemo } from "react";
import { login as loginRequest, getMe } from "../features/auth/services";
import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";
import { tokenStore } from "../lib/tokenStore";
import { AuthContext } from "./contexts";

export default function AuthProvider({ children }) {
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

  // Returning visitor / page reload: re-fetch the profile so permission
  // checks like IsAdmin reflect the server, not the cached copy.
  useEffect(() => {
    if (!tokenStore.getAccess()) return undefined;
    let cancelled = false;
    getMe()
      .then((data) => {
        if (!cancelled) updateUser(data);
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setIsLoadingUser(false);
      });
    return () => {
      cancelled = true;
    };
  }, [logout, updateUser]);

  useEffect(
    () =>
      authEvents.on(SESSION_EXPIRED, () => {
        setSessionExpired(true);
        logout();
      }),
    [logout],
  );

  const login = useCallback(
    async (email, password) => {
      const data = await loginRequest(email, password);
      tokenStore.setTokens(data);
      const me = await getMe();
      updateUser(me);
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
