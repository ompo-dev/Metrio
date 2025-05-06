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
import { teamAddedSchema } from "@/types/notifications";
import { Badge } from "@/components/ui/badge";

export default function TestSocketPage() {
  const { data: session } = useSession();
  const {
    socket,
    isConnected,
    notifications,
    lastMessage,
    markAsRead,
    markAllAsRead,
  } = useSocketContext();

  const [testMessage, setTestMessage] = useState("");

  // Função para enviar uma notificação de teste
  const sendTestNotification = async (type = "team_added") => {
    try {
      // Verificar se o usuário está autenticado
      if (!session?.user?.id) {
        setTestMessage("Usuário não autenticado");
        return;
      }
      
      // Usar o ID do usuário da sessão
      const userId = session.user.id;
        
      // Preparar dados para a notificação
      let notificationData: any;
      let endpoint: string;
      
      switch (type) {
        case "team_added":
          notificationData = {
            userId,
            teamId: "test-team-id",
            teamName: "Equipe de Teste",
            projectId: "test-project-id",
            projectName: "Projeto de Teste",
          };
          endpoint = "/api/notifications/team-added";
          break;
        case "team_removed":
          notificationData = {
            userId,
            teamId: "test-team-id",
            teamName: "Equipe de Teste",
            projectId: "test-project-id",
            projectName: "Projeto de Teste",
          };
          endpoint = "/api/notifications/team-removed";
          break;
        case "system":
          notificationData = {
            userId,
            message: "Mensagem de teste do sistema",
            severity: "info",
            action: "Testar",
            actionLink: "/test",
          };
          endpoint = "/api/notifications/system";
          break;
        default:
          notificationData = {
            userId,
            teamId: "test-team-id",
            teamName: "Equipe de Teste",
            projectId: "test-project-id",
            projectName: "Projeto de Teste",
          };
          endpoint = "/api/notifications/team-added";
      }

      // Exibir informações do usuário e sessão para debug
      console.log("ID do usuário na sessão:", userId);
      console.log("Dados da notificação:", notificationData);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      // Obter detalhes completos da resposta para debug
      let responseText;
      let responseData;
      try {
        responseText = await response.text();
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        responseData = { error: `Não foi possível analisar a resposta: ${responseText}` };
      }
      
      if (response.ok) {
        setTestMessage(`Notificação de ${type} enviada com sucesso!`);
        console.log("Resposta da notificação:", responseData);
      } else {
        setTestMessage(`Erro ao enviar notificação: ${responseData.error || 'Erro desconhecido'} (${response.status})`);
        console.error("Erro na resposta:", {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          endpoint
        });
      }
    } catch (error) {
      setTestMessage(`Erro: ${error}`);
      console.error("Erro ao enviar notificação:", error);
    }
  };

  // Função para marcar uma notificação como lida
  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markAsRead(notificationId);
    if (success) {
      setTestMessage("Notificação marcada como lida");
    } else {
      setTestMessage("Erro ao marcar notificação como lida");
    }
  };

  // Função para marcar todas as notificações como lidas
  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      setTestMessage("Todas notificações marcadas como lidas");
    } else {
      setTestMessage("Erro ao marcar notificações como lidas");
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
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <Button
                onClick={() => sendTestNotification("team_added")}
                disabled={!isConnected || !session?.user?.id}
              >
                Enviar Notificação de Equipe
              </Button>

              <Button
                onClick={() => sendTestNotification("team_removed")}
                disabled={!isConnected || !session?.user?.id}
                variant="secondary"
              >
                Notif. Remoção de Equipe
              </Button>
            </div>

            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              disabled={!isConnected || notifications.length === 0}
              className="mt-2 w-full"
            >
              Marcar Todas Como Lidas
            </Button>

            {testMessage && (
              <p className="text-sm font-medium mt-2">{testMessage}</p>
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
                    <div key={index} className="border p-3 rounded-md relative">
                      {notification.unread && (
                        <Badge
                          className="absolute top-2 right-2"
                          variant="destructive"
                        >
                          Nova
                        </Badge>
                      )}
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={!notification.unread}
                      >
                        {notification.unread ? "Marcar como lida" : "Lida"}
                      </Button>
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
