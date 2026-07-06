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

const motorcycleSchema = z.intersection(
  z.object({
    chassi: z.string(),
    model: z.string(),
    forecastArrival: z
      .date()
      .optional()
      .nullable()
      .or(z.string().transform((val) => (val ? new Date(val) : null))),
    forecastArrivalStatus: ArrivalStatusEnum.default("NO_INFORMATION"),
    registrationStatus: RegistrationStatusEnum.optional().nullable(),
    registrationDate: z
      .date()
      .optional()
      .nullable()
      .or(z.string().transform((val) => (val ? new Date(val) : null))),
  }),
  z.discriminatedUnion("action", [
    z.object({ action: z.literal("create") }),
    z.object({ action: z.literal("update"), id: z.string().min(1) }),
  ]),
);

type MotorcycleSchema = z.infer<typeof motorcycleSchema>;

const motorcycleDefaultValues: MotorcycleSchema = {
  action: "create",
  chassi: "",
  model: "",
  forecastArrival: null,
  forecastArrivalStatus: "NO_INFORMATION",
  registrationStatus: "NO_PLATE",
  registrationDate: null,
};

export { motorcycleSchema, motorcycleDefaultValues, type MotorcycleSchema };
