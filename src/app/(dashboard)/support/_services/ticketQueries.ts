"use server";

import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { PaginatedResult } from "@/lib/types/paginatedResult";
import type { Prisma } from "$/generated/prisma/browser";

type TicketFilters = {
  searchTerm?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

type TicketListItem = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
};

type TicketMessageItem = {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
  isOwner: boolean;
};

type TicketDetail = {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  isOwner: boolean;
  messages: TicketMessageItem[];
};

const getTickets = async (
  filters: TicketFilters,
): Promise<PaginatedResult<TicketListItem>> => {
  const session = await requireAuth();
  const { searchTerm, status, page = 1, pageSize = 10 } = filters;
  const isAdmin = session.user.role === "admin";

  const where: Prisma.TicketWhereInput = {};

  if (!isAdmin) {
    where.userId = session.user.id;
  }

  if (searchTerm) {
    where.subject = { contains: searchTerm };
  }

  if (status) {
    where.status = status as Prisma.TicketWhereInput["status"];
  }

  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    db.ticket.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true } },
      },
    }),
    db.ticket.count({ where }),
  ]);

  return {
    data: data.map((t) => ({
      id: t.id,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      userName: t.user.name,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

const getTicket = async (id: string): Promise<TicketDetail | null> => {
  const session = await requireAuth();
  const isAdmin = session.user.role === "admin";

  const ticket = await db.ticket.findFirst({
    where: { id, ...(isAdmin ? {} : { userId: session.user.id }) },
    select: {
      id: true,
      subject: true,
      message: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      user: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!ticket) return null;

  return {
    id: ticket.id,
    subject: ticket.subject,
    message: ticket.message,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    userName: ticket.user.name,
    isOwner: ticket.userId === session.user.id,
    messages: ticket.messages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      userName: m.user.name,
      isOwner: m.userId === session.user.id,
    })),
  };
};

export {
  getTicket,
  getTickets,
  type TicketDetail,
  type TicketFilters,
  type TicketListItem,
};
