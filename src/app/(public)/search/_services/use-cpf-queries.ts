"use client";

import { useQuery } from "@tanstack/react-query";
import { searchClientByCpf } from "./cpfQueries";
import type { ClientSearchResult } from "../_types/cpfSearchSchema";

const useSearchClientByCpf = (cpf: string, enabled: boolean) => {
  return useQuery<ClientSearchResult[]>({
    queryKey: ["cpf-search", cpf],
    queryFn: () => searchClientByCpf(cpf),
    enabled: enabled && cpf.replace(/\D/g, "").length >= 3,
    staleTime: 5 * 60 * 1000,
  });
};

export { useSearchClientByCpf };
