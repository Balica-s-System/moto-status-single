"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserSchema } from "../_types/userSchema";
import { executeAction } from "@/lib/executeAction";
import { headers } from "next/headers";

const deleteUser = async (id: string) => {
  await db.user.delete({ where: { id } });
};

const createUser = async (data: UserSchema) => {
  const h = await headers();
  await executeAction({
    actionFn: () =>
      auth.api.createUser({
        body: {
          email: data.email,
          password: data.password as string,
          name: data.name,
          role: data.role,
        },
        headers: h,
      }),
  });
};

const updateUser = async (data: UserSchema) => {
  if (data.action === "update") {
    const h = await headers();
    await executeAction({
      actionFn: async () => {
        await db.user.update({
          where: { id: data.id },
          data: {
            name: data.name,
            email: data.email,
            role: data.role,
          },
        });

        if (data.password) {
          await auth.api.setUserPassword({
            body: {
              newPassword: data.password,
              userId: data.id,
            },
            headers: h,
          });
        }
      },
    });
  }
};

export { deleteUser, createUser, updateUser };
