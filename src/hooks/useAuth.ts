"use client";

import { useState } from "react";
import { loginService, registerService, LoginPayload, RegisterPayload, AuthResponse } from "src/services/auth.service";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginPayload): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginService(data);
      localStorage.setItem("token", res.access_token);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterPayload): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerService(data);
      localStorage.setItem("token", res.access_token);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { login, register, logout, loading, error };
}
