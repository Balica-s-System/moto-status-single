import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { TicketDetail } from "../_components/ticket-detail";

export const metadata: Metadata = {
  title: "Chamado | Auge Motos",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const session = await requireAuth().catch(() => redirect("/login"));
  const { id } = await params;
  return <TicketDetail ticketId={id} isAdmin={session.user.role === "admin"} />;
};

export default Page;
