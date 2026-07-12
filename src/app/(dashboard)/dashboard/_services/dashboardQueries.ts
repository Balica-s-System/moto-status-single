"use server";

import { db } from "@/lib/db";
import type {
  OverviewStats,
  ArrivalStatusCount,
  RegistrationStatusCount,
  SalesByMonth,
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

export {
  getOverviewStats,
  getArrivalStatusCounts,
  getRegistrationStatusCounts,
  getSalesByMonth,
};
