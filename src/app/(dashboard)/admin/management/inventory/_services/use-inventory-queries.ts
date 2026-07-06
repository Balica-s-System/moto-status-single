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
  const { motorcycleId } = useInventoryStore();
  return useQuery({
    queryKey: ["motorcycle", { motorcycleId }],
    queryFn: () => getMotorcycle(motorcycleId!),
    enabled: !!motorcycleId,
  });
};

export { useGetMotorcycles, useMotorcycle };
