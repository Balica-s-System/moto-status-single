"use server";

import { db } from "@/lib/db";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { PaginatedResult } from "@/lib/types/paginatedResult";
import {
  MotorcycleFiltersSchema,
  motorcycleFiltersSchema,
} from "../_types/motorcycleFilterSchema";

const getMotorcycles = async (
  filters: MotorcycleFiltersSchema,
): Promise<PaginatedResult<MotorcycleSchema>> => {
  const validatedFilters = motorcycleFiltersSchema.parse(filters);

  const { page, pageSize } = validatedFilters;

  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    db.motorcycle.findMany({
      skip,
      take: pageSize,
    }),
    db.motorcycle.count(),
  ]);

  return { data: data as unknown as MotorcycleSchema[], total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
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
