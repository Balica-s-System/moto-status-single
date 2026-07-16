"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ControlledInput } from "@/components/ui/controlled-input";
import { maskDocument } from "@/lib/format";
import { useDebounce } from "@/components/use-debounce";
import { useSearchClientByCpf } from "../_services/use-cpf-queries";
import { searchSchema, type SearchSchema } from "../_types/cpfSearchSchema";
import { CpfSearchSkeleton } from "./cpf-search-skeleton";
import { ResultCard } from "./result-card";
import { Search, UserSearch } from "lucide-react";

const CpfSearch = () => {
  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { cpf: "" },
  });

  const watchedCpf = useWatch({ control: form.control, name: "cpf" });
  const debouncedCpf = useDebounce(watchedCpf ?? "", 400);
  const digits = debouncedCpf.replace(/\D/g, "");

  const { data, isLoading, isFetching, error } = useSearchClientByCpf(
    debouncedCpf,
    digits.length >= 3,
  );

  const hasSearched = digits.length >= 3;
  const isEmpty =
    hasSearched && !isLoading && !isFetching && data?.length === 0;
  const hasResults = hasSearched && data && data.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Buscar Cliente</h1>
        <p className="text-muted-foreground">
          Digite o CPF ou CNPJ para consultar os dados do cliente e suas motos.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <ControlledInput
            name="cpf"
            label="CPF / CNPJ"
            placeholder="000.000.000-00"
            sanitize={maskDocument}
            autoFocus
          />
        </form>
      </Form>

      {!hasSearched && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <UserSearch className="size-12" />
          <p className="text-sm">Digite ao menos 3 dígitos para buscar</p>
        </div>
      )}

      {hasSearched && (isLoading || isFetching) && <CpfSearchSkeleton />}

      {error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-destructive">
          <Search className="size-12" />
          <p className="text-sm font-medium">{error.message}</p>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Search className="size-12" />
          <p className="text-sm">Nenhum cliente encontrado para este CPF</p>
        </div>
      )}

      {hasResults && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {data.length} cliente{data.length !== 1 ? "s" : ""} encontrado
            {data.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-4">
            {data.map((client) => (
              <ResultCard key={client.id} client={client} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CpfSearch;
