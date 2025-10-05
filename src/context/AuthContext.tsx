"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginService,
  registerService,
  LoginPayload,
  RegisterPayload,
} from "src/services/auth.service";

interface AuthContextType {
  token: string | null;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginService(data);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
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
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, login, register, logout, loading, error }}
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
