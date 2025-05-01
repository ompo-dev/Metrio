import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAndSendNotification } from "@/app/api/notifications/route";
import { z } from "zod";

// Schema para validação
const inviteAcceptedSchema = z.object({
  inviteId: z.string().min(1, { message: "ID do convite é obrigatório" }),
  projectId: z.string().min(1, { message: "ID do projeto é obrigatório" }),
});

/**
 * Endpoint para notificar quando um convite é aceito
 * Isso enviará uma notificação para o remetente do convite informando que o convite foi aceito
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado" },
        { status: 401 }
      );
    }

    // Obter dados do corpo da requisição
    const requestData = await request.json();

    // Validar dados com Zod
    const validationResult = inviteAcceptedSchema.safeParse(requestData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos para a notificação",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { inviteId, projectId } = validationResult.data;

    // Verificar se o convite existe
    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o convite já foi aceito
    if (invite.status === "accepted") {
      return NextResponse.json(
        { message: "Convite já foi aceito anteriormente" },
        { status: 200 }
      );
    }

    // Atualizar o status do convite para "accepted" se ainda não estiver
    if (invite.status !== "accepted") {
      await prisma.invite.update({
        where: { id: inviteId },
        data: { status: "accepted" },
      });
    }

    // Criar conteúdo da notificação para o remetente
    const notificationContent = {
      inviteId: invite.id,
      recipientName: invite.recipient?.name || session.user.name || "Usuário",
      recipientEmail: invite.recipient?.email || session.user.email,
      projectId: invite.project.id,
      projectName: invite.project.name,
      status: "accepted",
    };

    // Enviar notificação ao remetente do convite
    const result = await createAndSendNotification(
      invite.senderId,
      "invite_accepted",
      notificationContent
    );

    // Também emitir uma notificação para atualizar as listas de membros
    // Esta notificação será capturada por componentes para atualizar suas listas
    await createAndSendNotification(invite.senderId, "member_added", {
      projectId: invite.project.id,
      projectName: invite.project.name,
      memberName: invite.recipient?.name || session.user.name || "Usuário",
      memberEmail: invite.recipient?.email || session.user.email,
      memberId: session.user.id,
    });

    // Notificar sobre a mudança de status do convite
    await createAndSendNotification(invite.senderId, "invite_status_changed", {
      inviteId: invite.id,
      status: "accepted",
      projectId: invite.project.id,
      projectName: invite.project.name,
      recipientName: invite.recipient?.name || session.user.name || "Usuário",
      recipientEmail: invite.recipient?.email || session.user.email,
    });

    return NextResponse.json({
      success: true,
      message: "Notificação de convite aceito enviada com sucesso",
      notification: result.notification,
    });
  } catch (error: any) {
    console.error("Erro ao enviar notificação de convite aceito:", error);
    return NextResponse.json(
      {
        error: "Erro ao enviar notificação",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
