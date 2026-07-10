"use client";

import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  clientFiltersDefaultValues,
  clientFiltersSchema,
  ClientFiltersSchema,
} from "../_types/clientFilterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientStore } from "../_libs/use-clients-store";
import { useEffect, useMemo } from "react";
import equal from "fast-deep-equal";
import { useDebounce } from "@/components/use-debounce";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ControlledInput } from "@/components/ui/controlled-input";
import { Button } from "@/components/ui/button";
import { FilterIcon, Search, X } from "lucide-react";
import { ControlledSelect } from "@/components/ui/controlled-select";

const ClientsFiltersDrawer = () => {
  const form = useForm<ClientFiltersSchema>({
    defaultValues: clientFiltersDefaultValues,
    resolver: zodResolver(clientFiltersSchema),
  });

  const {
    updateClientFilters,
    clientFiltersDrawerOpen,
    updateClientFiltersDrawerOpen,
    updateClientSearchTerm,
    clientFilters,
  } = useClientStore();

  const areFiltersModified = useMemo(
    () => !equal(clientFilters, clientFiltersDefaultValues),
    [clientFilters],
  );

  const searchTerm = useWatch({ control: form.control, name: "searchTerm" });
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const resetSearchTerm = () => {
    form.setValue("searchTerm", "");
    updateClientSearchTerm("");
  };

  useEffect(() => {
    updateClientSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateClientSearchTerm]);

  // Reset only drawer-specific fields (sort) when the drawer closes.
  // searchTerm is managed independently via useWatch + useDebounce,
  // so resetting it here would overwrite what the user is actively typing.
  useEffect(() => {
    if (!clientFiltersDrawerOpen) {
      form.setValue("sortBy", clientFilters.sortBy);
      form.setValue("sortOrder", clientFilters.sortOrder);
    }
  }, [clientFiltersDrawerOpen, clientFilters.sortBy, clientFilters.sortOrder, form]);

  const onSubmit: SubmitHandler<ClientFiltersSchema> = (data) => {
    updateClientFilters(data);
    updateClientFiltersDrawerOpen(false);
  };

  return (
    <Drawer
      open={clientFiltersDrawerOpen}
      onOpenChange={updateClientFiltersDrawerOpen}
      direction="right"
      handleOnly
    >
      <FormProvider {...form}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <ControlledInput<ClientFiltersSchema>
              name="searchTerm"
              placeholder="Pesquise por nome, CPF, cidade..."
              className="pl-9 pr-9"
              aria-label="Buscar clientes"
            />
            {searchTerm && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                onClick={resetSearchTerm}
                aria-label="Limpar busca"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          {/* Filter trigger */}
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              badge={areFiltersModified}
              className="shrink-0 touch-target"
            >
              <FilterIcon className="size-4" aria-hidden="true" />
              Filtros
            </Button>
          </DrawerTrigger>
        </div>

        <form>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filtros</DrawerTitle>
              <DrawerDescription>
                Personalize seus critérios de busca
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-4 p-4">
              <ControlledSelect<ClientFiltersSchema>
                label="Ordenar Por"
                name="sortBy"
                options={[
                  { label: "Nome", value: "name" },
                  { label: "CPF/CNPJ", value: "cpf" },
                  { label: "Cidade", value: "city" },
                  { label: "Vendedor", value: "sellersName" },
                  { label: "Data Faturamento", value: "billingDate" },
                ]}
              />
              <ControlledSelect<ClientFiltersSchema>
                label="Direção"
                name="sortOrder"
                options={[
                  { label: "Ascendente", value: "asc" },
                  { label: "Decrescente", value: "desc" },
                ]}
              />
            </div>

            <DrawerFooter className="pt-2">
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Aplicar Filtros
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(clientFiltersDefaultValues)}
              >
                Redefinir
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export { ClientsFiltersDrawer };
