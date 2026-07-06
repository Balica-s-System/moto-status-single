import { z } from "zod/v3";

export const requiredStringSchema = z
  .string()
  .min(1, { message: "Campo obrigatório" });

export const regexSchema = (pattern: RegExp, message?: string) =>
  z
    .string()
    .regex(pattern, message || "Formato inválido");
