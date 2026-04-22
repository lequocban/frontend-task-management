import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextInstance";
import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from "../lib/authStorage";
import { userService } from "../services/user.service";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [profile, setProfile] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken("");
    setProfile(null);
  }, []);

  const setAuthToken = useCallback((nextToken) => {
    storeToken(nextToken);
    setToken(nextToken);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      return null;
    }

    setIsProfileLoading(true);

    try {
      const response = await userService.detail();
      setProfile(response.user || null);
      return response.user || null;
    } catch {
      logout();
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    let isCancelled = false;

    async function bootstrapAuth() {
      if (!token) {
        if (!isCancelled) {
          setProfile(null);
          setIsBootstrapping(false);
        }
        return;
      }

      setIsProfileLoading(true);

      try {
        const response = await userService.detail();
        if (!isCancelled) {
          setProfile(response.user || null);
        }
      } catch {
        if (!isCancelled) {
          clearStoredToken();
          setToken("");
          setProfile(null);
        }
      } finally {
        if (!isCancelled) {
          setIsProfileLoading(false);
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      profile,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      isProfileLoading,
      setAuthToken,
      refreshProfile,
      logout,
    }),
    [
      isBootstrapping,
      isProfileLoading,
      logout,
      profile,
      refreshProfile,
      setAuthToken,
      token,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
