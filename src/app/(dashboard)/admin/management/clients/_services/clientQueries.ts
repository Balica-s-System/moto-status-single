"use server";

import { format } from "date-fns";
import { db } from "@/lib/db";
import { ClientSchema } from "../_types/clientSchema";
import { PaginatedResult } from "@/lib/types/paginatedResult";
import {
  ClientFiltersSchema,
  clientFiltersSchema,
} from "../_types/clientFilterSchema";
import { Prisma } from "$/generated/prisma/browser";

const getClients = async (
  filters: ClientFiltersSchema,
): Promise<PaginatedResult<ClientSchema>> => {
  const validatedFilters = clientFiltersSchema.parse(filters);

  const {
    searchTerm,
    page = 1,
    pageSize = 10,
    sortBy = "name",
    sortOrder = "desc",
  } = validatedFilters || {};

  const where: Prisma.ClientWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } },
      { cpf: { contains: searchTerm } },
      { city: { contains: searchTerm } },
      { sellersName: { contains: searchTerm } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    db.client.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
      include: { motorcycles: { select: { id: true, chassi: true, model: true } } },
    }),
    db.client.count({ where }),
  ]);

  return {
    data: data as unknown as ClientSchema[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

const toDateString = (value: Date | null | undefined): string =>
  value ? format(value, "yyyy-MM-dd") : "";

type ClientWithMotorcycles = ClientSchema & {
  _motorcycles: { id: string; chassi: string; model: string }[];
};

const getClient = async (id: string): Promise<ClientWithMotorcycles> => {
  const res = await db.client.findFirst({
    where: { id },
    include: { motorcycles: { select: { id: true, chassi: true, model: true } } },
  });

  return {
    action: "update",
    id,
    name: res?.name ?? "",
    cpf: res?.cpf ?? "",
    city: res?.city ?? "",
    sellersName: res?.sellersName ?? "",
    billingDate: toDateString(res?.billingDate),
    motorcycleIds: res?.motorcycles.map((m) => m.id) ?? [],
    _motorcycles: res?.motorcycles ?? [],
  };
};

const getAvailableMotorcycles = async (
  search?: string,
  includeIds?: string[],
): Promise<{ id: string; chassi: string; model: string }[]> => {
  const clientFilter: Prisma.MotorcycleWhereInput =
    includeIds?.length
      ? { OR: [{ clientId: null }, { id: { in: includeIds } }] }
      : { clientId: null };

  const searchFilter: Prisma.MotorcycleWhereInput | undefined = search
    ? { OR: [{ chassi: { contains: search, mode: 'insensitive' } }, { model: { contains: search, mode: 'insensitive' } }] }
    : undefined;

  const where: Prisma.MotorcycleWhereInput = searchFilter
    ? { AND: [clientFilter, searchFilter] }
    : clientFilter;

  const motorcycles = await db.motorcycle.findMany({
    where,
    select: { id: true, chassi: true, model: true },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return motorcycles;
};

export { getClient, getClients, getAvailableMotorcycles };
