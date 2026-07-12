"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  motorcycleDefaultValues,
  motorcycleSchema,
  MotorcycleSchema,
} from "../_types/motorcycleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventoryStore } from "../_libs/use-inventory-store";
import { useMotorcycle } from "../_services/use-inventory-queries";
import {
  useCreateMotorcycle,
  useUpdateMotorcycle,
} from "../_services/use-inventory-mutations";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledDatePicker } from "@/components/ui/controlled-date-picker";
import { ValueLabel } from "@/lib/types/valueLabel";
import { Loading } from "@/app/(dashboard)/_components/loading";

type InventoryFormDialogProps = {
  smallTrigger?: boolean;
};

const arrivalStatusOptions: ValueLabel[] = [
  { value: "NO_INFORMATION", label: "Sem Informação" },
  { value: "DELAYED", label: "Atrasado" },
  { value: "ARRIVED", label: "Entregue" },
];

const registrationStatusOptions: ValueLabel[] = [
  { value: "NO_PLATE", label: "Sem Placa" },
  { value: "PLATING", label: "Em Emplacamento" },
  { value: "PLATED", label: "Emplacada" },
];

const InventoryFormDialog = ({ smallTrigger }: InventoryFormDialogProps) => {
  const form = useForm<MotorcycleSchema>({
    defaultValues: motorcycleDefaultValues,
    resolver: zodResolver(motorcycleSchema),
  });

  const {
    selectedMotorcycleId,
    updateMotorcycleId,
    inventoryDialogOpen,
    updateInventoryDialogOpen,
  } = useInventoryStore();

  const motorcycleQuery = useMotorcycle();
  const createMotorcycleMutation = useCreateMotorcycle();
  const updateMotorcycleMutation = useUpdateMotorcycle();

  const isPending =
    createMotorcycleMutation.isPending || updateMotorcycleMutation.isPending;

  useEffect(() => {
    if (selectedMotorcycleId && motorcycleQuery.data) {
      form.reset({
        ...motorcycleQuery.data,
        action: "update",
        id: selectedMotorcycleId,
      });
    }
  }, [motorcycleQuery.data, form, selectedMotorcycleId]);

  const handleDialogOpenChange = (open: boolean) => {
    updateInventoryDialogOpen(open);

    if (!open) {
      updateMotorcycleId(null);
      form.reset(motorcycleDefaultValues);
    }
  };

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };

  const onSubmit: SubmitHandler<MotorcycleSchema> = (data) => {
    if (data.action === "create") {
      createMotorcycleMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
    } else {
      updateMotorcycleMutation.mutate(data, { onSuccess: handleSuccess });
    }
  };

  return (
    <Dialog open={inventoryDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            Nova Motocicleta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedMotorcycleId
              ? "Editar Motocicleta"
              : "Criar nova Motocicleta"}
          </DialogTitle>
        </DialogHeader>
        {selectedMotorcycleId && motorcycleQuery.isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormProvider {...form}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <ControlledInput<MotorcycleSchema>
                    name="model"
                    label="Modelo"
                    placeholder="Ex: Honda CB 500X"
                  />
                </div>

                <div className="col-span-2">
                  <ControlledInput<MotorcycleSchema>
                    name="chassi"
                    label="Chassi"
                    placeholder="Digite o número do chassi"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledInput<MotorcycleSchema>
                    name="year"
                    label="Ano"
                    placeholder="Ex: 2025"
                    type="number"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledInput<MotorcycleSchema>
                    name="price"
                    label="Preço (R$)"
                    placeholder="Ex: 25000"
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledDatePicker<MotorcycleSchema>
                    name="forecastArrival"
                    label="Previsão de Chegada"
                    placeholder="Selecione a data"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledSelect<MotorcycleSchema>
                    name="forecastArrivalStatus"
                    label="Status da Chegada"
                    placeholder="Selecione o status"
                    options={arrivalStatusOptions}
                  />
                </div>

                <div className="col-span-1">
                  <ControlledSelect<MotorcycleSchema>
                    name="registrationStatus"
                    label="Status do Emplacamento"
                    placeholder="Selecione o status"
                    options={registrationStatusOptions}
                  />
                </div>

                <div className="col-span-1">
                  <ControlledDatePicker<MotorcycleSchema>
                    name="registrationDate"
                    label="Data do Emplacamento"
                    placeholder="Selecione a data"
                  />
                </div>
              </div>
            </FormProvider>
            <DialogFooter>
              <Button type="submit" isLoading={isPending}>
                {!!selectedMotorcycleId ? "Editar" : "Criar"} Motocicleta
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
