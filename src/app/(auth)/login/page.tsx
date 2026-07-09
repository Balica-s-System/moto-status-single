"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../_types/loginSchema";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bike } from "lucide-react";

const Page = () => {
  const form = useForm<LoginSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    console.log("login:", data);
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
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </FormProvider>
        </form>
      </CardContent>
    </Card>
  );
};

export default Page;
