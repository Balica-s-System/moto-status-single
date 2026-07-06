import { useQuery } from "@tanstack/react-query";
import { getMotorcycle, getMotorcycles } from "./inventoryQueries";
import { useInventoryStore } from "../_libs/use-inventory-store";

const useGetMotorcycles = () => {
  return useQuery({
    queryKey: ["motorcycle"],
    queryFn: getMotorcycles,
  });
};

const useMotorcycle = () => {
  const { selectedMotorcycleId } = useInventoryStore();
  return useQuery({
    queryKey: ["motorcycle", { selectedMotorcycleId }],
    queryFn: () => getMotorcycle(selectedMotorcycleId!),
    enabled: !!selectedMotorcycleId,
  });
};

export { useGetMotorcycles, useMotorcycle };
