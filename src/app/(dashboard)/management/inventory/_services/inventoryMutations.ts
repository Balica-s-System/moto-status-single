"use server";

import { parse } from "date-fns";
import { db } from "@/lib/db";
import { MotorcycleSchema, motorcycleSchema } from "../_types/motorcycleSchema";
import { executeAction } from "@/lib/executeAction";
import { ArrivalStatus, RegistrationStatus } from "$/generated/prisma/enums";
import { requireAuth } from "@/lib/auth";

const deleteMotorcycle = async (id: string) => {
  await requireAuth();
  await db.motorcycle.delete({ where: { id } });
};

const toDateOrNull = (value: string | null | undefined): Date | null =>
  value ? parse(value, "yyyy-MM-dd", new Date()) : null;

const toNumberOrNull = (value: string | number | undefined | null): number | null => {
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const createMotorcycle = async (data: MotorcycleSchema) => {
  await requireAuth();
  const validated = motorcycleSchema.parse(data);
  await executeAction({
    actionFn: () =>
      db.motorcycle.create({
        data: {
          model: validated.model,
          chassi: validated.chassi,
          forecastArrival: toDateOrNull(validated.forecastArrival),
          forecastArrivalStatus: validated.forecastArrivalStatus as ArrivalStatus,
          registrationStatus:
            validated.registrationStatus as RegistrationStatus | null,
          registrationDate: toDateOrNull(validated.registrationDate),
          year: toNumberOrNull(validated.year),
        },
      }),
  });
};

const updateMotorcycle = async (data: MotorcycleSchema) => {
  await requireAuth();
  const validated = motorcycleSchema.parse(data);
  if (validated.action === "update") {
    await executeAction({
      actionFn: () =>
        db.motorcycle.update({
          where: {
            id: validated.id,
          },
          data: {
            chassi: validated.chassi,
            model: validated.model,
            forecastArrival: toDateOrNull(validated.forecastArrival),
            forecastArrivalStatus: validated.forecastArrivalStatus as ArrivalStatus,
            registrationStatus:
              validated.registrationStatus as RegistrationStatus | null,
            registrationDate: toDateOrNull(validated.registrationDate),
            year: toNumberOrNull(validated.year),
          },
        }),
    });
  }
};

export { deleteMotorcycle, createMotorcycle, updateMotorcycle };
