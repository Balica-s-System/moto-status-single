import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginSchema } from "../_types/loginSchema";
import { login } from "./login-mutations";

const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      await login(data);
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
};

export { useLogin };
