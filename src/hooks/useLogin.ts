import { useMutation } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import { loginService } from "src/services/auth.service";

export function useLogin() {
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    },
    onError: (err) => {
      console.error("Login failed:", err);
    },
  });
}
