"use server";

import { db } from "@/lib/db";
import { MotorcycleSchema } from "../_types/motorcycleSchema";

const getMotorcycles = async () => {
  return await db.motorcycle.findMany();
};

const toDateString = (value: Date | null | undefined): string =>
  value ? value.toISOString().split("T")[0] : "";

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
    forecastArrival: toDateString(res?.forecastArrival),
    forecastArrivalStatus: res?.forecastArrivalStatus ?? "NO_INFORMATION",
    registrationDate: toDateString(res?.registrationDate),
    registrationStatus: res?.registrationStatus ?? null,
  };
};

export { getMotorcycle, getMotorcycles };
