import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationToUser } from "@/lib/socketio";

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

// Função para criar uma notificação e enviar via WebSocket
export async function createAndSendNotification(
  userId: string,
  type: string,
  content: any
) {
  try {
    // Criar a notificação no banco de dados
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        content,
        read: false,
      },
    });

    // Formatar a notificação para o cliente
    let formattedNotification: any = {
      id: notification.id,
      timestamp: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: true,
    };

    // Definir os campos específicos do tipo
    if (type === "TEAM_ADDED") {
      formattedNotification = {
        ...formattedNotification,
        type: "team_added",
        teamId: content.teamId || "",
        teamName: content.teamName || "Equipe",
        projectName: content.projectName || "Projeto",
        senderName: content.senderName || "Um usuário",
        projectId: content.projectId || "",
      };
    } else if (type === "TEAM_REMOVED") {
      formattedNotification = {
        ...formattedNotification,
        type: "team_removed",
        teamId: content.teamId || "",
        teamName: content.teamName || "Equipe",
        projectName: content.projectName || "Projeto",
        senderName: content.senderName || "Um usuário",
        projectId: content.projectId || "",
      };
    } else {
      formattedNotification = {
        ...formattedNotification,
        type: "default",
        image: "",
        initials: content.senderInitials || "NU",
        user: content.senderName || "Um usuário",
        action: content.action || "enviou uma notificação",
        target: content.target || "",
      };
    }

    // Enviar notificação via WebSocket
    sendNotificationToUser(userId, formattedNotification);

    return { success: true, notification: formattedNotification };
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    return { success: false, error };
  }
}
