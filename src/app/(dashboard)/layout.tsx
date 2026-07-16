import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardLayout from "./_components/dashboard-layout";

type LayoutProps = { children: React.ReactNode };

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
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
