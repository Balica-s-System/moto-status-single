import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import DashboardLayout from "./_components/dashboard-layout";

type LayoutProps = { children: React.ReactNode };

const Layout = async ({ children }: LayoutProps) => {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    // Erro ao validar sessão (ex: DB indisponível, sessão expirada)
    // Limpa cookie de sessão para evitar loop no proxy
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (c.name.startsWith("better-auth") || c.name.includes("session")) {
        cookieStore.delete(c.name);
      }
    }
    redirect("/login");
  }

  if (!session) {
    // Sessão não encontrada — limpa cookies de sessão antes de redirecionar
    // para evitar que o proxy veja o cookie velho e crie loop
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (c.name.startsWith("better-auth") || c.name.includes("session")) {
        cookieStore.delete(c.name);
      }
    }
    redirect("/login");
  }

  return (
    <DashboardLayout
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role ?? "user",
        image: session.user.image ?? null,
      }}
    >
      <div className="max-w-screen-2xl mx-48 py-6 sm:px-6 ">{children}</div>
    </DashboardLayout>
  );
};



export default Layout;
