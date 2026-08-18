import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login as loginRequest } from "../lib/api/authApi";
import { getRoleFromAccessToken } from "../lib/auth/jwt";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  getStoredUserRole,
  setAuthSession,
} from "../lib/auth/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const [role, setRole] = useState(() => getStoredUserRole());

  const login = useCallback(async (email, password) => {
    const session = await loginRequest(email, password);
    const resolvedRole = getRoleFromAccessToken(session.access_token);

    setAuthSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user: session.user,
      role: resolvedRole,
    });

    setAccessToken(session.access_token);
    setUser(session.user);
    setRole(resolvedRole);

    return {
      ...session,
      role: resolvedRole,
    };
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setAccessToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      role,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
    }),
    [user, accessToken, role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
