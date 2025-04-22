"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Schema de validação do formulário
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome precisa ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha precisa ter pelo menos 6 caracteres.",
  }),
});

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Configuração do formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Registrar usuário
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          inviteToken: inviteToken || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao registrar usuário");
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o login.",
      });

      // Se tiver um token de convite, redirecionar para a página de convite após o login
      if (inviteToken) {
        // Fazer login automaticamente
        const loginResponse = await fetch("/api/auth/callback/credentials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            redirect: false,
          }),
        });

        if (loginResponse.ok) {
          router.push(`/join/${inviteToken}`);
        } else {
          router.push(`/auth/login?inviteToken=${inviteToken}`);
        }
      } else {
        // Redirecionar para a página de login
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Já tem uma conta?{" "}
        <Link
          href={
            inviteToken
              ? `/auth/login?inviteToken=${inviteToken}`
              : "/auth/login"
          }
          className="font-medium text-primary hover:underline"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
