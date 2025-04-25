# Sistema de Notificações em Tempo Real

Este documento descreve o sistema de notificações em tempo real implementado na plataforma Metrio.

## Visão Geral

O sistema permite enviar e receber notificações em tempo real, com persistência no banco de dados e sincronização entre múltiplas instâncias de servidor. As principais características incluem:

- Comunicação em tempo real via WebSockets usando Socket.IO
- Persistência em banco de dados PostgreSQL
- Sincronização entre instâncias usando PostgreSQL LISTEN/NOTIFY
- Validação de dados com Zod em ambos cliente e servidor
- Tipagem completa com TypeScript
- Suporte a múltiplos tipos de notificações

## Arquitetura

O sistema é composto pelos seguintes componentes principais:

1. **Modelo de Dados**: Entidade `Notification` no Prisma Schema
2. **Backend**: API REST e serviço WebSocket
3. **Frontend**: Hooks React e Context Provider
4. **PubSub**: Mecanismo de sincronização entre instâncias

### Fluxo de Dados

1. Um evento ocorre no servidor (ex: usuário adicionado a uma equipe)
2. Uma notificação é criada e persistida no banco de dados
3. A notificação é enviada via WebSocket para o usuário conectado
4. O evento NOTIFY do PostgreSQL sincroniza a notificação com outras instâncias do servidor
5. Se o usuário estiver offline, as notificações não lidas são recuperadas quando ele se conectar

## Componentes

### Modelo de Dados

```prisma
model Notification {
  id          String    @id @default(cuid())
  type        String    // Tipo de notificação: TEAM_ADDED, TEAM_REMOVED, etc.
  content     Json      // Conteúdo da notificação em formato JSON
  read        Boolean   @default(false)
  createdAt   DateTime  @default(now())

  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### TypeScript e Zod

Definimos tipos e schemas para garantir a consistência dos dados:

```typescript
// Enums para tipos de notificações
export enum NotificationType {
  TEAM_ADDED = "TEAM_ADDED",
  TEAM_REMOVED = "TEAM_REMOVED",
  INVITE = "INVITE",
  MENTION = "MENTION",
  SYSTEM = "SYSTEM",
}

// Schema para validação
export const teamAddedSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuário inválido" }),
  teamId: z.string().min(1, { message: "ID da equipe é obrigatório" }),
  teamName: z.string().min(1, { message: "Nome da equipe é obrigatório" }),
  projectId: z.string().min(1, { message: "ID do projeto é obrigatório" }),
  projectName: z.string().optional().default("Projeto"),
});
```

### WebSockets (Socket.IO)

O sistema utiliza Socket.IO para comunicação em tempo real entre servidor e cliente.

Principais eventos:

- `connect`: Conexão estabelecida
- `connected`: Autenticação bem-sucedida
- `notification`: Nova notificação recebida
- `disconnect`: Desconexão do socket

### PubSub com PostgreSQL

Para sincronização entre múltiplas instâncias do servidor, utilizamos o mecanismo LISTEN/NOTIFY do PostgreSQL:

```typescript
// Notificar outras instâncias via Postgres NOTIFY
await prisma.$queryRawUnsafe(
  `SELECT pg_notify('notifications_channel', $1)`,
  JSON.stringify({
    event: "new_notification",
    userId,
    notification: formattedNotification,
  })
);
```

Uma conexão dedicada escuta eventos no canal `notifications_channel` e propaga as notificações para os clientes conectados naquela instância.

## API REST

O sistema expõe os seguintes endpoints:

| Método | Endpoint                          | Descrição                              |
| ------ | --------------------------------- | -------------------------------------- |
| GET    | `/api/notifications`              | Listar notificações não lidas          |
| PATCH  | `/api/notifications`              | Marcar notificações como lidas         |
| POST   | `/api/notifications/team-added`   | Criar notificação de adição à equipe   |
| POST   | `/api/notifications/team-removed` | Criar notificação de remoção da equipe |

## Uso no Frontend

### Hook de Socket

```typescript
// Usando o hook useSocket
import { useSocketContext } from "@/lib/providers/SocketProvider";

function NotificationsComponent() {
  const { notifications, isConnected, markAsRead, markAllAsRead } =
    useSocketContext();

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={() => markAsRead(notification.id)}
        />
      ))}

      <button onClick={markAllAsRead}>Marcar todas como lidas</button>
    </div>
  );
}
```

## Enviando Notificações do Backend

```typescript
import { createAndSendNotification } from "@/app/api/notifications/route";

// Criar e enviar notificação
const result = await createAndSendNotification(userId, "TEAM_ADDED", {
  teamId: teamId,
  teamName: teamName,
  projectId: projectId,
  senderName: "Admin",
});
```

## Escalabilidade

O sistema foi projetado para escalar horizontalmente:

- **Sincronização entre instâncias**: PostgreSQL LISTEN/NOTIFY propaga eventos
- **Persistência**: Notificações são armazenadas antes de serem enviadas
- **Recuperação de falhas**: Reconexão automática de WebSockets e PubSub
- **Entrega garantida**: Notificações não lidas são recuperadas no login

### Recomendações para Produção

- Usar sticky sessions no balanceador de carga para WebSockets
- Implementar uma política de retenção para notificações antigas
- Monitorar o crescimento da tabela de notificações
- Considerar o uso de Redis para armazenamento de estado em clusters grandes

## Referências

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [PostgreSQL LISTEN/NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html)
- [Zod Documentation](https://zod.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
