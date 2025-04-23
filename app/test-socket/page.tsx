"use client";

import { useEffect, useState } from "react";
import { useSocketContext } from "@/lib/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function TestSocketPage() {
  const { data: session } = useSession();
  const { socket, isConnected, notifications, lastMessage } =
    useSocketContext();
  const [testMessage, setTestMessage] = useState("");

  // Função para enviar uma notificação de teste
  const sendTestNotification = async () => {
    try {
      const response = await fetch("/api/notifications/team-added", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          teamId: "test-team-id",
          teamName: "Equipe de Teste",
          projectId: "test-project-id",
          projectName: "Projeto de Teste",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestMessage("Notificação enviada com sucesso!");
        console.log("Resposta da notificação:", data);
      } else {
        setTestMessage("Erro ao enviar notificação");
        console.error("Erro na resposta:", await response.json());
      }
    } catch (error) {
      setTestMessage(`Erro: ${error}`);
      console.error("Erro ao enviar notificação:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teste de WebSocket</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status da Conexão</CardTitle>
            <CardDescription>
              Informações sobre a conexão WebSocket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="font-semibold">Status:</p>
              <p
                className={`${isConnected ? "text-green-500" : "text-red-500"}`}
              >
                {isConnected ? "Conectado" : "Desconectado"}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold">ID do Socket:</p>
              <p>{socket?.id || "Nenhum"}</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Usuário:</p>
              <p>{session?.user?.email || "Não autenticado"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={sendTestNotification}
              disabled={!isConnected || !session?.user?.id}
            >
              Enviar Notificação de Teste
            </Button>
            {testMessage && (
              <p className="ml-4 text-sm font-medium">{testMessage}</p>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações Recebidas</CardTitle>
            <CardDescription>
              Notificações recebidas via WebSocket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <div className="font-semibold">
                        {notification.type === "team_added" &&
                          "Adicionado à equipe"}
                        {notification.type === "team_removed" &&
                          "Removido da equipe"}
                        {!["team_added", "team_removed"].includes(
                          notification.type
                        ) && notification.type}
                      </div>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(notification, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma notificação recebida
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
