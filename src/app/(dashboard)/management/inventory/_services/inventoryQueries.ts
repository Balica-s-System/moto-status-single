"use server";

import { format } from "date-fns";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { PaginatedResult } from "@/lib/types/paginatedResult";
import {
  MotorcycleFiltersSchema,
  motorcycleFiltersSchema,
} from "../_types/motorcycleFilterSchema";
import { Prisma } from "$/generated/prisma/browser";

const getMotorcycles = async (
  filters: MotorcycleFiltersSchema,
): Promise<PaginatedResult<MotorcycleSchema>> => {
  await requireAuth();
  const validatedFilters = motorcycleFiltersSchema.parse(filters);

  const {
    searchTerm,
    page = 1,
    pageSize = 10,
    forecastArrivalStatus = "",
    sortBy = "chassi",
    sortOrder = "desc",
  } = validatedFilters || {};

  const where: Prisma.MotorcycleWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { model: { contains: searchTerm, mode: "insensitive" } },
      { chassi: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (forecastArrivalStatus) {
    where.forecastArrivalStatus = forecastArrivalStatus;
  }
  
  const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
    db.motorcycle.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
      include: { client: { select: { id: true, name: true } } },
    }),
    db.motorcycle.count({ where }),
  ]);

  return {
    data: data as unknown as MotorcycleSchema[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

const toDateString = (value: Date | null | undefined): string =>
  value ? format(value, "yyyy-MM-dd") : "";

const getMotorcycle = async (id: string): Promise<MotorcycleSchema> => {
  await requireAuth();
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
    year: res?.year ?? undefined,
  };
};

export { getMotorcycle, getMotorcycles };
