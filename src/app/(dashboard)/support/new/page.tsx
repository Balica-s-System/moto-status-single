import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { NewTicketForm } from "../_components/new-ticket-form";

export const metadata: Metadata = {
  title: "Novo Chamado | Auge Motos",
};

const Page = async () => {
  await requireAuth().catch(() => redirect("/login"));
  return <NewTicketForm />;
};

export default Page;
