import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMotorcycle,
  deleteMotorcycle,
  updateMotorcycle,
} from "./inventoryMutations";
import { toast } from "sonner";
import { MotorcycleSchema } from "../_types/motorcycleSchema";

const useDeleteMotorcycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteMotorcycle(id);
    },
    onSuccess: () => {
      toast.success("Motorcycle deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["motorcycle"],
      });
    },
  });
};

const useCreateMotorcycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MotorcycleSchema) => {
      await createMotorcycle(data);
    },
    onSuccess: () => {
      toast.success("Motorcycle created successfully.");
      queryClient.invalidateQueries({
        queryKey: ["motorcycle"],
      });
    },
  });
};

const useUpdateMotorcycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MotorcycleSchema) => {
      await updateMotorcycle(data);
    },
    onSuccess: () => {
      toast.success("Motorcycle updated successfully.");
      queryClient.invalidateQueries({
        queryKey: ["motorcycle"],
      });
    },
  });
};

export { useDeleteMotorcycle, useCreateMotorcycle, useUpdateMotorcycle };
