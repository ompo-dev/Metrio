import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAndPublishNotification } from "@/lib/socketio";
import {
  Notification,
  FormattedNotification,
  NotificationType,
} from "@/types/notifications";
import { z } from "zod";

export async function GET() {
  try {
    // Verificar a sessão do usuário
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Buscar convites pendentes
    const invites = await prisma.invite.findMany({
      where: {
        recipientId: userId,
        status: "pending",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Buscar notificações de equipe
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transformar os convites no formato de notificações
    const inviteNotifications = invites.map((invite, index) => ({
      id: Number(`100${index}`), // IDs únicos começando com 100
      type: "invite",
      inviteId: invite.id,
      projectName: invite.project.name,
      senderName: invite.sender.name || "Um usuário",
      projectId: invite.project.id,
      timestamp: new Date(invite.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: true,
    }));

    // Transformar as notificações de equipe
    const formattedNotifications = notifications.map((notification) => {
      const content = notification.content as any;

      // Detectar o tipo com base nos dados
      if (notification.type === "TEAM_ADDED") {
        return {
          id: notification.id,
          type: "team_added",
          teamId: content.teamId || "",
          teamName: content.teamName || "Equipe",
          projectName: content.projectName || "Projeto",
          senderName: content.senderName || "Um usuário",
          projectId: content.projectId || "",
          timestamp: new Date(notification.createdAt).toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          unread: !notification.read,
        };
      }

      // Suporte para notificações de remoção de equipe
      if (notification.type === "TEAM_REMOVED") {
        return {
          id: notification.id,
          type: "team_removed",
          teamId: content.teamId || "",
          teamName: content.teamName || "Equipe",
          projectName: content.projectName || "Projeto",
          senderName: content.senderName || "Um usuário",
          projectId: content.projectId || "",
          timestamp: new Date(notification.createdAt).toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          unread: !notification.read,
        };
      }

      // Por padrão, retorna uma notificação genérica
      return {
        id: notification.id,
        type: "default",
        image: "",
        initials: content.senderInitials || "NU",
        user: content.senderName || "Um usuário",
        action: content.action || "enviou uma notificação",
        target: content.target || "",
        timestamp: new Date(notification.createdAt).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        unread: !notification.read,
      };
    });

    // Combinar todas as notificações
    const allNotifications = [
      ...inviteNotifications,
      ...formattedNotifications,
    ];

    return NextResponse.json({
      notifications: allNotifications,
    });
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notificações" },
      { status: 500 }
    );
  }
}

// Rota para marcar notificação como lida
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const data = await request.json();
    const { notificationId, markAllAsRead } = data;

    if (markAllAsRead) {
      // Marcar todas as notificações do usuário como lidas
      await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Todas as notificações foram marcadas como lidas",
      });
    } else if (notificationId) {
      // Marcar uma notificação específica como lida
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Notificação marcada como lida",
      });
    } else {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar notificação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar notificação" },
      { status: 500 }
    );
  }
}

// Interface para resposta da criação de notificação
interface CreateNotificationResponse {
  success: boolean;
  notification?: FormattedNotification;
  error?: string;
}

// Função para criar uma notificação e enviar via WebSocket
export async function createAndSendNotification(
  userId: string,
  type: string,
  content: any
): Promise<CreateNotificationResponse> {
  try {
    // Validar o userId como UUID
    const userIdSchema = z.string().uuid({ message: "ID de usuário inválido" });
    const userIdResult = userIdSchema.safeParse(userId);

    if (!userIdResult.success) {
      console.error("ID de usuário inválido:", userIdResult.error);
      return {
        success: false,
        error: "ID de usuário inválido",
      };
    }

    // Validar o tipo da notificação
    const typeSchema = z.string().min(1, { message: "Tipo é obrigatório" });
    const typeResult = typeSchema.safeParse(type);

    if (!typeResult.success) {
      console.error("Tipo de notificação inválido:", typeResult.error);
      return {
        success: false,
        error: "Tipo de notificação inválido",
      };
    }

    // Validar o conteúdo
    if (!content || typeof content !== "object") {
      console.error("Conteúdo inválido:", content);
      return {
        success: false,
        error: "Conteúdo da notificação inválido",
      };
    }

    // Criar a notificação no banco de dados
    const notification = await prisma.notification.create({
      data: {
        type,
        content,
        userId,
      },
    });

    // Converter o formato da notificação para o formato da API
    const timestamp = new Date(notification.createdAt).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    // Formatar a notificação para envio
    const formattedNotification: FormattedNotification = {
      id: notification.id,
      type: type as NotificationType,
      content,
      timestamp,
      unread: true,
    };

    // Enviar via WebSocket e publicar via PubSub para todas as instâncias
    await sendAndPublishNotification(userId, formattedNotification);

    return {
      success: true,
      notification: formattedNotification,
    };
  } catch (error: any) {
    console.error("Erro ao criar e enviar notificação:", error);
    return {
      success: false,
      error: error.message || "Erro ao criar e enviar notificação",
    };
  }
}
