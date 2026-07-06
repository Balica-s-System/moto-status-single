import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InventoryTable from "./_components/inventory-table";

const Page = () => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Estoque</h1>
      </div>
      <InventoryTable />
    </>
  );
};

export default Page;
