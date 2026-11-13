import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  login as loginRequest,
  getMe,
  changePassword as changePasswordRequest,
} from "../features/auth/services";
import { authEvents, SESSION_EXPIRED } from "../lib/eventBus";
import {
  isStoredSessionIdle,
  SESSION_END_REASON,
} from "../lib/idleSession";
import { IsAdmin } from "../lib/permissions";
import { tokenStore } from "../lib/tokenStore";
import { useIdleLogout } from "../hooks/useIdleLogout";

const AuthContext = createContext(null);
const adminPermission = new IsAdmin();

// Session rules: the stored session survives closing the tab and is erased by
// logout() (the user signing out) or by the idle logout (no activity for
// IDLE_TIMEOUT_MS, also checked on startup). If the server rejects the session
// (refresh token expired) we just leave the panel in memory and ask for a new
// login; the stored data is overwritten by that login, never wiped silently.
export function AuthProvider({ children }) {
  // A stored session that went idle while the app was closed is not restored.
  const [idleOnStart] = useState(
    () => Boolean(tokenStore.getAccess()) && isStoredSessionIdle(),
  );
  const [token, setToken] = useState(() =>
    idleOnStart ? null : tokenStore.getAccess(),
  );
  const [user, setUser] = useState(() =>
    idleOnStart ? null : tokenStore.getProfile(),
  );
  // Only loading when a stored session has to be validated on mount.
  const [isLoadingUser, setIsLoadingUser] = useState(
    () => !idleOnStart && Boolean(tokenStore.getAccess()),
  );
  const [sessionExpired, setSessionExpired] = useState(idleOnStart);
  const [sessionEndReason, setSessionEndReason] = useState(
    idleOnStart ? SESSION_END_REASON.INACTIVITY : SESSION_END_REASON.EXPIRED,
  );

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

  // No activity for too long: wipe the stored session and ask for a new login.
  const logoutForInactivity = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
    setSessionEndReason(SESSION_END_REASON.INACTIVITY);
    setSessionExpired(true);
  }, []);

  useIdleLogout({ enabled: Boolean(token), onIdle: logoutForInactivity });

  // The session went idle while the app was closed: drop what was stored.
  useEffect(() => {
    if (idleOnStart) tokenStore.clear();
  }, [idleOnStart]);

  // Returning visitor: refresh the profile from the server. A network error
  // keeps the cached profile; a rejected session arrives as SESSION_EXPIRED.
  useEffect(() => {
    if (idleOnStart || !tokenStore.getAccess()) return undefined;
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
  }, [updateUser, idleOnStart]);

  useEffect(
    () =>
      authEvents.on(SESSION_EXPIRED, () => {
        setSessionEndReason(SESSION_END_REASON.EXPIRED);
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
      const profile = await getMe();
      // The API issues tokens to every role, but only admins use the web: a
      // rejected login must not leave a stored session behind.
      if (
        !adminPermission.hasPermission({
          isAuthenticated: true,
          role: profile.role,
        })
      ) {
        tokenStore.clear();
        throw new Error(
          "Esta cuenta no tiene acceso al panel de administración. Ingresa con una cuenta de administrador.",
        );
      }
      updateUser(profile);
      setToken(data.access);
      setSessionExpired(false);
      return data;
    },
    [updateUser],
  );

  // Own password change (also the forced one after a temporary password): the server
  // rotates the tokens, so the new ones replace the stored pair.
  const changePassword = useCallback(
    async (values) => {
      const data = await changePasswordRequest(values);
      if (data.access) {
        tokenStore.setTokens(data);
        setToken(data.access);
      }
      updateUser(await getMe());
      return data;
    },
    [updateUser],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role ?? null,
      mustChangePassword: Boolean(user?.must_change_password),
      updateUser,
      login,
      changePassword,
      logout,
      isAuthenticated: !!token,
      isLoadingUser,
      sessionExpired,
      sessionEndReason,
      clearSessionExpired,
    }),
    [
      token,
      user,
      updateUser,
      login,
      changePassword,
      logout,
      isLoadingUser,
      sessionExpired,
      sessionEndReason,
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
