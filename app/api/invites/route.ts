import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

// Endpoint para criar um novo convite
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { email, projectId } = await req.json();

    if (!email || !projectId) {
      return NextResponse.json(
        { error: "Email e projectId são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem permissão para convidar para este projeto
    const project = await db.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado ou sem permissão" },
        { status: 404 }
      );
    }

    // Verificar se já existe um convite pendente para este email e projeto
    const existingInvite = await db.invite.findFirst({
      where: {
        email,
        projectId,
        status: "pending",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "Já existe um convite pendente para este email" },
        { status: 409 }
      );
    }

    // Verificar se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    // Gerar token de convite
    const inviteToken = randomUUID();

    // Definir data de expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Criar o convite
    const invite = await db.invite.create({
      data: {
        email,
        inviteToken,
        expiresAt,
        sender: {
          connect: { id: session.user.id },
        },
        project: {
          connect: { id: projectId },
        },
        recipient: existingUser
          ? { connect: { id: existingUser.id } }
          : undefined,
      },
    });

    // Se o usuário existir, criar uma notificação
    if (existingUser) {
      await db.notification.create({
        data: {
          type: "invite",
          content: {
            inviteId: invite.id,
            projectName: project.name,
            senderName: session.user.name || "Um usuário",
            projectId: project.id,
          } as any, // Uso de "as any" para contornar a validação de esquema
          user: {
            connect: { id: existingUser.id },
          },
        },
      });
    }

    return NextResponse.json({
      invite: {
        id: invite.id,
        email: invite.email,
        inviteToken: invite.inviteToken,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}

// Endpoint para listar convites
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "ProjectId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao projeto
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado ou sem permissão" },
        { status: 404 }
      );
    }

    // Buscar convites do projeto
    const invites = await db.invite.findMany({
      where: {
        projectId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Erro ao listar convites:", error);
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}
