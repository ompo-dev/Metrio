import { z } from "zod";

// Enums para tipos de notificações
export enum NotificationType {
  TEAM_ADDED = "TEAM_ADDED",
  TEAM_REMOVED = "TEAM_REMOVED",
  INVITE = "INVITE",
  MENTION = "MENTION",
  SYSTEM = "SYSTEM",
}

// Interface base para notificações
export interface BaseNotification {
  id: string;
  type: NotificationType | string;
  read: boolean;
  createdAt: Date;
  userId: string;
}

// Interface para notificação de equipe
export interface TeamNotification extends BaseNotification {
  type: NotificationType.TEAM_ADDED | NotificationType.TEAM_REMOVED;
  content: {
    teamId: string;
    teamName: string;
    projectId: string;
    projectName: string;
    senderName: string;
    senderInitials: string;
  };
}

// Interface para notificação de convite
export interface InviteNotification extends BaseNotification {
  type: NotificationType.INVITE;
  content: {
    inviteId: string;
    projectId: string;
    projectName: string;
    senderName: string;
    senderInitials: string;
  };
}

// Interface para notificação de menção
export interface MentionNotification extends BaseNotification {
  type: NotificationType.MENTION;
  content: {
    sourceId: string;
    sourceName: string;
    sourceType: string;
    senderName: string;
    senderInitials: string;
  };
}

// Interface para notificação do sistema
export interface SystemNotification extends BaseNotification {
  type: NotificationType.SYSTEM;
  content: {
    message: string;
    severity: "info" | "warning" | "error";
    action?: string;
    actionLink?: string;
  };
}

// Tipo união para todas as notificações
export type Notification =
  | TeamNotification
  | InviteNotification
  | MentionNotification
  | SystemNotification;

// Tipo para notificação formatada para o cliente
export interface FormattedNotification {
  id: string;
  type: string;
  timestamp: string;
  unread: boolean;
  [key: string]: any; // Campos adicionais específicos por tipo
}

// Schemas Zod para validação

// Schema base para conteúdo de notificação
const baseContentSchema = z.object({
  senderName: z.string().optional().default("Um usuário"),
  senderInitials: z.string().optional(),
});

// Schema para notificação de equipe adicionada
export const teamAddedSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuário inválido" }),
  teamId: z.string().min(1, { message: "ID da equipe é obrigatório" }),
  teamName: z.string().min(1, { message: "Nome da equipe é obrigatório" }),
  projectId: z.string().min(1, { message: "ID do projeto é obrigatório" }),
  projectName: z.string().optional().default("Projeto"),
});

// Schema para notificação de equipe removida
export const teamRemovedSchema = teamAddedSchema;

// Schema para notificação de convite
export const inviteSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuário inválido" }),
  inviteId: z.string().min(1, { message: "ID do convite é obrigatório" }),
  projectId: z.string().min(1, { message: "ID do projeto é obrigatório" }),
  projectName: z.string().optional().default("Projeto"),
});

// Schema para notificação de sistema
export const systemSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuário inválido" }),
  message: z.string().min(1, { message: "Mensagem é obrigatória" }),
  severity: z.enum(["info", "warning", "error"]).default("info"),
  action: z.string().optional(),
  actionLink: z.string().optional(),
});
