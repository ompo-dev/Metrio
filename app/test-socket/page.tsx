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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos de notificação disponíveis para teste
const NOTIFICATION_TYPES = [
  { id: "team_added", name: "Adicionado à Equipe", 
    fields: ["teamId", "teamName", "projectId", "projectName"] },
  { id: "team_removed", name: "Removido da Equipe", 
    fields: ["teamId", "teamName", "projectId", "projectName"] },
  { id: "invite", name: "Convite de Projeto", 
    fields: ["inviteId", "projectId", "projectName"] },
  { id: "mention", name: "Menção em Comentário", 
    fields: ["sourceId", "sourceName", "sourceType", "comment"] },
  { id: "system", name: "Notificação do Sistema", 
    fields: ["message", "severity", "action", "actionLink"] },
];

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
  const [notificationType, setNotificationType] = useState("team_added");
  const [notificationData, setNotificationData] = useState<Record<string, string>>({
    teamId: "test-team-id",
    teamName: "Equipe de Teste",
    projectId: "test-project-id",
    projectName: "Projeto de Teste",
  });

  // Obter os campos para o tipo de notificação selecionado
  const getFieldsForType = (type: string) => {
    const found = NOTIFICATION_TYPES.find(t => t.id === type);
    return found ? found.fields : [];
  };

  // Atualizar os campos quando o tipo de notificação muda
  useEffect(() => {
    const defaultValues: Record<string, string> = {};
    
    // Valores padrão para cada tipo
    switch (notificationType) {
      case "team_added":
      case "team_removed":
        defaultValues.teamId = "test-team-id";
        defaultValues.teamName = "Equipe de Teste";
        defaultValues.projectId = "test-project-id";
        defaultValues.projectName = "Projeto de Teste";
        break;
      case "invite":
        defaultValues.inviteId = "test-invite-id";
        defaultValues.projectId = "test-project-id";
        defaultValues.projectName = "Projeto de Teste";
        break;
      case "mention":
        defaultValues.sourceId = "test-comment-id";
        defaultValues.sourceName = "Documento de Requisitos";
        defaultValues.sourceType = "document";
        defaultValues.comment = "Olha @user, precisamos revisar isto!";
        break;
      case "system":
        defaultValues.message = "Atualização do sistema concluída";
        defaultValues.severity = "info";
        defaultValues.action = "Ver detalhes";
        defaultValues.actionLink = "/changelog";
        break;
    }
    
    setNotificationData(defaultValues);
  }, [notificationType]);

  // Função para atualizar o valor de um campo
  const handleFieldChange = (field: string, value: string) => {
    setNotificationData(prev => ({ ...prev, [field]: value }));
  };

  // Função para enviar uma notificação de teste
  const sendTestNotification = async () => {
    try {
      // Verificar se o usuário está autenticado
      if (!session?.user?.id) {
        setTestMessage("Usuário não autenticado");
        return;
      }
      
      // Preparar dados para a notificação
      const payload = {
        ...notificationData,
        userId: session.user.id,
      };
      
      // Definir o endpoint com base no tipo de notificação
      let endpoint = "/api/notifications/";
      switch (notificationType) {
        case "team_added":
          endpoint += "team-added";
          break;
        case "team_removed":
          endpoint += "team-removed";
          break;
        case "invite":
          endpoint += "invite";
          break;
        case "mention":
          endpoint += "mention";
          break;
        case "system":
          endpoint += "system";
          break;
        default:
          endpoint += "team-added";
      }

      // Exibir informações do usuário e sessão para debug
      console.log("ID do usuário na sessão:", session.user.id);
      console.log("Dados da notificação:", payload);
      console.log("Endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
        setTestMessage(`Notificação de ${notificationType} enviada com sucesso!`);
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
      <h1 className="text-3xl font-bold mb-6">Teste de Notificações</h1>

      <Tabs defaultValue="connection" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="create">Criar Notificação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection">
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
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
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
                          {notification.type === "invite" &&
                            "Convite para projeto"}
                          {notification.type === "mention" &&
                            "Mencionado em comentário"}
                          {notification.type === "system" &&
                            "Mensagem do sistema"}
                          {!["team_added", "team_removed", "invite", "mention", "system"].includes(
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
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                disabled={!isConnected || notifications.length === 0}
                className="mt-4 w-full"
              >
                Marcar Todas Como Lidas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Notificação de Teste</CardTitle>
              <CardDescription>
                Configure e envie notificações de teste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationType">Tipo de Notificação</Label>
                  <Select 
                    value={notificationType} 
                    onValueChange={setNotificationType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-medium">Dados da Notificação</h3>
                  {getFieldsForType(notificationType).map(field => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field}</Label>
                      {field === "message" || field === "comment" ? (
                        <Textarea
                          id={field}
                          value={notificationData[field] || ""}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          placeholder={`Digite o ${field}`}
                        />
                      ) : field === "severity" ? (
                        <Select 
                          value={notificationData[field] || "info"} 
                          onValueChange={(value) => handleFieldChange(field, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a severidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Informação</SelectItem>
                            <SelectItem value="warning">Aviso</SelectItem>
                            <SelectItem value="error">Erro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field}
                          value={notificationData[field] || ""}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          placeholder={`Digite o ${field}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={sendTestNotification}
                disabled={!isConnected || !session?.user?.id}
                className="w-full"
              >
                Enviar Notificação de Teste
              </Button>
              
              {testMessage && (
                <div className={`text-sm font-medium w-full p-2 rounded ${
                  testMessage.includes("sucesso") ? "bg-green-100 text-green-800" : 
                  testMessage.includes("Erro") ? "bg-red-100 text-red-800" : 
                  "bg-blue-100 text-blue-800"
                }`}>
                  {testMessage}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
