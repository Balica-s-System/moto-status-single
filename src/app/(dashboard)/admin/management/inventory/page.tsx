import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { InventoryTable } from "./create/_components/inventory-table";

const Page = () => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Estoque</h1>
        <Link
          className={buttonVariants({
            className: "mr-2",
          })}
          href="/admin/management/inventory/create"
        >
          <Plus />
          Nova motocicleta
        </Link>
      </div>
      <InventoryTable />
    </>
  );
};

export default Page;
