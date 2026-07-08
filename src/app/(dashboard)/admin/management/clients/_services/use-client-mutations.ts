import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClient,
  deleteClient,
  updateClient,
} from "./clientMutations";
import { toast } from "sonner";
import { ClientSchema } from "../_types/clientSchema";

const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteClient(id);
    },
    onSuccess: () => {
      toast.success("Cliente excluído com sucesso.");
      queryClient.invalidateQueries({
        queryKey: ["client"],
      });
    },
  });
};

const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClientSchema) => {
      await createClient(data);
    },
    onSuccess: () => {
      toast.success("Cliente criado com sucesso.");
      queryClient.invalidateQueries({
        queryKey: ["client"],
      });
    },
  });
};

const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClientSchema) => {
      await updateClient(data);
    },
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso.");
      queryClient.invalidateQueries({
        queryKey: ["client"],
      });
    },
  });
};

export { useDeleteClient, useCreateClient, useUpdateClient };
