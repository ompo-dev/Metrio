"use client";

import { useState } from "react";
import {
  Bell,
  BellIcon,
  Radio as RadioIcon,
  RefreshCw as RefreshCwIcon,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Tipos de notificações
type NotificationType = "mention" | "event" | "update" | "default";

interface BaseNotification {
  id: number;
  timestamp: string;
  unread: boolean;
  type: NotificationType;
}

interface MentionNotification extends BaseNotification {
  type: "mention";
  image: string;
  initials: string;
  user: string;
  action: string;
  target: string;
  needsAction?: boolean;
}

interface EventNotification extends BaseNotification {
  type: "event";
  title: string;
  scheduledTime: string;
  eventDate: string;
}

interface UpdateNotification extends BaseNotification {
  type: "update";
  title: string;
  description: string;
}

interface DefaultNotification extends BaseNotification {
  type: "default";
  image: string;
  initials: string;
  user: string;
  action: string;
  target: string;
}

type Notification =
  | MentionNotification
  | EventNotification
  | UpdateNotification
  | DefaultNotification;

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "mention",
    image: "",
    initials: "MP",
    user: "Mary Palmer",
    action: "mencionou você em",
    target: "project-campaign-02",
    timestamp: "2 minutos atrás",
    unread: true,
    needsAction: true,
  },
  {
    id: 2,
    type: "event",
    title: "Ao vivo em 27 horas",
    scheduledTime: "20 de Novembro às 20:00",
    eventDate: "Nov 20",
    timestamp: "5 minutos atrás",
    unread: true,
  },
  {
    id: 3,
    type: "update",
    title: "Versão 1.4 já está disponível!",
    description:
      "Esta atualização contém várias correções de bugs e melhorias de desempenho.",
    timestamp: "30 minutos atrás",
    unread: true,
  },
  {
    id: 4,
    type: "default",
    image: "",
    initials: "ED",
    user: "Emma Davis",
    action: "compartilhou",
    target: "Nova biblioteca de componentes",
    timestamp: "45 minutos atrás",
    unread: true,
  },
  {
    id: 5,
    type: "default",
    image: "",
    initials: "JW",
    user: "James Wilson",
    action: "atribuiu você a",
    target: "Tarefa de integração de API",
    timestamp: "4 horas atrás",
    unread: false,
  },
  {
    id: 6,
    type: "default",
    image: "",
    initials: "AM",
    user: "Alex Morgan",
    action: "respondeu seu comentário em",
    target: "Fluxo de autenticação",
    timestamp: "12 horas atrás",
    unread: false,
  },
  {
    id: 7,
    type: "default",
    image: "",
    initials: "SC",
    user: "Sarah Chen",
    action: "comentou em",
    target: "Redesign do Dashboard",
    timestamp: "2 dias atrás",
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
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
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

  const handleDismissNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleAcceptInvite = (id: number) => {
    handleNotificationClick(id);
    // Lógica para aceitar o convite iria aqui
    console.log(`Convite ${id} aceito`);
  };

  const handleDeclineInvite = (id: number) => {
    handleDismissNotification(id);
    // Lógica para recusar o convite iria aqui
    console.log(`Convite ${id} recusado`);
  };

  const handleNotifyMe = (id: number) => {
    handleNotificationClick(id);
    // Lógica para ativar notificação do evento
    console.log(`Notificação ativada para o evento ${id}`);
  };

  const handleInstallUpdate = (id: number) => {
    handleNotificationClick(id);
    // Lógica para instalar a atualização
    console.log(`Instalando atualização ${id}`);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNotificationItem = (notification: Notification) => {
    const hasUnread = notification.unread;

    switch (notification.type) {
      case "mention":
        return (
          <div className="relative flex items-start gap-3 pe-3">
            <Avatar className="h-9 w-9 rounded-full">
              <AvatarImage src={notification.image} alt={notification.user} />
              <AvatarFallback>{notification.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="text-foreground/80">
                <span className="text-foreground font-medium hover:underline">
                  {notification.user}
                </span>{" "}
                {notification.action}{" "}
                <span className="text-foreground font-medium hover:underline">
                  {notification.target}
                </span>
                .
              </div>
              <div className="text-muted-foreground text-xs">
                {notification.timestamp}
              </div>
              {notification.needsAction && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvite(notification.id)}
                  >
                    Aceitar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineInvite(notification.id)}
                  >
                    Recusar
                  </Button>
                </div>
              )}
            </div>
            {hasUnread && (
              <div className="absolute end-0 self-center">
                <Dot />
              </div>
            )}
          </div>
        );

      case "event":
        return (
          <div className="relative flex items-center gap-3 pe-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <RadioIcon className="opacity-60" size={16} />
            </div>
            <div className="flex grow items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-muted-foreground text-xs">
                  {notification.scheduledTime}
                </p>
              </div>
              <Button size="sm" onClick={() => handleNotifyMe(notification.id)}>
                Notificar-me
              </Button>
            </div>
            {hasUnread && (
              <div className="absolute end-0 self-center">
                <Dot />
              </div>
            )}
          </div>
        );

      case "update":
        return (
          <div className="relative flex gap-3 pe-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <RefreshCwIcon className="opacity-60" size={16} />
            </div>
            <div className="flex grow flex-col gap-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-muted-foreground text-sm">
                  {notification.description}
                </p>
                <p className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleInstallUpdate(notification.id)}
                >
                  Instalar
                </Button>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => handleDismissNotification(notification.id)}
                >
                  Depois
                </Button>
              </div>
            </div>
            {hasUnread && (
              <div className="absolute end-0 self-center">
                <Dot />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="relative flex items-start gap-3 pe-3">
            <Avatar className="h-9 w-9 rounded-md">
              <AvatarImage src={notification.image} alt={notification.user} />
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
            {hasUnread && (
              <div className="absolute end-0 self-center">
                <Dot />
              </div>
            )}
          </div>
        );
    }
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
        className="w-[300px] md:w-[400px] p-1"
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
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="hover:bg-accent group rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  {renderNotificationItem(notification)}
                </div>
              ))}
            </div>
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
