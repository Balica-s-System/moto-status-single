import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "../_types/registerSchema";
import { register } from "./register-mutations";

const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: RegisterSchema) => {
      await register(data);
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
};

export { useRegister };
