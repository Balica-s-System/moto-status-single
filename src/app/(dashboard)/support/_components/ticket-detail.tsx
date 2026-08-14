"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, CalendarClock, Send, User2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ControlledTextarea } from "@/components/ui/controlled-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddTicketMessage,
  useUpdateTicketPriority,
  useUpdateTicketStatus,
} from "../_services/use-ticket-mutations";
import { useTicketById } from "../_services/use-ticket-queries";
import {
  type TicketMessageSchema,
  ticketMessageDefaultValues,
  ticketMessageSchema,
  type UpdateTicketPrioritySchema,
  type UpdateTicketStatusSchema,
} from "../_types/ticketSchema";
import {
  ticketPriorityLabels,
  ticketStatusLabels,
} from "../_types/ticketStatusLabels";
import { PriorityBadge } from "./priority-badge";
import { StatusBadge } from "./status-badge";

type TicketDetailProps = {
  ticketId: string;
  isAdmin: boolean;
};

type ThreadItem = {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
  isOwner: boolean;
};

const TicketDetail = ({ ticketId, isAdmin }: TicketDetailProps) => {
  const { data: ticket, isLoading } = useTicketById(ticketId);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const statusMutation = useUpdateTicketStatus();
  const priorityMutation = useUpdateTicketPriority();
  const addMessageMutation = useAddTicketMessage();

  const form = useForm<TicketMessageSchema>({
    defaultValues: ticketMessageDefaultValues,
    resolver: zodResolver(ticketMessageSchema),
  });

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
    }
  }, [ticket]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    statusMutation.mutate({
      id: ticketId,
      status: value as UpdateTicketStatusSchema["status"],
    });
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    priorityMutation.mutate({
      id: ticketId,
      priority: value as UpdateTicketPrioritySchema["priority"],
    });
  };

  const onSubmitReply: SubmitHandler<TicketMessageSchema> = (data) => {
    addMessageMutation.mutate(
      { ticketId, content: data.content },
      {
        onSuccess: () => {
          form.reset(ticketMessageDefaultValues);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Chamado não encontrado"
          description="O chamado não existe ou você não tem permissão para acessá-lo."
        />
        <Button variant="outline" asChild>
          <Link href="/support">
            <ArrowLeft className="size-4" />
            Voltar para Suporte
          </Link>
        </Button>
      </div>
    );
  }

  const thread: ThreadItem[] = [
    {
      id: "opening",
      content: ticket.message,
      createdAt: ticket.createdAt,
      userName: ticket.userName,
      isOwner: ticket.isOwner,
    },
    ...ticket.messages,
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title={ticket.subject}
        description="Detalhes do chamado e conversa com o suporte"
        action={
          <Button variant="outline" asChild>
            <Link href="/support">
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Informações do Chamado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User2Icon className="size-3.5" aria-hidden="true" />
                Solicitante
              </p>
              <p className="text-sm font-medium">{ticket.userName}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                Atualizado em
              </p>
              <p className="text-sm font-medium">
                {format(new Date(ticket.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            {isAdmin && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">Status</p>
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                  disabled={statusMutation.isPending}
                >
                  <SelectTrigger aria-label="Alterar status do chamado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ticketStatusLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">Prioridade</p>
              <Select
                value={priority}
                onValueChange={handlePriorityChange}
                disabled={priorityMutation.isPending}
              >
                <SelectTrigger aria-label="Alterar prioridade do chamado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ticketPriorityLabels).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {thread.map((message) => (
              <div
                key={message.id}
                className={
                  message.isOwner ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    message.isOwner
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5"
                  }
                >
                  <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
                    <span className="font-medium">{message.userName}</span>
                    <span>
                      {format(
                        new Date(message.createdAt),
                        "dd/MM/yyyy 'às' HH:mm",
                      )}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <form
            onSubmit={form.handleSubmit(onSubmitReply)}
            className="space-y-3"
          >
            <FormProvider {...form}>
              <ControlledTextarea<TicketMessageSchema>
                name="content"
                label="Responder"
                placeholder="Escreva sua mensagem..."
                className="min-h-24"
              />
            </FormProvider>
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={addMessageMutation.isPending}
                loadingText="Enviando..."
              >
                <Send className="size-4" />
                Enviar Resposta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { TicketDetail };
