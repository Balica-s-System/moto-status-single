"use server";

import { db } from "@/lib/db";
import type { ClientSearchResult } from "../_types/cpfSearchSchema";

const maskChassi = (chassi: string): string => {
  if (chassi.length <= 6) return chassi;
  return chassi.slice(0, -6).replace(/./g, "*") + chassi.slice(-6);
};

const searchClientByCpf = async (
  cpf: string,
): Promise<ClientSearchResult[]> => {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length < 3) return [];

  const rows = await db.$queryRaw<Array<{
    id: string;
    name: string;
    cpf: string;
    city: string;
    sellersName: string;
  }>>`
    SELECT id, name, cpf, city, "sellersName"
    FROM clients
    WHERE TRANSLATE(cpf, './-', '') ILIKE ${'%' + digits + '%'}
    LIMIT 10
  `;

  if (rows.length === 0) return [];

  const clientIds = rows.map((r) => r.id);

  const motorcycles = await db.motorcycle.findMany({
    where: { clientId: { in: clientIds } },
    select: {
      id: true,
      chassi: true,
      model: true,
      clientId: true,
      forecastArrivalStatus: true,
      registrationStatus: true,
    },
  });

  const motosByClientId = new Map<string, typeof motorcycles>();
  for (const moto of motorcycles) {
    const cid = moto.clientId as string;
    const list = motosByClientId.get(cid) ?? [];
    list.push(moto);
    motosByClientId.set(cid, list);
  }

  return rows.map((r) => ({
    ...r,
    motorcycles: (motosByClientId.get(r.id) ?? []).map(
      ({ clientId: _, ...moto }) => ({
        ...moto,
        chassi: maskChassi(moto.chassi),
      }),
    ),
  }));
};

export { searchClientByCpf };
