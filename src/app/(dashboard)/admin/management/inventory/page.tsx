import type { Metadata } from "next";
import InventoryTable from "./_components/inventory-table";
import InventoryFormDialog from "./_components/inventory-form-dialog";

export const metadata: Metadata = {
  title: "Estoque | Auge Motos",
};

const Page = () => {
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold">Estoque</h1>
        <InventoryFormDialog />
      </div>
      <InventoryTable />
    </>
  );
};

export default Page;
