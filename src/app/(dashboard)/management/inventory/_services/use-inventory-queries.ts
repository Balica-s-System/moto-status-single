import { useQuery } from "@tanstack/react-query";
import { getMotorcycle, getMotorcycles } from "./inventoryQueries";
import { useInventoryStore } from "../_libs/use-inventory-store";
import type { MotorcycleFiltersSchema } from "../_types/motorcycleFilterSchema";

const useGetMotorcycles = (filters: MotorcycleFiltersSchema) => {
  return useQuery({
    queryKey: ["motorcycle", filters],
    queryFn: () => getMotorcycles(filters),
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
