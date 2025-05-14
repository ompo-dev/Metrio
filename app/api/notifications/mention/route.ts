import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAndSendNotification } from "@/app/api/notifications/route";

// Rota para criar uma notificação de menção
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
    console.log("[DEBUG] Dados recebidos em mention:", requestData);
    
    const { userId, sourceId, sourceName, sourceType, comment } = requestData;

    // Validar dados essenciais
    if (!userId || !sourceId || !sourceName) {
      return NextResponse.json(
        { 
          error: "Dados incompletos para criar a notificação de menção",
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
      sourceId,
      sourceName,
      sourceType: sourceType || "comment",
      comment: comment || "Você foi mencionado",
      senderName: sender?.name || "Um usuário",
      senderInitials: sender?.name
        ? sender.name.substring(0, 2).toUpperCase()
        : "NU",
    };

    console.log("[DEBUG] Criando notificação de menção com:", {
      userId,
      type: "MENTION",
      content: notificationContent
    });

    // Criar a notificação e enviar via WebSocket
    try {
      const result = await createAndSendNotification(
        userId,
        "MENTION",
        notificationContent
      );

      if (result.success) {
        return NextResponse.json({
          success: true,
          notification: result.notification,
        });
      } else {
        console.error("[DEBUG] Erro no createAndSendNotification para mention:", result.error);
        return NextResponse.json(
          { error: `Erro ao criar notificação de menção: ${result.error}` },
          { status: 500 }
        );
      }
    } catch (notifError) {
      console.error("[DEBUG] Exceção no createAndSendNotification para mention:", notifError);
      return NextResponse.json(
        { error: `Exceção ao criar notificação de menção: ${notifError}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[DEBUG] Erro geral ao criar notificação de menção:", error);
    return NextResponse.json(
      { error: `Erro ao criar notificação de menção: ${error}` },
      { status: 500 }
    );
  }
} 