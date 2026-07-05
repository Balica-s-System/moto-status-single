"use server";

import { db } from "@/lib/db";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { executeAction } from "@/lib/executeAction";
import { ArrivalStatus, RegistrationStatus } from "$/generated/prisma/enums";

const deleteMotorcycle = async (id: string) => {
  await db.motorcycle.delete({ where: { id } });
};

const createMotorcycle = async (data: MotorcycleSchema) => {
  await executeAction({
    actionFn: () =>
      db.motorcycle.create({
        data: {
          model: data.model,
          chassi: data.chassi,
          forecastArrival: data.forecastArrival,
          forecastArrivalStatus: data.forecastArrivalStatus as ArrivalStatus,
          registrationStatus:
            data.registrationStatus as RegistrationStatus | null,
          registrationDate: data.registrationDate,
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
          },
        }),
    });
  }
};

export { deleteMotorcycle, createMotorcycle, updateMotorcycle };
