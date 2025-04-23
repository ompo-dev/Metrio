import { Server as SocketIOServer } from "socket.io";

// Variáveis globais para armazenar o servidor Socket.IO
let socketIOInstance: SocketIOServer | null = null;

// Mapa de usuários conectados: userId -> socketId
export const connectedUsers = new Map<string, string[]>();

// Inicializa o servidor Socket.IO como um singleton
export const getSocketIOInstance = (httpServer?: any) => {
  if (socketIOInstance) {
    return socketIOInstance;
  }

  if (!httpServer) {
    throw new Error("HTTP Server é necessário para inicializar o Socket.IO");
  }

  // Inicializa o servidor Socket.IO
  socketIOInstance = new SocketIOServer(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Configura o evento de conexão
  socketIOInstance.on("connection", async (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    // Autenticar usuário
    const userId = socket.handshake.query.userId as string;
    if (!userId) {
      console.log("Usuário não autenticado, desconectando...");
      socket.disconnect();
      return;
    }

    // Registrar socket na lista de usuários conectados
    if (connectedUsers.has(userId)) {
      connectedUsers.get(userId)?.push(socket.id);
    } else {
      connectedUsers.set(userId, [socket.id]);
    }

    // Enviar confirmação de conexão ao cliente
    socket.emit("connected", { success: true, userId });

    console.log("Usuário conectado:", userId);
    console.log("Usuários conectados:", connectedUsers.size);

    // Evento de desconexão
    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);

      // Remover socket da lista de usuários conectados
      if (connectedUsers.has(userId)) {
        const userSockets = connectedUsers.get(userId) || [];
        const updatedSockets = userSockets.filter((id) => id !== socket.id);

        if (updatedSockets.length === 0) {
          connectedUsers.delete(userId);
        } else {
          connectedUsers.set(userId, updatedSockets);
        }
      }

      console.log("Usuários conectados após desconexão:", connectedUsers.size);
    });
  });

  console.log("Socket.IO inicializado com sucesso");

  return socketIOInstance;
};

// Função para enviar notificação para um usuário específico
export const sendNotificationToUser = (userId: string, notification: any) => {
  if (!socketIOInstance) {
    console.log("Socket.IO não está inicializado");
    return false;
  }

  // Busca os sockets do usuário
  const userSockets = connectedUsers.get(userId);
  if (!userSockets || userSockets.length === 0) {
    console.log(`Usuário ${userId} não está conectado`);
    return false;
  }

  // Envia a notificação para todos os sockets do usuário
  for (const socketId of userSockets) {
    socketIOInstance.to(socketId).emit("notification", notification);
    console.log(`Notificação enviada para ${userId} (socket: ${socketId})`);
  }

  return true;
};
