"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ControlledInput } from "@/components/ui/controlled-input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  changePasswordSchema,
  updateProfileDefaultValues,
  changePasswordDefaultValues,
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "../_types/profileSchema";
import { useUpdateProfile, useChangePassword, useDeleteProfileImage } from "../_services/use-profile-mutations";
import { useProfileStore } from "../_libs/use-profile-store";
import { useUploadImage } from "../_libs/use-upload-image";
import { PageHeader } from "@/components/page-header";
import { Mail, User, Lock, Camera, Trash2, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type ProfilePageProps = {
  name: string;
  email: string;
  image: string | null;
};

const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
};

const ProfilePage = ({ name, email, image }: ProfilePageProps) => {
  const { editingSection, setEditingSection, imagePreview, setImagePreview } =
    useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const profileForm = useForm<UpdateProfileSchema>({
    defaultValues: { ...updateProfileDefaultValues, name },
    resolver: zodResolver(updateProfileSchema),
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    defaultValues: changePasswordDefaultValues,
    resolver: zodResolver(changePasswordSchema),
  });

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteImageMutation = useDeleteProfileImage();
  const { uploading, upload } = useUploadImage();

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const currentImage = imagePreview || image;

  const onProfileSubmit: SubmitHandler<UpdateProfileSchema> = async (data) => {
    setEditingSection("profile");
    let uploadedUrl: string | undefined;

    if (selectedFile) {
      const result = await upload(selectedFile);
      if (result) {
        uploadedUrl = result;
        setImagePreview(null);
        setSelectedFile(null);
      } else {
        setEditingSection(null);
        return;
      }
    }

    updateProfileMutation.mutate(
      { ...data, image: uploadedUrl || data.image },
      {
        onSettled: () => setEditingSection(null),
      },
    );
  };

  const onPasswordSubmit: SubmitHandler<ChangePasswordSchema> = (data) => {
    setEditingSection("password");
    changePasswordMutation.mutate(data, {
      onSettled: () => {
        setEditingSection(null);
        passwordForm.reset(changePasswordDefaultValues);
      },
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB.");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = async () => {
    const publicId = image ? extractPublicId(image) : undefined;
    setEditingSection("image");
    deleteImageMutation.mutate(publicId ?? undefined, {
      onSettled: () => {
        setEditingSection(null);
        setImagePreview(null);
        setSelectedFile(null);
      },
    });
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações do Perfil"
        description="Gerencie suas informações pessoais e segurança da conta."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="size-5" />
            Foto do Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="size-24 ring-4 ring-border">
            {currentImage ? (
              <AvatarImage src={currentImage} alt={name} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-2xl font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || deleteImageMutation.isPending}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Camera className="mr-2 size-4" />
                  {image ? "Alterar Foto" : "Adicionar Foto"}
                </>
              )}
            </Button>
            {(image || imagePreview) && (
              <Button
                type="button"
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleRemoveImage}
                disabled={uploading || deleteImageMutation.isPending}
              >
                <Trash2 className="mr-2 size-4" />
                Remover Foto
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou WEBP. Máximo 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Informações do Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <FormProvider {...profileForm}>
              <ControlledInput<UpdateProfileSchema>
                name="name"
                label="Nome"
                placeholder="Seu nome completo"
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  E-mail
                </label>
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" />
                  <span>{email}</span>
                </div>
              </div>
            </FormProvider>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                isLoading={
                  editingSection === "profile" && updateProfileMutation.isPending
                }
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <FormProvider {...passwordForm}>
              <ControlledInput<ChangePasswordSchema>
                name="currentPassword"
                label="Senha Atual"
                placeholder="••••••••"
                type="password"
              />
              <Separator />
              <ControlledInput<ChangePasswordSchema>
                name="newPassword"
                label="Nova Senha"
                placeholder="••••••••"
                type="password"
              />
              <ControlledInput<ChangePasswordSchema>
                name="confirmPassword"
                label="Confirmar Nova Senha"
                placeholder="••••••••"
                type="password"
              />
            </FormProvider>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                isLoading={
                  editingSection === "password" && changePasswordMutation.isPending
                }
              >
                Alterar Senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { ProfilePage };
