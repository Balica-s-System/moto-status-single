import { patterns } from "@/lib/constants";
import { requiredStringSchema } from "@/lib/zodSchema";
import { z } from "zod/v3";

const baseFields = {
  name: requiredStringSchema,
  cpf: z
    .string()
    .refine(
      (val) => patterns.document.test(val.replace(/\D/g, "")),
      "CPF/CNPJ inválido. Deve conter 11 (CPF) ou 14 (CNPJ) dígitos.",
    ),
  city: requiredStringSchema,
  sellersName: requiredStringSchema,
  billingDate: z.string().optional().nullable(),
  motorcycleIds: z.array(z.string()),
};

const clientSchema = z.discriminatedUnion("action", [
  z.object({ ...baseFields, action: z.literal("create") }),
  z.object({ ...baseFields, action: z.literal("update"), id: z.string().min(1) }),
]);

type ClientSchema = z.infer<typeof clientSchema>;

const clientDefaultValues: ClientSchema = {
  action: "create",
  name: "",
  cpf: "",
  city: "",
  sellersName: "",
  billingDate: "",
  motorcycleIds: [],
};

export { clientSchema, clientDefaultValues, type ClientSchema };
