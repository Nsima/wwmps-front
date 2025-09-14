//src/hooks/useAuth.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type LoginInput = {
  email?: string;
  phone?: string;
  password: string;
};

type SignupInput = {
  name?: string;
  email?: string;
  phone?: string;
  password: string;
};

type JwtPayload = {
  sub: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  exp?: number; // seconds since epoch
};

const TOKEN_KEY = "wwmps_token";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload | null) {
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from storage on mount
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      const payload = parseJwt(t);
      if (!isExpired(payload)) {
        setToken(t);
        setUser(payload);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const saveToken = useCallback((t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(parseJwt(t));
    // optional: clear guest flag so gate doesn't show again
    try { localStorage.removeItem("wwmps_interactions_guest"); } catch {}
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const authorizedFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const headers = new Headers(init.headers || {});
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", headers.get("Content-Type") || "application/json");
      const res = await fetch(input, { ...init, headers });
      return res;
    },
    [token]
  );

  const login = useCallback(async ({ email, phone, password }: LoginInput) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || null, phone: phone || null, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Login failed");
    }
    const { token: t } = await res.json();
    saveToken(t);
    return t;
  }, [saveToken]);

  const signup = useCallback(async ({ name, email, phone, password }: SignupInput) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || null,
        email: email || null,
        phone: phone || null,
        password,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Signup failed");
    }
    const { token: t } = await res.json();
    saveToken(t);
    return t;
  }, [saveToken]);

  return useMemo(
    () => ({
      loading,
      isAuthenticated: !!token && !!user && !isExpired(user),
      token,
      user,
      login,
      signup,
      logout,
      getAuthHeader,
      authorizedFetch,
    }),
    [loading, token, user, login, signup, logout, getAuthHeader, authorizedFetch]
  );
}
