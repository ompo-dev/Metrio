import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { generateToken } from "../../../../lib/utils";

// Interface para tipar corretamente a sessão
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * GET - Obter convites de um projeto
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Tipagem segura do usuário da sessão
    const user = session.user as SessionUser;

    // Obter projectId dos parâmetros de consulta
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao projeto
    // 1. Verificar se é um membro do projeto
    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: user.id,
      },
    });

    // 2. Verificar se é o dono do projeto
    const isOwner = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    // Se não for nem membro nem dono, negar acesso
    if (!isMember && !isOwner) {
      return NextResponse.json(
        { error: "Sem permissão para acessar este projeto" },
        { status: 403 }
      );
    }

    // Buscar convites do projeto
    const invites = await prisma.invite.findMany({
      where: {
        projectId: projectId,
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
    console.error("Erro ao buscar convites:", error);
    return NextResponse.json(
      { error: "Erro ao buscar convites" },
      { status: 500 }
    );
  }
}

/**
 * POST - Criar um novo convite
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Tipagem segura do usuário da sessão
    const user = session.user as SessionUser;

    // Obter dados do corpo da requisição
    const body = await request.json();
    const { email, projectId } = body;

    if (!email || !projectId) {
      return NextResponse.json(
        { error: "Email e ID do projeto são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao projeto
    // 1. Verificar se é um membro do projeto
    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: user.id,
      },
    });

    // 2. Verificar se é o dono do projeto
    const isOwner = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    // Se não for nem membro nem dono, negar acesso
    if (!isMember && !isOwner) {
      return NextResponse.json(
        { error: "Sem permissão para convidar para este projeto" },
        { status: 403 }
      );
    }

    // Verificar se o usuário convidado já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Verificar se já existe um convite pendente para este email neste projeto
    const existingInvite = await prisma.invite.findFirst({
      where: {
        email: email,
        projectId: projectId,
        status: "pending",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "Já existe um convite pendente para este email" },
        { status: 400 }
      );
    }

    // Verificar se o usuário já está no projeto
    if (existingUser) {
      const alreadyInProject = await prisma.projectMember.findFirst({
        where: {
          projectId: projectId,
          userId: existingUser.id,
        },
      });

      if (alreadyInProject) {
        return NextResponse.json(
          { error: "Este usuário já faz parte do projeto" },
          { status: 400 }
        );
      }
    }

    // Gerar token de convite e data de expiração (7 dias)
    const inviteToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Criar o convite
    const invite = await prisma.invite.create({
      data: {
        email,
        inviteToken,
        expiresAt,
        status: "pending",
        projectId,
        senderId: user.id,
        recipientId: existingUser?.id || null,
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
    });

    // TODO: Enviar email de convite
    // Implementar isso posteriormente com um serviço de email como SendGrid

    return NextResponse.json({ invite }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return NextResponse.json(
      { error: "Erro ao criar convite" },
      { status: 500 }
    );
  }
}
