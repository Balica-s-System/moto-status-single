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
import { loginSchema, LoginSchema } from "../_types/loginSchema";
import { useLogin } from "../_services/use-login-mutation";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="w-full border-border/50 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Image
              src="/logo-auge.png"
              alt="Auge Motos"
              className="object-contain"
              width={48}
              height={48}
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-sm">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
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
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loginMutation.isPending}
              >
                Entrar
              </Button>
            </FormProvider>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { LoginForm };
