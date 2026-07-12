import { useQuery } from "@tanstack/react-query";
import { getClient, getClients, getAvailableMotorcycles } from "./clientQueries";
import { useClientStore } from "../_libs/use-clients-store";
import type { ClientFiltersSchema } from "../_types/clientFilterSchema";

const useGetClients = (filters: ClientFiltersSchema) => {
  return useQuery({
    queryKey: ["client", filters],
    queryFn: () => getClients(filters),
  });
};

const useClient = () => {
  const { selectedClientId } = useClientStore();
  return useQuery({
    queryKey: ["client", { selectedClientId }],
    queryFn: () => getClient(selectedClientId!),
    enabled: !!selectedClientId,
  });
};

const useAvailableMotorcycles = (search?: string, includeIds?: string[]) => {
  return useQuery({
    queryKey: ["availableMotorcycles", search, includeIds],
    queryFn: () => getAvailableMotorcycles(search, includeIds),
  });
};

export { useGetClients, useClient, useAvailableMotorcycles };
