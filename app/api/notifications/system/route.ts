import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAndSendNotification } from "@/app/api/notifications/route";

// Rota para criar uma notificação do sistema
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
    console.log("[DEBUG] Dados recebidos em system:", requestData);
    
    const { userId, message, severity, action, actionLink } = requestData;

    // Validar dados essenciais
    if (!userId || !message) {
      return NextResponse.json(
        { 
          error: "Dados incompletos para criar a notificação do sistema",
          received: requestData 
        },
        { status: 400 }
      );
    }

    // Criar conteúdo da notificação
    const notificationContent = {
      message,
      severity: severity || "info",
      action: action || undefined,
      actionLink: actionLink || undefined,
    };

    console.log("[DEBUG] Criando notificação do sistema com:", {
      userId,
      type: "SYSTEM",
      content: notificationContent
    });

    // Criar a notificação e enviar via WebSocket
    try {
      const result = await createAndSendNotification(
        userId,
        "SYSTEM",
        notificationContent
      );

      if (result.success) {
        return NextResponse.json({
          success: true,
          notification: result.notification,
        });
      } else {
        console.error("[DEBUG] Erro no createAndSendNotification para system:", result.error);
        return NextResponse.json(
          { error: `Erro ao criar notificação do sistema: ${result.error}` },
          { status: 500 }
        );
      }
    } catch (notifError) {
      console.error("[DEBUG] Exceção no createAndSendNotification para system:", notifError);
      return NextResponse.json(
        { error: `Exceção ao criar notificação do sistema: ${notifError}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[DEBUG] Erro geral ao criar notificação do sistema:", error);
    return NextResponse.json(
      { error: `Erro ao criar notificação do sistema: ${error}` },
      { status: 500 }
    );
  }
} 