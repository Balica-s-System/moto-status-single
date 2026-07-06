import { patterns } from "@/lib/constants";
import { regexSchema, requiredStringSchema } from "@/lib/zodSchema";
import { z } from "zod/v3";

export const ArrivalStatusEnum = z.nativeEnum({
  DELAYED: "DELAYED",
  ARRIVED: "ARRIVED",
  NO_INFORMATION: "NO_INFORMATION",
});

export const RegistrationStatusEnum = z.nativeEnum({
  NO_PLATE: "NO_PLATE",
  PLATING: "PLATING",
  PLATED: "PLATED",
});

const baseFields = {
  chassi: regexSchema(patterns.chassi, "Chassi inválido. Deve conter 17 caracteres alfanuméricos."),
  model: requiredStringSchema,
  forecastArrival: z.string().optional(),
  forecastArrivalStatus: ArrivalStatusEnum,
  registrationStatus: RegistrationStatusEnum.optional().nullable(),
  registrationDate: z.string().optional().nullable(),
};

const motorcycleSchema = z.discriminatedUnion("action", [
  z.object({ ...baseFields, action: z.literal("create") }),
  z.object({ ...baseFields, action: z.literal("update"), id: z.string().min(1) }),
]);

type MotorcycleSchema = z.infer<typeof motorcycleSchema>;

const motorcycleDefaultValues: MotorcycleSchema = {
  action: "create",
  chassi: "",
  model: "",
  forecastArrival: "",
  forecastArrivalStatus: "NO_INFORMATION",
  registrationStatus: "NO_PLATE",
  registrationDate: "",
};

export { motorcycleSchema, motorcycleDefaultValues, type MotorcycleSchema };