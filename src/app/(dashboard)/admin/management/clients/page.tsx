import type { Metadata } from "next";
import ClientsTable from "./_components/clients-table";
import { ClientsFiltersDrawer } from "./_components/clients-filters-drawer";
import ClientsFormDialog from "./_components/clients-form-dialog";
import { ClientsPreviewDialog } from "./_components/clients-preview-dialog";

export const metadata: Metadata = {
  title: "Clientes | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-2">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold">Clientes</h1>
        <ClientsFormDialog />
      </div>
      <ClientsFiltersDrawer />
      <ClientsTable />
      <ClientsPreviewDialog />
    </div>
  );
};

export default Page;
