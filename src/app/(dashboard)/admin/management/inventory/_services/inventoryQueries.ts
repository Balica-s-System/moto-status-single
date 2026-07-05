"use server";

import { db } from "@/lib/db";
import { MotorcycleSchema } from "../_types/motorcycleSchema";

const getMotorcycles = async () => {
  return await db.motorcycle.findMany();
};

const getMotorcycle = async (id: string): Promise<MotorcycleSchema> => {
  const res = await db.motorcycle.findFirst({
    where: {
      id,
    },
  });

  return {
    action: "update",
    chassi: res?.chassi ?? "",
    id,
    model: res?.model ?? "",
    forecastArrival: res?.forecastArrival ?? null,
    forecastArrivalStatus: res?.forecastArrivalStatus ?? "",
    registrationDate: res?.registrationDate ?? null,
    registrationStatus: res?.registrationStatus ?? "",
  };
};

export { getMotorcycle, getMotorcycles };
