import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getWebhookById,
  updateWebhook,
  deleteWebhook,
} from "@/app/lib/webhooks";

interface RouteParams {
  params: {
    id: string;
  };
}

// Buscar webhook específico
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const webhook = await getWebhookById(params.id);
    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para acessar este webhook
    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error("Erro ao buscar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao buscar webhook" },
      { status: 500 }
    );
  }
}

// Atualizar webhook (PUT para atualizações completas)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const webhook = await getWebhookById(params.id);
    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para atualizar este webhook
    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const data = await request.json();
    const updatedWebhook = await updateWebhook(params.id, data);

    return NextResponse.json(updatedWebhook);
  } catch (error) {
    console.error("Erro ao atualizar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar webhook" },
      { status: 500 }
    );
  }
}

// Atualização parcial do webhook (PATCH para atualizações parciais)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const webhook = await getWebhookById(params.id);
    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para atualizar este webhook
    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    // Obter os dados parciais para atualização
    const data = await request.json();

    // Validar dados se necessário, por exemplo:
    if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
      return NextResponse.json(
        { error: "O parâmetro isActive deve ser um booleano" },
        { status: 400 }
      );
    }

    // Atualizar o webhook com os dados parciais
    const updatedWebhook = await updateWebhook(params.id, data);

    return NextResponse.json(updatedWebhook);
  } catch (error) {
    console.error("Erro ao atualizar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar webhook" },
      { status: 500 }
    );
  }
}

// Excluir webhook
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const webhook = await getWebhookById(params.id);
    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para excluir este webhook
    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await deleteWebhook(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir webhook:", error);
    return NextResponse.json(
      { error: "Erro ao excluir webhook" },
      { status: 500 }
    );
  }
}
