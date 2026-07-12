"use server";

import { parse } from "date-fns";
import { db } from "@/lib/db";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { executeAction } from "@/lib/executeAction";
import { ArrivalStatus, RegistrationStatus } from "$/generated/prisma/enums";

const deleteMotorcycle = async (id: string) => {
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
  await executeAction({
    actionFn: () =>
      db.motorcycle.create({
        data: {
          model: data.model,
          chassi: data.chassi,
          forecastArrival: toDateOrNull(data.forecastArrival),
          forecastArrivalStatus: data.forecastArrivalStatus as ArrivalStatus,
          registrationStatus:
            data.registrationStatus as RegistrationStatus | null,
          registrationDate: toDateOrNull(data.registrationDate),
          year: toNumberOrNull(data.year),
          price: toNumberOrNull(data.price),
        },
      }),
  });
};

const updateMotorcycle = async (data: MotorcycleSchema) => {
  if (data.action === "update") {
    await executeAction({
      actionFn: () =>
        db.motorcycle.update({
          where: {
            id: data.id,
          },
          data: {
            chassi: data.chassi,
            model: data.model,
            forecastArrival: toDateOrNull(data.forecastArrival),
            forecastArrivalStatus: data.forecastArrivalStatus as ArrivalStatus,
            registrationStatus:
              data.registrationStatus as RegistrationStatus | null,
            registrationDate: toDateOrNull(data.registrationDate),
            year: toNumberOrNull(data.year),
            price: toNumberOrNull(data.price),
          },
        }),
    });
  }
};

export { deleteMotorcycle, createMotorcycle, updateMotorcycle };
