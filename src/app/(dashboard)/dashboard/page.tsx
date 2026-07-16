import type { Metadata } from "next";
import DashboardPage from "./_components/dashboard-page";
import { AlertBar } from "./_components/alert-bar";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Dashboard | Auge Motos",
};

const Page = () => {
  return (
    <>
      <PageHeader title="Dashboard" description="Visão geral do sistema" />
      <div className="space-y-6">
        <AlertBar />
        <DashboardPage />
      </div>
    </>
  );
};

export default Page;
