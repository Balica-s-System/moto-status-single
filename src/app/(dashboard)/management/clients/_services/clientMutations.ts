"use server";

import { parse } from "date-fns";
import { db } from "@/lib/db";
import { ClientSchema, clientSchema } from "../_types/clientSchema";
import { executeAction } from "@/lib/executeAction";
import { requireAuth } from "@/lib/auth";

const deleteClient = async (id: string) => {
  await requireAuth();
  await db.client.delete({ where: { id } });
};

const toDateOrNull = (value: string | null | undefined): Date | null =>
  value ? parse(value, "yyyy-MM-dd", new Date()) : null;

const createClient = async (data: ClientSchema) => {
  await requireAuth();
  const validated = clientSchema.parse(data);
  await executeAction({
    actionFn: () =>
      db.client.create({
        data: {
          name: validated.name,
          cpf: validated.cpf,
          city: validated.city,
          sellersName: validated.sellersName,
          billingDate: toDateOrNull(validated.billingDate),
          motorcycles: {
            connect: validated.motorcycleIds.map((id) => ({ id })),
          },
        },
      }),
  });
};

const updateClient = async (data: ClientSchema) => {
  await requireAuth();
  const validated = clientSchema.parse(data);
  if (validated.action === "update") {
    await executeAction({
      actionFn: () =>
        db.client.update({
          where: { id: validated.id },
          data: {
            name: validated.name,
            cpf: validated.cpf,
            city: validated.city,
            sellersName: validated.sellersName,
            billingDate: toDateOrNull(validated.billingDate),
            motorcycles: {
              set: validated.motorcycleIds.map((id) => ({ id })),
            },
          },
        }),
    });
  }
};

export { deleteClient, createClient, updateClient };
