import { requiredStringSchema } from "@/lib/zodSchema";
import { z } from "zod/v3";

const updateProfileSchema = z.object({
  name: requiredStringSchema,
  image: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: requiredStringSchema,
    newPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: requiredStringSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

const updateProfileDefaultValues: UpdateProfileSchema = {
  name: "",
  image: undefined,
};

const changePasswordDefaultValues: ChangePasswordSchema = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export {
  updateProfileSchema,
  changePasswordSchema,
  updateProfileDefaultValues,
  changePasswordDefaultValues,
  type UpdateProfileSchema,
  type ChangePasswordSchema,
};
