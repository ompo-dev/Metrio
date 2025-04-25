import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { FormattedNotification } from "@/types/notifications";

export const useSocket = () => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<FormattedNotification | null>(
    null
  );
  const [notifications, setNotifications] = useState<FormattedNotification[]>(
    []
  );

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

    socketInstance.on(
      "connected",
      (data: { success: boolean; userId: string }) => {
        console.log("Conexão confirmada pelo servidor:", data);
      }
    );

    socketInstance.on("notification", (data: FormattedNotification) => {
      console.log("Nova notificação recebida:", data);
      setLastMessage(data);
      setNotifications((prev) => [data, ...prev]);
    });

    socketInstance.on("connect_error", (err: Error) => {
      console.error("Erro de conexão:", err);
    });

    // Carregar notificações não lidas quando conectar
    const fetchUnreadNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          if (data.notifications && Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      }
    };

    // Buscar notificações não lidas ao conectar
    if (isConnected) {
      fetchUnreadNotifications();
    }

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

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        // Atualizar o estado local se a API for bem sucedida
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, unread: false }
              : notification
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      return false;
    }
  }, []);

  // Marcar todas as notificações como lidas
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (response.ok) {
        // Atualizar o estado local se a API for bem sucedida
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, unread: false }))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
      return false;
    }
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    notifications,
    clearNotifications,
    markAsRead,
    markAllAsRead,
  };
};
