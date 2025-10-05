import { useMutation } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import { registerService } from "src/services/auth.service";

export function useRegister() {
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    },
    onError: (err) => {
      console.error("Register failed:", err);
    },
  });
}
