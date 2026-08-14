import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { SupportPage } from "./_components/support-page";

export const metadata: Metadata = {
  title: "Suporte | Auge Motos",
};

const Page = async () => {
  const session = await requireAuth().catch(() => redirect("/login"));
  return <SupportPage isAdmin={session.user.role === "admin"} />;
};

export default Page;
