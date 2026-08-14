"use server";

import { requireAdmin, requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import type {
  CreateTicketSchema,
  UpdateTicketPrioritySchema,
  UpdateTicketStatusSchema,
} from "../_types/ticketSchema";

const createTicket = async (data: CreateTicketSchema) => {
  const session = await requireAuth();
  await db.ticket.create({
    data: {
      subject: data.subject,
      message: data.message,
      priority: data.priority,
      userId: session.user.id,
    },
  });
};

const canAccessTicket = async (
  ticketId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const ticket = await db.ticket.findFirst({
    where: { id: ticketId },
    select: { userId: true },
  });
  if (!ticket) throw new Error("Chamado não encontrado");
  if (!isAdmin && ticket.userId !== userId) {
    throw new Error("Acesso negado");
  }
  return ticket;
};

const addTicketMessage = async (ticketId: string, content: string) => {
  const session = await requireAuth();
  const isAdmin = session.user.role === "admin";
  await canAccessTicket(ticketId, session.user.id, isAdmin);

  await db.ticketMessage.create({
    data: {
      content,
      ticketId,
      userId: session.user.id,
    },
  });
  await db.ticket.update({
    where: { id: ticketId },
    data: { updatedAt: new Date() },
  });
};

const updateTicketStatus = async (data: UpdateTicketStatusSchema) => {
  await requireAdmin();
  await db.ticket.update({
    where: { id: data.id },
    data: { status: data.status },
  });
};

const updateTicketPriority = async (data: UpdateTicketPrioritySchema) => {
  const session = await requireAuth();
  const isAdmin = session.user.role === "admin";
  await canAccessTicket(data.id, session.user.id, isAdmin);

  await db.ticket.update({
    where: { id: data.id },
    data: { priority: data.priority },
  });
};

export {
  addTicketMessage,
  createTicket,
  updateTicketPriority,
  updateTicketStatus,
};
