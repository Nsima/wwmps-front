//src/hooks/useAuth.ts
"use client";

import { useCallback, useMemo, useState } from "react";

export function useAuth() {
  // Wire this up to your real auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(() => {
    // replace with your auth flow / router push
    window.location.href = "/login";
  }, []);

  const signup = useCallback(() => {
    // replace with your auth flow / router push
    window.location.href = "/signup";
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return useMemo(
    () => ({ isAuthenticated, login, signup, logout }),
    [isAuthenticated, login, signup, logout]
  );
}
