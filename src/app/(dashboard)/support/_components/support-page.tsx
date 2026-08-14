"use client";

import { PageHeader } from "@/components/page-header";
import { TicketsTable } from "./tickets-table";

type SupportPageProps = {
  isAdmin: boolean;
};

const SupportPage = ({ isAdmin }: SupportPageProps) => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Suporte"
        description="Acompanhe e gerencie os chamados de suporte"
      />
      <TicketsTable isAdmin={isAdmin} />
    </div>
  );
};

export { SupportPage };
