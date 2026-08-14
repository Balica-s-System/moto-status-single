import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateTicketSchema,
  UpdateTicketPrioritySchema,
  UpdateTicketStatusSchema,
} from "../_types/ticketSchema";
import {
  addTicketMessage,
  createTicket,
  updateTicketPriority,
  updateTicketStatus,
} from "./ticketMutations";

const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketSchema) => createTicket(data),
    onSuccess: () => {
      toast.success("Chamado criado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
  });
};

const useAddTicketMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      content,
    }: {
      ticketId: string;
      content: string;
    }) => addTicketMessage(ticketId, content),
    onSuccess: (_data, variables) => {
      toast.success("Mensagem enviada.");
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });
    },
  });
};

const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTicketStatusSchema) => updateTicketStatus(data),
    onSuccess: (_data, variables) => {
      toast.success("Status do chamado atualizado.");
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.id],
      });
    },
  });
};

const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTicketPrioritySchema) =>
      updateTicketPriority(data),
    onSuccess: (_data, variables) => {
      toast.success("Prioridade do chamado atualizada.");
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.id],
      });
    },
  });
};

export {
  useAddTicketMessage,
  useCreateTicket,
  useUpdateTicketPriority,
  useUpdateTicketStatus,
};
