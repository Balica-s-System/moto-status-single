import { z } from "zod/v3";
import { requiredStringSchema } from "@/lib/zodSchema";

const ticketStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
const ticketPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

const createTicketSchema = z.object({
  subject: requiredStringSchema.max(
    120,
    "O assunto deve ter no máximo 120 caracteres",
  ),
  message: requiredStringSchema,
  priority: ticketPriorityEnum,
});

type CreateTicketSchema = z.infer<typeof createTicketSchema>;

const createTicketDefaultValues: CreateTicketSchema = {
  subject: "",
  message: "",
  priority: "MEDIUM",
};

const updateTicketStatusSchema = z.object({
  id: z.string().min(1),
  status: ticketStatusEnum,
});

type UpdateTicketStatusSchema = z.infer<typeof updateTicketStatusSchema>;

const updateTicketPrioritySchema = z.object({
  id: z.string().min(1),
  priority: ticketPriorityEnum,
});

type UpdateTicketPrioritySchema = z.infer<typeof updateTicketPrioritySchema>;

const ticketMessageSchema = z.object({
  content: requiredStringSchema.max(
    2000,
    "A mensagem deve ter no máximo 2000 caracteres",
  ),
});

type TicketMessageSchema = z.infer<typeof ticketMessageSchema>;

const ticketMessageDefaultValues: TicketMessageSchema = {
  content: "",
};

export {
  type CreateTicketSchema,
  createTicketDefaultValues,
  createTicketSchema,
  type TicketMessageSchema,
  ticketMessageDefaultValues,
  ticketMessageSchema,
  ticketPriorityEnum,
  ticketStatusEnum,
  type UpdateTicketPrioritySchema,
  type UpdateTicketStatusSchema,
  updateTicketPrioritySchema,
  updateTicketStatusSchema,
};
