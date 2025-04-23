import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAndSendNotification } from "@/app/api/notifications/route";

// Rota para criar uma notificação quando um membro é adicionado a uma equipe
export async function POST(request: Request) {
  try {
    // Verificar a sessão do usuário
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado" },
        { status: 401 }
      );
    }

    // Obter dados do corpo da requisição
    const { userId, teamId, teamName, projectId, projectName } =
      await request.json();

    // Validar dados essenciais
    if (!userId || !teamId || !teamName || !projectId) {
      return NextResponse.json(
        { error: "Dados incompletos para criar a notificação" },
        { status: 400 }
      );
    }

    // Obter informações do remetente (usuário atual)
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true },
    });

    // Criar conteúdo da notificação
    const notificationContent = {
      teamId,
      teamName,
      projectId,
      projectName: projectName || "Projeto",
      senderName: sender?.name || "Um usuário",
      senderInitials: sender?.name
        ? sender.name.substring(0, 2).toUpperCase()
        : "NU",
    };

    // Criar a notificação e enviar via WebSocket
    const result = await createAndSendNotification(
      userId,
      "TEAM_ADDED",
      notificationContent
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        notification: result.notification,
      });
    } else {
      return NextResponse.json(
        { error: "Erro ao criar notificação" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    return NextResponse.json(
      { error: "Erro ao criar notificação" },
      { status: 500 }
    );
  }
}
