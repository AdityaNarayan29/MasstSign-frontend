"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  loginService,
  registerService,
  LoginPayload,
  RegisterPayload,
} from "src/services/auth.service";

export type Role = "UPLOADER" | "SIGNER";

interface User {
  id: number;
  email: string;
  role: Role;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load token & user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginService(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerService(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setToken, login, register, logout, loading, error }}
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
