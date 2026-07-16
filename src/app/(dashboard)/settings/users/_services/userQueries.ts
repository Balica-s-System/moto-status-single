"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserSchema } from "../_types/userSchema";
import { PaginatedResult } from "@/lib/types/paginatedResult";
import { Prisma } from "$/generated/prisma/browser";

type UserFilters = {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const getUsers = async (
  filters: UserFilters,
): Promise<PaginatedResult<UserSchema>> => {
  await requireAdmin();
  const {
    searchTerm,
    page = 1,
    pageSize = 10,
    sortBy = "name",
    sortOrder = "desc",
  } = filters;

  const where: Prisma.userWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } },
      { email: { contains: searchTerm } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    db.user.count({ where }),
  ]);

  return {
    data: data.map((u) => ({
      action: "update" as const,
      id: u.id,
      name: u.name,
      email: u.email,
      password: "",
      role: u.role as "user" | "admin",
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

const getUser = async (id: string): Promise<UserSchema> => {
  await requireAdmin();
  const res = await db.user.findFirst({ where: { id } });

  return {
    action: "update",
    id,
    name: res?.name ?? "",
    email: res?.email ?? "",
    password: "",
    role: (res?.role ?? "user") as "user" | "admin",
  };
};

export { getUsers, getUser };
