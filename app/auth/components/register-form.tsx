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
import { signIn } from "next-auth/react";

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

interface RegisterFormProps {
  inviteToken?: string;
  inviteProjectId?: string;
}

export function RegisterForm({
  inviteToken,
  inviteProjectId,
}: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Usar parâmetros passados como props ou do URL se não for passado como prop
  const inviteTokenParam = inviteToken || searchParams.get("inviteToken");
  const inviteProjectIdParam =
    inviteProjectId || searchParams.get("inviteProjectId");

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

  // Função para fazer login automático
  const handleAutoLogin = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Erro ao fazer login automático:", result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao fazer login automático:", error);
      return false;
    }
  };

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
          inviteToken: inviteTokenParam || undefined,
          inviteProjectId: inviteProjectIdParam || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao registrar usuário");
      }

      toast({
        title: "Conta criada com sucesso!",
        description: inviteTokenParam
          ? "Você está sendo conectado ao projeto."
          : "Você será redirecionado para o login.",
      });

      // Se tiver um token de convite, fazer login automático
      if (inviteTokenParam) {
        const loginSuccess = await handleAutoLogin(
          values.email,
          values.password
        );

        if (loginSuccess) {
          // Redirecionar para o dashboard, já que o usuário já foi vinculado ao projeto
          router.push("/dashboard");
        } else {
          // Fallback: redirecionar para login se o auto-login falhar
          router.push(`/auth/login?inviteToken=${inviteTokenParam}`);
        }
      } else {
        // Redirecionar para a página de login normal
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
            inviteTokenParam
              ? `/auth/login?inviteToken=${inviteTokenParam}`
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
