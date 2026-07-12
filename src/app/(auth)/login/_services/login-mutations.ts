"use server";

import { executeAction } from "@/lib/executeAction";
import { loginSchema, LoginSchema } from "../_types/loginSchema";
import { auth } from "@/lib/auth";

const login = async (data: LoginSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = loginSchema.parse(data);
      await auth.api.signInEmail({
        body: {
          email: validatedData.email,
          password: validatedData.password,
          callbackURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard`,
        },
      });
    },
  });
};

export { login };
