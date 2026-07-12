"use server";

import { parse } from "date-fns";
import { db } from "@/lib/db";
import { ClientSchema } from "../_types/clientSchema";
import { executeAction } from "@/lib/executeAction";

const deleteClient = async (id: string) => {
  await db.client.delete({ where: { id } });
};

const toDateOrNull = (value: string | null | undefined): Date | null =>
  value ? parse(value, "yyyy-MM-dd", new Date()) : null;

const createClient = async (data: ClientSchema) => {
  await executeAction({
    actionFn: () =>
      db.client.create({
        data: {
          name: data.name,
          cpf: data.cpf,
          city: data.city,
          sellersName: data.sellersName,
          billingDate: toDateOrNull(data.billingDate),
          motorcycles: {
            connect: data.motorcycleIds.map((id) => ({ id })),
          },
        },
      }),
  });
};

const updateClient = async (data: ClientSchema) => {
  if (data.action === "update") {
    await executeAction({
      actionFn: () =>
        db.client.update({
          where: { id: data.id },
          data: {
            name: data.name,
            cpf: data.cpf,
            city: data.city,
            sellersName: data.sellersName,
            billingDate: toDateOrNull(data.billingDate),
            motorcycles: {
              set: data.motorcycleIds.map((id) => ({ id })),
            },
          },
        }),
    });
  }
};

export { deleteClient, createClient, updateClient };
