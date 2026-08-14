import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "@/lib/auth";
import DashboardLayout from "./_components/dashboard-layout";

type AuthSession = typeof auth.$Infer.Session;
type LayoutProps = { children: React.ReactNode };

const Layout = async ({ children }: LayoutProps) => {
  let session: AuthSession | null = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
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
