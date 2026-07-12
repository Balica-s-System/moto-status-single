import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateProfile, changePassword, deleteProfileImage, deleteCloudinaryImage } from "./profile-mutations";
import { toast } from "sonner";
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "../_types/profileSchema";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UpdateProfileSchema) => {
      await updateProfile(data.name, data.image);
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.refresh();
    },
  });
};

const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordSchema) => {
      await changePassword(data.currentPassword, data.newPassword);
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso.");
    },
  });
};

const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (publicId?: string) => {
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
      await deleteProfileImage();
    },
    onSuccess: () => {
      toast.success("Foto removida com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
};

export { useUpdateProfile, useChangePassword, useDeleteProfileImage };
