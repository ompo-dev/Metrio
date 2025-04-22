"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ThumbsUp, UserPlus, AlertCircle } from "lucide-react";

interface InviteData {
  id: string;
  token: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  project: {
    id: string;
    name: string;
    logoIcon: string;
  };
  sender: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  expiresAt: string;
}

interface JoinWithInviteProps {
  token: string;
  userId: string;
}

export function JoinWithInvite({ token, userId }: JoinWithInviteProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        const response = await fetch(`/api/invites/${token}`);

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Erro ao processar o convite");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setInviteData(data.invite);

        // Se o convite não estiver pendente, mostrar mensagem
        if (data.invite.status !== "pending") {
          setError(
            `Este convite já foi ${
              data.invite.status === "accepted"
                ? "aceito"
                : data.invite.status === "rejected"
                ? "rejeitado"
                : "expirado"
            }.`
          );
          setLoading(false);
          return;
        }

        // Se o email do convite não corresponder ao usuário logado, mostrar aviso
        // mas continuar permitindo o acesso

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do convite:", error);
        setError("Não foi possível buscar os dados do convite");
        setLoading(false);
      }
    };

    fetchInviteData();
  }, [token]);

  const handleAccept = async () => {
    if (!inviteData) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/invites/${inviteData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "accept",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao aceitar o convite");
        setLoading(false);
        return;
      }

      const data = await response.json();

      setSuccess(true);

      // Mostrar toast de sucesso
      toast({
        title: "Convite aceito!",
        description: `Você agora faz parte do projeto ${inviteData.project.name}`,
      });

      // Aguardar 2 segundos e redirecionar para o dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      setError("Não foi possível aceitar o convite");
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!inviteData) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/invites/${inviteData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao recusar o convite");
        setLoading(false);
        return;
      }

      // Mostrar toast de sucesso
      toast({
        title: "Convite recusado",
        description: `Você recusou o convite para o projeto ${inviteData.project.name}`,
      });

      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao recusar convite:", error);
      setError("Não foi possível recusar o convite");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-center text-muted-foreground">
            Processando seu convite...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Erro no Convite</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/dashboard")}>
            Ir para o Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Convite Aceito!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ThumbsUp className="h-12 w-12 text-primary" />
          <p className="text-center text-muted-foreground">
            Você agora faz parte do projeto{" "}
            <span className="font-medium">{inviteData?.project.name}</span>.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/dashboard")}>
            Ir para o Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {inviteData?.project.logoIcon && (
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
              <Image
                src={inviteData.project.logoIcon}
                alt={inviteData.project.name}
                width={48}
                height={48}
              />
            </div>
          )}
        </div>
        <CardTitle className="text-center">Convite para Projeto</CardTitle>
        <CardDescription className="text-center">
          Você foi convidado para participar de um projeto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projeto:</span>
            <span className="font-medium">{inviteData?.project.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Convidado por:</span>
            <span className="font-medium">
              {inviteData?.sender.name || inviteData?.sender.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expira em:</span>
            <span className="font-medium">
              {inviteData?.expiresAt
                ? new Date(inviteData.expiresAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReject}>
          Recusar
        </Button>
        <Button onClick={handleAccept}>
          <UserPlus className="mr-2 h-4 w-4" /> Aceitar Convite
        </Button>
      </CardFooter>
    </Card>
  );
}
