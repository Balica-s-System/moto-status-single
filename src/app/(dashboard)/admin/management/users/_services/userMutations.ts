"use server";

import { db } from "@/lib/db";
import { UserSchema } from "../_types/userSchema";
import { executeAction } from "@/lib/executeAction";

const deleteUser = async (id: string) => {
  await db.user.delete({ where: { id } });
};

const createUser = async (data: UserSchema) => {
  await executeAction({
    actionFn: () =>
      db.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password as string,
          role: data.role,
        },
      }),
  });
};

const updateUser = async (data: UserSchema) => {
  if (data.action === "update") {
    const updateData: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    if (data.password) {
      updateData.password = data.password;
    }

    await executeAction({
      actionFn: () =>
        db.user.update({
          where: { id: data.id },
          data: updateData,
        }),
    });
  }
};

export { deleteUser, createUser, updateUser };
