import type { Metadata } from "next";
import ClientsTable from "./_components/clients-table";
import { ClientsFiltersDrawer } from "./_components/clients-filters-drawer";
import ClientsFormDialog from "./_components/clients-form-dialog";
import { ClientsPreviewDialog } from "./_components/clients-preview-dialog";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Clientes | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes cadastrados"
        action={<ClientsFormDialog />}
      />
      <ClientsFiltersDrawer />
      <ClientsTable />
      <ClientsPreviewDialog />
    </div>
  );
};

export default Page;
