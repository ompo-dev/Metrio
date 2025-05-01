import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createWebhook,
  getWebhooksByProject,
  getWebhooksByUser,
} from "@/app/lib/webhooks";

// Listar webhooks
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let webhooks;
    if (projectId) {
      webhooks = await getWebhooksByProject(projectId);
    } else {
      webhooks = await getWebhooksByUser(session.user.id);
    }

    return NextResponse.json(webhooks);
  } catch (error) {
    console.error("Erro ao listar webhooks:", error);
    return NextResponse.json(
      { error: "Erro ao listar webhooks" },
      { status: 500 }
    );
  }
}

// Criar um novo webhook
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();

    // Validar dados obrigatórios
    if (
      !data.name ||
      !data.technicalName ||
      !data.secretToken ||
      !data.projectId
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // Criar o webhook
    const webhook = await createWebhook({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao criar webhook" },
      { status: 500 }
    );
  }
}
