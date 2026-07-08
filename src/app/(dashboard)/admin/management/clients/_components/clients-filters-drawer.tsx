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
import { BrushCleaning, FilterIcon, X } from "lucide-react";
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
  }

  useEffect(() => {
    updateClientSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateClientSearchTerm]);

  useEffect(() => {
    if (!clientFiltersDrawerOpen) {
      form.reset(clientFilters);
    }
  }, [clientFilters, clientFiltersDrawerOpen, form]);

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
        <div className="flex gap-2">
          <div className="flex min-w-82 items-center gap-2">
            <ControlledInput<ClientFiltersSchema>
              name="searchTerm"
              placeholder="Pesquise por Nome, CPF/CNPJ, Cidade ou Vendedor"
              className="flex-1"
            />

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={resetSearchTerm}
              aria-label="Limpar busca"
              title="Limpar busca"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DrawerTrigger asChild>
            <Button variant="outline" badge={areFiltersModified}>
              <FilterIcon />
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

            <div className="space-y-2 p-4">
              <div className="flex flex-wrap gap-2">
                <ControlledSelect<ClientFiltersSchema>
                  label="Ordernar Por"
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
                  label="Ordernar"
                  name="sortOrder"
                  options={[
                    { label: "Ascendente", value: "asc" },
                    { label: "Decrescente", value: "desc" },
                  ]}

                />
              </div>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(clientFiltersDefaultValues);
                }}
              >
                Redefinir
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Aplicar Filtros
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export { ClientsFiltersDrawer };
