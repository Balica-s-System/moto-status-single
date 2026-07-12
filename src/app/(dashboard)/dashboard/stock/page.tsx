import type { Metadata } from "next";
import StockPage from "./_components/stock-page";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Estoque | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Estoque"
        description="Pipeline de motos e status do inventário"
      />
      <StockPage />
    </div>
  );
};

export default Page;
