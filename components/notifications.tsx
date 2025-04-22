"use client";

import { useState } from "react";
import { Bell, BellIcon, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialNotifications = [
  {
    id: 1,
    image: "",
    initials: "CT",
    user: "Chris Tompson",
    action: "solicitou revisão em",
    target: "PR #42: Implementação de funcionalidade",
    timestamp: "15 minutos atrás",
    unread: true,
  },
  {
    id: 2,
    image: "",
    initials: "ED",
    user: "Emma Davis",
    action: "compartilhou",
    target: "Nova biblioteca de componentes",
    timestamp: "45 minutos atrás",
    unread: true,
  },
  {
    id: 3,
    image: "",
    initials: "JW",
    user: "James Wilson",
    action: "atribuiu você a",
    target: "Tarefa de integração de API",
    timestamp: "4 horas atrás",
    unread: false,
  },
  {
    id: 4,
    image: "",
    initials: "AM",
    user: "Alex Morgan",
    action: "respondeu seu comentário em",
    target: "Fluxo de autenticação",
    timestamp: "12 horas atrás",
    unread: false,
  },
  {
    id: 5,
    image: "",
    initials: "SC",
    user: "Sarah Chen",
    action: "comentou em",
    target: "Redesign do Dashboard",
    timestamp: "2 dias atrás",
    unread: false,
  },
  {
    id: 6,
    image: "",
    initials: "MD",
    user: "Miky Derya",
    action: "mencionou você em",
    target: "Imagem Open Graph da UI Origin",
    timestamp: "2 semanas atrás",
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export function Notifications({ children }: { children?: React.ReactNode }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        // Previne o fechamento ao passar o mouse, só fecha com clique explícito
        if (!isOpen) {
          setOpen(false);
        }
      }}
    >
      <PopoverTrigger asChild onClick={handleToggle}>
        {children || (
          <div className="relative flex items-center">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
            <span className="ml-2">Notificações</span>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-1"
        side="bottom"
        align="end"
        hideWhenDetached={false}
        onInteractOutside={(e) => {
          // Previne fechamento ao interagir fora
          e.preventDefault();
        }}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <div className="text-sm font-semibold">Notificações</div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                className="text-xs font-medium hover:underline"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como lidas
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
              >
                <div className="relative flex items-start gap-3 pe-3">
                  <Avatar className="h-9 w-9 rounded-md">
                    <AvatarImage
                      src={notification.image}
                      alt={notification.user}
                    />
                    <AvatarFallback className="rounded-md">
                      {notification.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <button
                      className="text-foreground/80 text-left after:absolute after:inset-0"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <span className="text-foreground font-medium hover:underline">
                        {notification.user}
                      </span>{" "}
                      {notification.action}{" "}
                      <span className="text-foreground font-medium hover:underline">
                        {notification.target}
                      </span>
                      .
                    </button>
                    <div className="text-muted-foreground text-xs">
                      {notification.timestamp}
                    </div>
                  </div>
                  {notification.unread && (
                    <div className="absolute end-0 self-center">
                      <Dot />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Sem notificações no momento
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
