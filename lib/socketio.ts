import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { FormattedNotification } from "@/types/notifications";
import { publishNotification } from "@/lib/pubsub";

// Acesso à instância global do Socket.IO definida no server.js
declare global {
  var socketIOInstance: SocketIOServer | null;
}

// Mapa de usuários conectados: userId -> socketId
export const connectedUsers = new Map<string, string[]>();

// Armazenamento de conexões de socket por usuário
let io: SocketIOServer | null = null;
const userSockets: Record<string, string[]> = {};

// Inicializa o servidor Socket.IO
export function initSocketIO(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/api/socketio",
  });

  io.on("connection", (socket) => {
    console.log("Nova conexão socket:", socket.id);

    // Autenticar e registrar usuário
    socket.on("authenticate", (userId: string) => {
      if (!userId) {
        socket.disconnect();
        return;
      }

      console.log(`Usuário ${userId} autenticado no socket ${socket.id}`);

      // Registrar o socket para este usuário
      if (!userSockets[userId]) {
        userSockets[userId] = [];
      }
      userSockets[userId].push(socket.id);

      // Remover socket quando o usuário desconectar
      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} desconectado`);
        if (userSockets[userId]) {
          userSockets[userId] = userSockets[userId].filter(
            (id) => id !== socket.id
          );
          if (userSockets[userId].length === 0) {
            delete userSockets[userId];
          }
        }
      });
    });
  });

  console.log("Servidor Socket.IO inicializado");
  return io;
}

// Função para enviar notificação para um usuário
export function sendNotificationToUser(
  userId: string,
  notification: FormattedNotification
): boolean {
  if (!io) {
    console.warn("Socket.IO não inicializado");
    return false;
  }

  const userSocketIds = userSockets[userId];
  if (!userSocketIds || userSocketIds.length === 0) {
    console.log(`Usuário ${userId} não está conectado`);
    return false;
  }

  // Enviar para todos os sockets do usuário
  userSocketIds.forEach((socketId) => {
    io!.to(socketId).emit("notification", notification);
  });

  console.log(`Notificação enviada para usuário ${userId}`);
  return true;
}

// Função para enviar e publicar notificação (combina WebSocket + PubSub)
export async function sendAndPublishNotification(
  userId: string,
  notification: FormattedNotification
) {
  try {
    // Publicar a notificação (isso também tentará enviá-la via WebSocket)
    return await publishNotification(userId, notification);
  } catch (error) {
    console.error("Erro ao enviar e publicar notificação:", error);
    return false;
  }
}

// Função para obter o servidor Socket.IO
export function getSocketIO() {
  return io;
}
