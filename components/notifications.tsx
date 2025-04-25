"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BellIcon,
  Radio as RadioIcon,
  RefreshCw as RefreshCwIcon,
  X,
  UserPlus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSocketContext } from "@/lib/providers/SocketProvider";
import {
  FormattedNotification,
  NotificationType as ApiNotificationType,
} from "@/types/notifications";

// Tipos de notificações
type NotificationType =
  | "mention"
  | "event"
  | "update"
  | "default"
  | "invite"
  | "team_added"
  | "team_removed"
  | "invite_accepted"
  | "member_added"
  | "project_member_updated"
  | "invite_status_changed"
  | "invite_rejected"
  | "invite_expired";

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

interface InviteNotification extends BaseNotification {
  type: "invite";
  inviteId: string;
  projectName: string;
  senderName: string;
  projectId: string;
}

interface TeamAddedNotification extends BaseNotification {
  type: "team_added";
  teamId: string;
  teamName: string;
  projectName: string;
  senderName: string;
  projectId: string;
}

interface TeamRemovedNotification extends BaseNotification {
  type: "team_removed";
  teamId: string;
  teamName: string;
  projectName: string;
  senderName: string;
  projectId: string;
}

type Notification =
  | MentionNotification
  | EventNotification
  | UpdateNotification
  | DefaultNotification
  | InviteNotification
  | TeamAddedNotification
  | TeamRemovedNotification;

