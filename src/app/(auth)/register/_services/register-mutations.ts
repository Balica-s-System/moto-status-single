"use server";

import { executeAction } from "@/lib/executeAction";
import { registerSchema, RegisterSchema } from "../_types/registerSchema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";

const register = async (data: RegisterSchema) => {
  await checkRateLimit();
  await executeAction({
    actionFn: async () => {
      const validatedData = registerSchema.parse(data);
      await auth.api.signUpEmail({
        body: {
          email: validatedData.email,
          password: validatedData.password,
          name: validatedData.name,
        },
        headers: await headers(),
      });
    },
  });
};

export { register };
