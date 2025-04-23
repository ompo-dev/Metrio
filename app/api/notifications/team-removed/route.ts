import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Rota para criar uma notificação quando um membro é removido de uma equipe
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
    if (!userId || !teamName || !projectId) {
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

    // Criar a notificação para o usuário removido
    const notification = await prisma.notification.create({
      data: {
        type: "TEAM_REMOVED",
        content: {
          teamId: teamId || "",
          teamName,
          projectId,
          projectName: projectName || "Projeto",
          senderName: sender?.name || "Um usuário",
          senderInitials: sender?.name
            ? sender.name.substring(0, 2).toUpperCase()
            : "NU",
          action: "removeu você da equipe",
        },
        read: false,
        userId, // ID do usuário que receberá a notificação
      },
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Erro ao criar notificação de remoção:", error);
    return NextResponse.json(
      { error: "Erro ao criar notificação de remoção" },
      { status: 500 }
    );
  }
}
