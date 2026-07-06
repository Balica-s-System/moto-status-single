import InventoryTable from "./_components/inventory-table";
import InventoryFormDialog from "./_components/inventory-form-dialog";

const Page = () => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Estoque</h1>
        <InventoryFormDialog />
      </div>
      <InventoryTable />
    </>
  );
};

export default Page;
