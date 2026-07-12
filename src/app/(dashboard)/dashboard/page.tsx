import type { Metadata } from "next";
import DashboardPage from "./_components/dashboard-page";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Dashboard | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do sistema"
      />
      <DashboardPage />
    </div>
  );
};

export default Page;
