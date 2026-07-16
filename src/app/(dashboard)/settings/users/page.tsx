import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { UsersPage } from "./_components/users-page";

export const metadata: Metadata = {
  title: "Usuários | Auge Motos",
};

const Page = async () => {
  await requireAdmin().catch(() => redirect("/dashboard"));
  return <UsersPage />;
};

export default Page;
