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
import { Bike } from "lucide-react";
import { loginSchema, LoginSchema } from "../_types/loginSchema";
import { useLogin } from "../_services/use-login-mutation";
import Link from "next/link";

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <Bike className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Auge Motos</CardTitle>
        <CardDescription>Faça login para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormProvider {...form}>
            <ControlledInput<LoginSchema>
              name="email"
              label="E-mail"
              placeholder="seu@email.com"
              type="email"
            />
            <ControlledInput<LoginSchema>
              name="password"
              label="Senha"
              placeholder="••••••••"
              type="password"
            />
            <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
              Entrar
            </Button>
          </FormProvider>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export { LoginForm };
