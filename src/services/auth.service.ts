import api from "../lib/api";

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: "UPLOADER" | "SIGNER";
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginService = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export interface RegisterPayload {
  email: string;
  password: string;
  role: string;
}

export const registerService = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};
