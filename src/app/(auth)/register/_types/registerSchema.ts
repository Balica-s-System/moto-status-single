import { requiredStringSchema } from "@/lib/zodSchema";
import { z } from "zod/v3";

const registerSchema = z
  .object({
    name: requiredStringSchema,
    email: requiredStringSchema.email("E-mail inválido"),
    password: requiredStringSchema.min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: requiredStringSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export { registerSchema, type RegisterSchema };
