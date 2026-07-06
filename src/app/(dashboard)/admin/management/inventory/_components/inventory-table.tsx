"use client";

import { NoItemsFound } from "@/components/no-items-found";
import { useInventoryStore } from "../_libs/use-inventory-store";
import { useDeleteMotorcycle } from "../_services/use-inventory-mutations";
import { useGetMotorcycles } from "../_services/use-inventory-queries";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { alert } from "@/lib/use-global-store";

const InventoryTable = () => {
  const { updateMotorcycleId, updateInventoryDialogOpen } = useInventoryStore();

  const motorcyclesQuery = useGetMotorcycles();
  const deleteMotorcycleMutation = useDeleteMotorcycle();

  if (motorcyclesQuery.data?.length === 0) {
    return <NoItemsFound onClick={() => updateInventoryDialogOpen(true)} />;
  }

  return (
    <>
      {motorcyclesQuery.data?.map((item) => (
        <div>
          <p>{item.model}</p>
          <div className="flex gap-1">
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              onClick={() => {
                updateMotorcycleId(item.id);
                updateInventoryDialogOpen(true);
              }}
            >
              <Edit />
            </Button>
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              onClick={() => {
                alert({
                  onConfirm: () => deleteMotorcycleMutation.mutate(item.id),
                });
              }}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export default InventoryTable;
