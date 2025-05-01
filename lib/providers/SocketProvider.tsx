"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { Socket } from "socket.io-client";
import { FormattedNotification } from "@/types/notifications";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastMessage: FormattedNotification | null;
  notifications: FormattedNotification[];
  clearNotifications: () => void;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketData = useSocket();

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext deve ser usado dentro de um SocketProvider"
    );
  }
  return context;
};
