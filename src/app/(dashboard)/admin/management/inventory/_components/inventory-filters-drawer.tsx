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
import { BrushCleaning, FilterIcon, X } from "lucide-react";
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

  useEffect(() => {
    updateMotorcycleSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateMotorcycleSearchTerm]);

  useEffect(() => {
    if (!motorcycleFiltersDrawerOpen) {
      form.reset(motorcycleFilters);
    }
  }, [motorcycleFilters, motorcycleFiltersDrawerOpen, form]);

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
        <div className="flex gap-2">
          <div className="flex min-w-82 items-center gap-2">
            <ControlledInput<MotorcycleFiltersSchema>
              name="searchTerm"
              placeholder="Pesquise por Modelo ou Chassi"
              className="flex-1"
            />

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => form.resetField("searchTerm")}
              aria-label="Limpar busca"
              title="Limpar busca"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DrawerTrigger asChild>
            <Button variant="outline" badge={areFiltersModified}>
              <FilterIcon />
              Filters
            </Button>
          </DrawerTrigger>
        </div>
        <form>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Customize your motorcycle search criteria
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-2 p-4">
              <div className="flex flex-wrap gap-2">
                <ControlledSelect<MotorcycleFiltersSchema>
                  label="Ordernar Por"
                  name="sortBy"
                  options={[
                    { label: "Chassi", value: "chassi" },
                    { label: "Modelo", value: "model" },
                    { label: "Previsão de Chegada", value: "forecastArrival" },
                  ]}
                />

                <ControlledSelect<MotorcycleFiltersSchema>
                  label="Ordernar"
                  name="sortOrder"
                  options={[
                    { label: "Ascendente", value: "asc" },
                    { label: "Decrescente", value: "desc" },
                  ]}

                />
                <ControlledSelect<MotorcycleFiltersSchema>
                  label="Status da Chegada"
                  name="forecastArrivalStatus"
                  placeholder="Escolha um status"
                  options={[
                    { label: "Entregue", value: "ARRIVED" },
                    { label: "Atrasado", value: "DELAYED" },
                    { label: "Sem Informação", value: "NO_INFORMATION" },
                  ]}
                />
              </div>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(motorcycleFiltersDefaultValues);
                }}
              >
                Reset
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Apply Filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export { InventoryFiltersDrawer };
