import { requiredStringSchema } from "@/lib/zodSchema";
import { z } from "zod/v3";

const loginSchema = z.object({
  email: requiredStringSchema.email("E-mail inválido"),
  password: requiredStringSchema.min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };
