import type { Metadata } from "next";
import SalesPage from "./_components/sales-page";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Vendas | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendas"
        description="Desempenho comercial e métricas de vendas"
      />
      <SalesPage />
    </div>
  );
};

export default Page;
