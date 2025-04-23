import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

export const useSocket = () => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const connectSocket = useCallback(() => {
    if (!session?.user?.id) return;

    // Criar uma nova conexão socket
    const socketInstance = io({
      path: "/api/socketio",
      query: {
        userId: session.user.id,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Configurar eventos do socket
    socketInstance.on("connect", () => {
      console.log("Socket conectado ao servidor");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket desconectado do servidor");
      setIsConnected(false);
    });

    socketInstance.on("connected", (data) => {
      console.log("Conexão confirmada pelo servidor:", data);
    });

    socketInstance.on("notification", (data) => {
      console.log("Nova notificação recebida:", data);
      setLastMessage(data);
      setNotifications((prev) => [data, ...prev]);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Erro de conexão:", err);
    });

    // Armazenar a instância do socket
    setSocket(socketInstance);

    // Cleanup na desmontagem
    return () => {
      console.log("Desconectando socket...");
      socketInstance.disconnect();
    };
  }, [session?.user?.id]);

  // Conectar o socket quando o componente for montado e o usuário estiver autenticado
  useEffect(() => {
    if (session?.user?.id && !socket) {
      const disconnect = connectSocket();
      return () => {
        if (disconnect) disconnect();
      };
    }
  }, [session?.user?.id, socket, connectSocket]);

  // Reconectar em caso de erro
  useEffect(() => {
    if (!isConnected && socket) {
      const timeout = setTimeout(() => {
        console.log("Tentando reconexão...");
        socket.connect();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, socket]);

  // Limpar notificações
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    notifications,
    clearNotifications,
  };
};
