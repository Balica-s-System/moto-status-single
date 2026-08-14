"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import { useCreateTicket } from "../_services/use-ticket-mutations";
import {
  type CreateTicketSchema,
  createTicketDefaultValues,
  createTicketSchema,
} from "../_types/ticketSchema";
import { ticketPriorityLabels } from "../_types/ticketStatusLabels";

const priorityOptions = Object.entries(ticketPriorityLabels).map(
  ([value, label]) => ({ value, label }),
);

const NewTicketForm = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const createTicketMutation = useCreateTicket();

  const form = useForm<CreateTicketSchema>({
    defaultValues: createTicketDefaultValues,
    resolver: zodResolver(createTicketSchema),
  });

  const onSubmit: SubmitHandler<CreateTicketSchema> = (data) => {
    setSubmitting(true);
    createTicketMutation.mutate(data, {
      onSuccess: () => {
        router.push("/support");
      },
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Novo Chamado"
        description="Descreva o problema para nossa equipe de suporte"
      />
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do chamado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormProvider {...form}>
              <ControlledInput<CreateTicketSchema>
                name="subject"
                label="Assunto"
                placeholder="Resumo do problema"
              />
              <ControlledTextarea<CreateTicketSchema>
                name="message"
                label="Descrição"
                placeholder="Descreva o problema em detalhes"
                className="min-h-32"
              />
              <ControlledSelect<CreateTicketSchema>
                name="priority"
                label="Prioridade"
                options={priorityOptions}
                placeholder="Selecione a prioridade"
              />
            </FormProvider>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/support">
                  <ArrowLeft className="size-4" />
                  Cancelar
                </Link>
              </Button>
              <Button type="submit" isLoading={submitting}>
                <Send className="size-4" />
                Enviar Chamado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { NewTicketForm };
