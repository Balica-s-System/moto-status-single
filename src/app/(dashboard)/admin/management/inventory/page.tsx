import type { Metadata } from "next";
import InventoryTable from "./_components/inventory-table";
import { InventoryFiltersDrawer } from "./_components/inventory-filters-drawer";
import InventoryFormDialog from "./_components/inventory-form-dialog";
import { InventoryPreviewDialog } from "./_components/inventory-preview-dialog";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Estoque | Auge Motos",
};

const Page = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Estoque"
        description="Acompanhe o inventário de motocicletas"
        action={<InventoryFormDialog />}
      />
      <InventoryFiltersDrawer />
      <InventoryTable />
      <InventoryPreviewDialog />
    </div>
  );
};

export default Page;
