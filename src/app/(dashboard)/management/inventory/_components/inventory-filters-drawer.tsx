"use client";

import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  motorcycleFiltersDefaultValues,
  motorcycleFiltersSchema,
  MotorcycleFiltersSchema,
} from "../_types/motorcycleFilterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventoryStore } from "../_libs/use-inventory-store";
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

const InventoryFiltersDrawer = () => {
  const form = useForm<MotorcycleFiltersSchema>({
    defaultValues: motorcycleFiltersDefaultValues,
    resolver: zodResolver(motorcycleFiltersSchema),
  });

  const {
    updateMotorcycleFilters,
    motorcycleFiltersDrawerOpen,
    updateMotorcycleFiltersDrawerOpen,
    updateMotorcycleSearchTerm,
    motorcycleFilters,
  } = useInventoryStore();

  const areFiltersModified = useMemo(
    () => !equal(motorcycleFilters, motorcycleFiltersDefaultValues),
    [motorcycleFilters],
  );

  const searchTerm = useWatch({ control: form.control, name: "searchTerm" });
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const resetSearchTerm = () => {
    form.setValue("searchTerm", "");
    updateMotorcycleSearchTerm("");
  };

  useEffect(() => {
    updateMotorcycleSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateMotorcycleSearchTerm]);

  useEffect(() => {
    if (!motorcycleFiltersDrawerOpen) {
      form.setValue("sortBy", motorcycleFilters.sortBy);
      form.setValue("sortOrder", motorcycleFilters.sortOrder);
      form.setValue("forecastArrivalStatus", motorcycleFilters.forecastArrivalStatus);
    }
  }, [motorcycleFiltersDrawerOpen, motorcycleFilters.sortBy, motorcycleFilters.sortOrder, motorcycleFilters.forecastArrivalStatus, form]);

  const onSubmit: SubmitHandler<MotorcycleFiltersSchema> = (data) => {
    updateMotorcycleFilters(data);
    updateMotorcycleFiltersDrawerOpen(false);
  };

  return (
    <Drawer
      open={motorcycleFiltersDrawerOpen}
      onOpenChange={updateMotorcycleFiltersDrawerOpen}
      direction="right"
      handleOnly
    >
      <FormProvider {...form}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <ControlledInput<MotorcycleFiltersSchema>
              name="searchTerm"
              placeholder="Pesquise por modelo ou chassi..."
              className="pl-9 pr-9"
              aria-label="Buscar motocicletas"
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
              <ControlledSelect<MotorcycleFiltersSchema>
                label="Ordenar Por"
                name="sortBy"
                options={[
                  { label: "Chassi", value: "chassi" },
                  { label: "Modelo", value: "model" },
                  { label: "Previsão de Chegada", value: "forecastArrival" },
                ]}
              />
              <ControlledSelect<MotorcycleFiltersSchema>
                label="Direção"
                name="sortOrder"
                options={[
                  { label: "Ascendente", value: "asc" },
                  { label: "Decrescente", value: "desc" },
                ]}
              />
              <ControlledSelect<MotorcycleFiltersSchema>
                label="Status da Chegada"
                name="forecastArrivalStatus"
                placeholder="Todos os status"
                options={[
                  { label: "Entregue", value: "ARRIVED" },
                  { label: "Atrasado", value: "DELAYED" },
                  { label: "Sem Informação", value: "NO_INFORMATION" },
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
                onClick={() => form.reset(motorcycleFiltersDefaultValues)}
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

export { InventoryFiltersDrawer };
