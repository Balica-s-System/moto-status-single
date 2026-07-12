"use server";

import { db } from "@/lib/db";
import type {
  OverviewStats,
  ArrivalStatusCount,
  RegistrationStatusCount,
  SalesByMonth,
  SalesBySeller,
  SalesByCity,
  ForecastArrival,
  TopModel,
  StalledMotorcycle,
  ClientAcquisition,
  RecentClient,
} from "../_types/dashboardSchema";

const getOverviewStats = async (): Promise<OverviewStats> => {
  const [totalClients, totalMotorcycles, motorcyclesWithClient] =
    await Promise.all([
      db.client.count(),
      db.motorcycle.count(),
      db.motorcycle.count({ where: { clientId: { not: null } } }),
    ]);

  return {
    totalClients,
    totalMotorcycles,
    motorcyclesWithClient,
    motorcyclesWithoutClient: totalMotorcycles - motorcyclesWithClient,
  };
};

const getArrivalStatusCounts = async (): Promise<ArrivalStatusCount[]> => {
  const [delayed, arrived, noInformation] = await Promise.all([
    db.motorcycle.count({
      where: { forecastArrivalStatus: "DELAYED" },
    }),
    db.motorcycle.count({
      where: { forecastArrivalStatus: "ARRIVED" },
    }),
    db.motorcycle.count({
      where: { forecastArrivalStatus: "NO_INFORMATION" },
    }),
  ]);

  return [
    { status: "DELAYED", label: "Atrasado", count: delayed },
    { status: "ARRIVED", label: "Entregue", count: arrived },
    {
      status: "NO_INFORMATION",
      label: "Sem Informação",
      count: noInformation,
    },
  ];
};

const getRegistrationStatusCounts =
  async (): Promise<RegistrationStatusCount[]> => {
    const [noPlate, plating, plated] = await Promise.all([
      db.motorcycle.count({
        where: { registrationStatus: "NO_PLATE" },
      }),
      db.motorcycle.count({
        where: { registrationStatus: "PLATING" },
      }),
      db.motorcycle.count({
        where: { registrationStatus: "PLATED" },
      }),
    ]);

    return [
      { status: "NO_PLATE", label: "Sem Placa", count: noPlate },
      {
        status: "PLATING",
        label: "Em Emplacamento",
        count: plating,
      },
      { status: "PLATED", label: "Emplacada", count: plated },
    ];
  };

const getSalesByMonth = async (
  months = 3,
): Promise<SalesByMonth[]> => {
  const rows = await db.$queryRaw<
    { month: string; count: bigint }[]
  >`
    SELECT 
      TO_CHAR(c."billingDate", 'YYYY-MM') as month,
      COUNT(m.id)::int as count
    FROM motorcycles m
    INNER JOIN clients c ON c.id = m."clientId"
    WHERE c."billingDate" IS NOT NULL
      AND c."billingDate" >= NOW() - (${months} || ' months')::interval
    GROUP BY month
    ORDER BY month ASC
  `;

  return rows.map((r) => ({ month: r.month, count: Number(r.count) }));
};

const getSalesBySeller = async (): Promise<SalesBySeller[]> => {
  const result = await db.client.groupBy({
    by: ["sellersName"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return result.map((r) => ({
    seller: r.sellersName,
    count: r._count.id,
  }));
};

const getSalesByCity = async (): Promise<SalesByCity[]> => {
  const result = await db.client.groupBy({
    by: ["city"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return result.map((r) => ({
    city: r.city,
    count: r._count.id,
  }));
};

const getForecastArrivals = async (
  months = 3,
): Promise<ForecastArrival[]> => {
  const today = new Date();
  const futureDate = new Date(
    today.getFullYear(),
    today.getMonth() + months,
    1,
  );

  const motorcycles = await db.motorcycle.findMany({
    where: {
      forecastArrival: {
        gte: today,
        lte: futureDate,
      },
    },
    select: {
      forecastArrival: true,
    },
    orderBy: { forecastArrival: "asc" },
  });

  const monthCounts = new Map<string, number>();

  for (const m of motorcycles) {
    if (m.forecastArrival) {
      const key = `${m.forecastArrival.getFullYear()}-${String(m.forecastArrival.getMonth() + 1).padStart(2, "0")}`;
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(monthCounts.entries()).map(([month, count]) => ({
    month,
    count,
  }));
};

const getTopModels = async (limit = 5): Promise<TopModel[]> => {
  const result = await db.motorcycle.groupBy({
    by: ["model"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return result.map((r) => ({
    model: r.model,
    count: r._count.id,
  }));
};

const getStalledMotorcycles = async (
  days = 30,
  limit = 5,
): Promise<StalledMotorcycle[]> => {
  const cutoff = new Date(Date.now() - days * 86400000);

  const result = await db.motorcycle.findMany({
    where: {
      clientId: null,
      createdAt: { lte: cutoff },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      id: true,
      chassi: true,
      model: true,
      createdAt: true,
    },
  });

  const now = Date.now();
  return result.map((r) => ({
    id: r.id,
    chassi: r.chassi,
    model: r.model,
    daysInStock: Math.floor((now - r.createdAt.getTime()) / 86400000),
  }));
};

const getClientAcquisition = async (
  months = 6,
): Promise<ClientAcquisition[]> => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  const clients = await db.client.findMany({
    where: { createdAt: { gte: cutoff } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const monthCounts = new Map<string, number>();

  for (const c of clients) {
    const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, "0")}`;
    monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  }

  return Array.from(monthCounts.entries()).map(([month, count]) => ({
    month,
    count,
  }));
};

const getRecentClients = async (limit = 5): Promise<RecentClient[]> => {
  const result = await db.client.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      city: true,
      sellersName: true,
      createdAt: true,
      _count: { select: { motorcycles: true } },
    },
  });

  return result.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    sellersName: r.sellersName,
    createdAt: r.createdAt.toISOString(),
    motorcycleCount: r._count.motorcycles,
  }));
};

const getAvgMotorcyclesPerClient = async (): Promise<number> => {
  const [totalMotorcycles, totalClients] = await Promise.all([
    db.motorcycle.count(),
    db.client.count(),
  ]);

  return totalClients > 0
    ? Number((totalMotorcycles / totalClients).toFixed(1))
    : 0;
};

export {
  getOverviewStats,
  getArrivalStatusCounts,
  getRegistrationStatusCounts,
  getSalesByMonth,
  getSalesBySeller,
  getSalesByCity,
  getForecastArrivals,
  getTopModels,
  getStalledMotorcycles,
  getClientAcquisition,
  getRecentClients,
  getAvgMotorcyclesPerClient,
};
