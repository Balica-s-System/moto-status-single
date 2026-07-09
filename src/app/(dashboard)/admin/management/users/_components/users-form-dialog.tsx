"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userDefaultValues, userSchema, UserSchema } from "../_types/userSchema";
import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { useCreateUser, useUpdateUser } from "../_services/use-user-mutations";
import { useUserById } from "../_services/use-user-queries";
import { Loading } from "@/app/(dashboard)/_components/loading";
import { ValueLabel } from "@/lib/types/valueLabel";

const roleOptions: ValueLabel[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "USER", label: "Usuário" },
];

type UsersFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserId: string | null;
  onClearSelection: () => void;
};

const UsersFormDialog = ({
  open,
  onOpenChange,
  selectedUserId,
  onClearSelection,
}: UsersFormDialogProps) => {
  const userQuery = useUserById(selectedUserId ?? "");
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isPending = createUserMutation.isPending || updateUserMutation.isPending;

  const form = useForm<UserSchema>({
    defaultValues: userDefaultValues,
    resolver: zodResolver(userSchema),
  });

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      onClearSelection();
      form.reset(userDefaultValues);
    }
  };

  const onSubmit: SubmitHandler<UserSchema> = (data) => {
    if (data.action === "create") {
      createUserMutation.mutate(data, {
        onSuccess: () => handleOpenChange(false),
      });
    } else {
      updateUserMutation.mutate(data, {
        onSuccess: () => handleOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedUserId ? "Editar Usuário" : "Criar novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        {selectedUserId && userQuery.isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormProvider {...form}>
              <div className="space-y-4">
                <ControlledInput<UserSchema>
                  name="name"
                  label="Nome"
                  placeholder="Ex: João Silva"
                />
                <ControlledInput<UserSchema>
                  name="email"
                  label="E-mail"
                  placeholder="seu@email.com"
                  type="email"
                />
                <ControlledInput<UserSchema>
                  name="password"
                  label={selectedUserId ? "Nova Senha (deixe vazio para manter)" : "Senha"}
                  placeholder="••••••••"
                  type="password"
                />
                <ControlledSelect<UserSchema>
                  name="role"
                  label="Perfil"
                  placeholder="Selecione o perfil"
                  options={roleOptions}
                />
              </div>
            </FormProvider>
            <DialogFooter>
              <Button type="submit" isLoading={isPending}>
                {!!selectedUserId ? "Editar" : "Criar"} Usuário
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { UsersFormDialog };
