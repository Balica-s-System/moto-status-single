import type { Metadata } from "next";
import ClientsPage from "./_components/clients-page";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Clientes | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Métricas e informações sobre clientes"
      />
      <ClientsPage />
    </div>
  );
};

export default Page;