// const initialNotifications: Notification[] = [
//   {
//     id: 1,
//     type: "mention",
//     image: "",
//     initials: "MP",
//     user: "Mary Palmer",
//     action: "mencionou você em",
//     target: "project-campaign-02",
//     timestamp: "2 minutos atrás",
//     unread: true,
//     needsAction: true,
//   },
//   {
//     id: 2,
//     type: "event",
//     title: "Ao vivo em 27 horas",
//     scheduledTime: "20 de Novembro às 20:00",
//     eventDate: "Nov 20",
//     timestamp: "5 minutos atrás",
//     unread: true,
//   },
//   {
//     id: 3,
//     type: "update",
//     title: "Versão 1.4 já está disponível!",
//     description:
//       "Esta atualização contém várias correções de bugs e melhorias de desempenho.",
//     timestamp: "30 minutos atrás",
//     unread: true,
//   },
//   {
//     id: 4,
//     type: "default",
//     image: "",
//     initials: "ED",
//     user: "Emma Davis",
//     action: "compartilhou",
//     target: "Nova biblioteca de componentes",
//     timestamp: "45 minutos atrás",
//     unread: true,
//   },
//   {
//     id: 5,
//     type: "default",
//     image: "",
//     initials: "JW",
//     user: "James Wilson",
//     action: "atribuiu você a",
//     target: "Tarefa de integração de API",
//     timestamp: "4 horas atrás",
//     unread: false,
//   },
//   {
//     id: 6,
//     type: "default",
//     image: "",
//     initials: "AM",
//     user: "Alex Morgan",
//     action: "respondeu seu comentário em",
//     target: "Fluxo de autenticação",
//     timestamp: "12 horas atrás",
//     unread: false,
//   },
//   {
//     id: 7,
//     type: "default",
//     image: "",
//     initials: "SC",
//     user: "Sarah Chen",
//     action: "comentou em",
//     target: "Redesign do Dashboard",
//     timestamp: "2 dias atrás",
//     unread: false,
//   },
// ];

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { lastMessage } = useSocketContext();
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Função para buscar todas as notificações do usuário
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Buscar todas as notificações pendentes, incluindo convites e notificações de equipe
      const response = await fetch("/api/notifications");

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        console.error("Erro ao buscar notificações:", await response.json());
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar notificações quando o componente montar ou quando o popover abrir
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // Adicionar novas notificações recebidas via WebSocket
  useEffect(() => {
    if (lastMessage) {
      // Convertemos a notificação formatada para o formato interno
      const formattedToInternalNotification = (
        formatted: FormattedNotification
      ): Notification => {
        // Formato padrão para todos os tipos
        const baseNotification: BaseNotification = {
          id:
            typeof formatted.id === "string"
              ? parseInt(formatted.id)
              : formatted.id,
          timestamp: formatted.timestamp || new Date().toLocaleDateString(),
          unread: formatted.unread ?? true,
          type: formatted.type as NotificationType,
        };

        // Converter com base no tipo
        switch (formatted.type) {
          case "invite":
            return {
              ...baseNotification,
              type: "invite",
              inviteId: formatted.content?.inviteId || "",
              projectName: formatted.content?.projectName || "Projeto",
              senderName: formatted.content?.senderName || "Usuário",
              projectId: formatted.content?.projectId || "",
            } as InviteNotification;
          case "team_added":
            return {
              ...baseNotification,
              type: "team_added",
              teamId: formatted.content?.teamId || "",
              teamName: formatted.content?.teamName || "",
              projectName: formatted.content?.projectName || "",
              senderName: formatted.content?.senderName || "",
              projectId: formatted.content?.projectId || "",
            } as TeamAddedNotification;
          case "invite_accepted":
          case "member_added":
          case "project_member_updated":
            // Tratar como notificação padrão
            return {
              ...baseNotification,
              type: "default",
              image: "",
              initials:
                formatted.content?.recipientName
                  ?.substring(0, 2)
                  ?.toUpperCase() || "US",
              user: formatted.content?.recipientName || "Usuário",
              action: "aceitou o convite para",
              target: formatted.content?.projectName || "projeto",
            } as DefaultNotification;
          default:
            // Para outros tipos, criar uma notificação genérica
            return {
              ...baseNotification,
              type: "default",
              image: "",
              initials: "SYS",
              user: "Sistema",
              action: "enviou uma",
              target: "notificação",
            } as DefaultNotification;
        }
      };

      // Verificar se a notificação já existe para evitar duplicatas
      const convertedNotification =
        formattedToInternalNotification(lastMessage);
      const exists = notifications.some(
        (n) => n.id === convertedNotification.id
      );

      if (!exists) {
        setNotifications((prev) => [convertedNotification, ...prev]);
      }
    }
  }, [lastMessage, notifications]);

  const handleMarkAllAsRead = async () => {
    try {
      // Marcar todas as notificações como lidas no servidor
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markAllAsRead: true,
        }),
      });

      // Atualizar estado local
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          unread: false,
        }))
      );
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };

  const handleNotificationClick = async (id: number) => {
    try {
      // Marcar a notificação como lida no servidor
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: id.toString(),
        }),
      });

      // Atualizar estado local
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, unread: false }
            : notification
        )
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const handleDismissNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleAcceptInvite = async (notification: Notification) => {
    // Verificar se é uma notificação de convite
    if (notification.type !== "invite") return;

    try {
      const inviteNotification = notification as InviteNotification;
      const response = await fetch(
        `/api/invites/${inviteNotification.inviteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "accept",
          }),
        }
      );

      if (response.ok) {
        // Remover a notificação da lista
        setNotifications(notifications.filter((n) => n.id !== notification.id));

        // Feedback para o usuário
        const data = await response.json();
        console.log(data.message);

        // Recarregar a página para mostrar o novo projeto
        window.location.reload();
      } else {
        console.error("Erro ao aceitar convite:", await response.json());
      }
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
    }
  };

  const handleDeclineInvite = async (notification: Notification) => {
    // Verificar se é uma notificação de convite
    if (notification.type !== "invite") return;

    try {
      const inviteNotification = notification as InviteNotification;
      const response = await fetch(
        `/api/invites/${inviteNotification.inviteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
          }),
        }
      );

      if (response.ok) {
        // Remover a notificação da lista
        setNotifications(notifications.filter((n) => n.id !== notification.id));

        // Feedback para o usuário
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error("Erro ao recusar convite:", await response.json());
      }
    } catch (error) {
      console.error("Erro ao recusar convite:", error);
    }
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
    const newState = !open;
    setOpen(newState);
    // Se estiver abrindo o popover, buscar os convites
    if (newState) {
      fetchNotifications();
    }
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
                    onClick={() => handleAcceptInvite(notification)}
                  >
                    Aceitar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineInvite(notification)}
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

      case "invite":
        return (
          <div className="relative flex items-start gap-3 pe-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <UserPlus className="opacity-60" size={16} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-foreground/80">
                <span className="text-foreground font-medium hover:underline">
                  {notification.senderName}
                </span>{" "}
                convidou você para fazer parte do projeto{" "}
                <span className="text-foreground font-medium hover:underline">
                  {notification.projectName}
                </span>
                .
              </div>
              <div className="text-muted-foreground text-xs">
                {notification.timestamp}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => handleAcceptInvite(notification)}
                >
                  Aceitar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeclineInvite(notification)}
                >
                  Recusar
                </Button>
              </div>
            </div>
            {hasUnread && (
              <div className="absolute end-0 self-center animate-pulse">
                <Dot />
              </div>
            )}
          </div>
        );

      case "team_added":
        return (
          <div className="relative flex items-start gap-3 pe-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Users className="opacity-60" size={16} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-foreground/80">
                <span className="text-foreground font-medium hover:underline">
                  {notification.senderName}
                </span>{" "}
                adicionou você à equipe{" "}
                <span className="text-foreground font-medium hover:underline">
                  {notification.teamName}
                </span>{" "}
                no projeto{" "}
                <span className="text-foreground font-medium hover:underline">
                  {notification.projectName}
                </span>
                .
              </div>
              <div className="text-muted-foreground text-xs">
                {notification.timestamp}
              </div>
            </div>
            {hasUnread && (
              <div className="absolute end-0 self-center animate-pulse">
                <Dot />
              </div>
            )}
          </div>
        );

      case "team_removed":
        return (
          <div className="relative flex items-start gap-3 pe-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Users className="opacity-60" size={16} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-foreground/80">
                <span className="text-foreground font-medium hover:underline">
                  {notification.senderName}
                </span>{" "}
                removeu você da equipe{" "}
                <span className="text-foreground font-medium hover:underline">
                  {notification.teamName}
                </span>{" "}
                no projeto{" "}
                <span className="text-foreground font-medium hover:underline">
                  {notification.projectName}
                </span>
                .
              </div>
              <div className="text-muted-foreground text-xs">
                {notification.timestamp}
              </div>
            </div>
            {hasUnread && (
              <div className="absolute end-0 self-center animate-pulse">
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
              <Badge className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] animate-pulse">
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
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Carregando notificações...
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`hover:bg-accent group rounded-md px-3 py-2 text-sm transition-colors ${
                    notification.unread ? "bg-muted/40" : ""
                  }`}
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
