import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAndSendNotification } from "@/app/api/notifications/route";

// Rota para criar uma notificação de convite
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
    const requestData = await request.json();
    console.log("[DEBUG] Dados recebidos em invite:", requestData);
    
    const { userId, inviteId, projectId, projectName } = requestData;

    // Validar dados essenciais
    if (!userId || !inviteId || !projectId) {
      return NextResponse.json(
        { 
          error: "Dados incompletos para criar a notificação de convite",
          received: requestData 
        },
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
      inviteId,
      projectId,
      projectName: projectName || "Projeto",
      senderName: sender?.name || "Um usuário",
      senderInitials: sender?.name
        ? sender.name.substring(0, 2).toUpperCase()
        : "NU",
    };

    console.log("[DEBUG] Criando notificação de convite com:", {
      userId,
      type: "INVITE",
      content: notificationContent
    });

    // Criar a notificação e enviar via WebSocket
    try {
      const result = await createAndSendNotification(
        userId,
        "INVITE",
        notificationContent
      );

      if (result.success) {
        return NextResponse.json({
          success: true,
          notification: result.notification,
        });
      } else {
        console.error("[DEBUG] Erro no createAndSendNotification para invite:", result.error);
        return NextResponse.json(
          { error: `Erro ao criar notificação de convite: ${result.error}` },
          { status: 500 }
        );
      }
    } catch (notifError) {
      console.error("[DEBUG] Exceção no createAndSendNotification para invite:", notifError);
      return NextResponse.json(
        { error: `Exceção ao criar notificação de convite: ${notifError}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[DEBUG] Erro geral ao criar notificação de convite:", error);
    return NextResponse.json(
      { error: `Erro ao criar notificação de convite: ${error}` },
      { status: 500 }
    );
  }
} 