import { requiredStringSchema } from "@/lib/zodSchema";
import { z } from "zod/v3";

const roleEnum = z.enum(["admin", "user"]);

const baseFields = {
  name: requiredStringSchema,
  email: requiredStringSchema.email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  role: roleEnum,
};

const userSchema = z.discriminatedUnion("action", [
  z.object({ ...baseFields, action: z.literal("create") }),
  z.object({
    ...baseFields,
    action: z.literal("update"),
    id: z.string().min(1),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").optional().or(z.literal("")),
  }),
]);

type UserSchema = z.infer<typeof userSchema>;

const userDefaultValues: UserSchema = {
  action: "create",
  name: "",
  email: "",
  password: "",
  role: "user",
};

export { userSchema, userDefaultValues, roleEnum, type UserSchema };
