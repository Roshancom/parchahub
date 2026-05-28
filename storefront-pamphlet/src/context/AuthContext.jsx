"use client";

import React, { createContext, useContext } from "react";
import { loginUser, registerUser } from "@/services/api";

const AuthContext = createContext();
export const AUTH_USER_KEY = "pamphlet_auth_user";
export const AUTH_TOKEN_KEY = "pamphlet_jwt";

const readStoredAuth = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!token) {
    return { user: null, token: null };
  }

  try {
    const parsedUser = rawUser ? JSON.parse(rawUser) : null;
    return { user: parsedUser, token };
  } catch (error) {
    console.error("Failed to parse stored auth user", error);
    return { user: null, token };
  }
};

export function AuthProvider({ children }) {
  const initial = readStoredAuth();
  const [user, setUser] = React.useState(initial.user);
  const [token, setToken] = React.useState(initial.token);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const onStorage = () => {
      const next = readStoredAuth();
      setUser(next.user);
      setToken(next.token);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (nextToken, nextUser) => {
    if (nextToken) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
      setToken(nextToken);
    }

    if (nextUser) {
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const session = await loginUser(payload);
      persist(session.token, session.user);
      return session;
    } catch (nextError) {
      const message =
        nextError?.response?.data?.message ||
        nextError?.message ||
        "Unable to log in.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await registerUser(payload);
    } catch (nextError) {
      const message =
        nextError?.response?.data?.message ||
        nextError?.message ||
        "Unable to register.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionUser = (partialUser) => {
    setUser((current) => {
      const next = { ...(current || {}), ...(partialUser || {}) };
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
    setError("");
    window.location.reload();
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: Boolean(token),
    role: user?.role || "owner",
    isAdmin: (user?.role || "owner") === "admin",
    isOwner: (user?.role || "owner") === "owner",
    login,
    register,
    logout,
    updateSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
