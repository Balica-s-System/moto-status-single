"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  clientDefaultValues,
  clientSchema,
  ClientSchema,
} from "../_types/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientStore } from "../_libs/use-clients-store";
import { useClient } from "../_services/use-client-queries";
import {
  useCreateClient,
  useUpdateClient,
} from "../_services/use-client-mutations";
import { useEffect, useState } from "react";
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
import { ControlledDatePicker } from "@/components/ui/controlled-date-picker";
import {
  ControlledCombobox,
  ComboboxItem,
} from "@/components/ui/controlled-combobox";
import { useAvailableMotorcycles } from "../_services/use-client-queries";
import { maskDocument } from "@/lib/format";
import { Loading } from "@/app/(dashboard)/_components/loading";

type ClientsFormDialogProps = {
  smallTrigger?: boolean;
};

const ClientsFormDialog = ({ smallTrigger }: ClientsFormDialogProps) => {
  const form = useForm<ClientSchema>({
    defaultValues: clientDefaultValues,
    resolver: zodResolver(clientSchema),
  });

  const {
    selectedClientId,
    updateClientId,
    clientDialogOpen,
    updateClientDialogOpen,
  } = useClientStore();

  const clientQuery = useClient();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const [motorcycleSearch, setMotorcycleSearch] = useState("");
  const availableMotorcyclesQuery = useAvailableMotorcycles(
    motorcycleSearch,
    selectedClientId ? clientQuery.data?.motorcycleIds : undefined,
  );

  const isPending =
    createClientMutation.isPending || updateClientMutation.isPending;

  useEffect(() => {
    if (selectedClientId && clientQuery.data) {
      form.reset({
        ...clientQuery.data,
        action: "update",
        id: selectedClientId,
      });
    }
  }, [clientQuery.data, form, selectedClientId]);

  const handleDialogOpenChange = (open: boolean) => {
    updateClientDialogOpen(open);

    if (!open) {
      updateClientId(null);
      form.reset(clientDefaultValues);
      setMotorcycleSearch("");
    }
  };

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };

  const onSubmit: SubmitHandler<ClientSchema> = (data) => {
    if (data.action === "create") {
      createClientMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
    } else {
      updateClientMutation.mutate(data, { onSuccess: handleSuccess });
    }
  };

  const motorcycleOptions: ComboboxItem[] = (
    availableMotorcyclesQuery.data ?? []
  ).map((m) => ({
    id: m.id,
    label: m.chassi,
    subtitle: m.model,
  }));

  return (
    <Dialog open={clientDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            Novo Cliente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedClientId ? "Editar Cliente" : "Criar novo Cliente"}
          </DialogTitle>
        </DialogHeader>
        {selectedClientId && clientQuery.isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormProvider {...form}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <ControlledInput<ClientSchema>
                    name="name"
                    label="Nome"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledInput<ClientSchema>
                    name="cpf"
                    label="CPF / CNPJ"
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    sanitize={maskDocument}
                  />
                </div>

                <div className="col-span-1">
                  <ControlledInput<ClientSchema>
                    name="city"
                    label="Cidade"
                    placeholder="Ex: São Paulo"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledInput<ClientSchema>
                    name="sellersName"
                    label="Nome do Vendedor"
                    placeholder="Ex: Carlos"
                  />
                </div>

                <div className="col-span-1">
                  <ControlledDatePicker<ClientSchema>
                    name="billingDate"
                    label="Data de Faturamento"
                    placeholder="Selecione a data"
                  />
                </div>

                <div className="col-span-2">
                  <ControlledCombobox<ClientSchema>
                    name="motorcycleIds"
                    label="Motocicletas"
                    placeholder="Selecione as motocicletas"
                    searchPlaceholder="Busque por chassi ou modelo..."
                    options={motorcycleOptions}
                    loading={availableMotorcyclesQuery.isLoading}
                    onSearch={setMotorcycleSearch}
                  />
                </div>
              </div>
            </FormProvider>
            <DialogFooter>
              <Button type="submit" isLoading={isPending}>
                {!!selectedClientId ? "Editar" : "Criar"} Cliente
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientsFormDialog;
