"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { registerSchema, RegisterSchema } from "../_types/registerSchema";
import { useRegister } from "../_services/use-register-mutation";
import Link from "next/link";

const RegisterForm = () => {
  const form = useForm<RegisterSchema>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-primary/10">
          <Image
            src="/logo-auge.png"
            alt="Auge Motos"
            className="object-contain"
            width={64}
            height={64}
          />
        </div>
        <CardTitle className="text-xl font-semibold">Auge Motos</CardTitle>
        <CardDescription>Crie sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormProvider {...form}>
            <ControlledInput<RegisterSchema>
              name="name"
              label="Nome"
              placeholder="Seu nome completo"
            />
            <ControlledInput<RegisterSchema>
              name="email"
              label="E-mail"
              placeholder="seu@email.com"
              type="email"
            />
            <ControlledInput<RegisterSchema>
              name="password"
              label="Senha"
              placeholder="••••••••"
              type="password"
            />
            <ControlledInput<RegisterSchema>
              name="confirmPassword"
              label="Confirmar Senha"
              placeholder="••••••••"
              type="password"
            />
            <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
              Criar Conta
            </Button>
          </FormProvider>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export { RegisterForm };
