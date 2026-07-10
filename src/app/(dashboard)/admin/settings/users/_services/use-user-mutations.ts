import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, updateUser } from "./userMutations";
import { toast } from "sonner";
import { UserSchema } from "../_types/userSchema";

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteUser(id);
    },
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserSchema) => {
      await createUser(data);
    },
    onSuccess: () => {
      toast.success("Usuário criado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserSchema) => {
      await updateUser(data);
    },
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export { useDeleteUser, useCreateUser, useUpdateUser };
