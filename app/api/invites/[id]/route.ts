import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";

// Interface para tipar corretamente a sessão
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Endpoint para responder um convite (aceitar/rejeitar)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inviteId = params.id;
    if (!inviteId) {
      return NextResponse.json(
        { error: "ID do convite é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Tipagem segura do usuário da sessão
    const user = session.user as SessionUser;

    // Obter ação do corpo da requisição
    const body = await request.json();
    const { action } = body;

    if (!action || (action !== "accept" && action !== "reject")) {
      return NextResponse.json(
        { error: "Ação inválida. Use 'accept' ou 'reject'" },
        { status: 400 }
      );
    }

    // Verificar se o convite existe e é para o usuário atual
    const invite = await prisma.invite.findFirst({
      where: {
        id: inviteId,
        OR: [{ email: user.email || "" }, { recipientId: user.id }],
        status: "pending",
      },
      include: {
        project: true,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Convite não encontrado ou já processado" },
        { status: 404 }
      );
    }

    if (action === "accept") {
      // Verificar se o usuário já é membro do projeto
      const existingMember = await prisma.projectMember.findFirst({
        where: {
          projectId: invite.projectId,
          userId: user.id,
        },
      });

      if (!existingMember) {
        // Adicionar usuário ao projeto
        await prisma.projectMember.create({
          data: {
            projectId: invite.projectId,
            userId: user.id,
            role: "member", // Papel padrão
          },
        });
      }

      // Atualizar o status do convite para 'accepted'
      await prisma.invite.update({
        where: {
          id: inviteId,
        },
        data: {
          status: "accepted",
          recipientId: user.id, // Garantir que o usuário está vinculado
        },
      });

      return NextResponse.json({
        message: `Você foi adicionado ao projeto ${invite.project.name}`,
      });
    } else {
      // Rejeitar o convite (atualizar status para 'rejected')
      await prisma.invite.update({
        where: {
          id: inviteId,
        },
        data: {
          status: "rejected",
          recipientId: user.id, // Garantir que o usuário está vinculado
        },
      });

      return NextResponse.json({
        message: `Convite para o projeto ${invite.project.name} foi rejeitado`,
      });
    }
  } catch (error) {
    console.error("Erro ao processar convite:", error);
    return NextResponse.json(
      { error: "Erro ao processar convite" },
      { status: 500 }
    );
  }
}

// Endpoint para verificar convite por token
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // O ID neste caso pode ser tanto o ID do convite quanto o token
    const inviteId = params.id;

    // Tenta primeiro encontrar pelo ID
    let invite = await db.invite.findUnique({
      where: { id: inviteId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            logoIcon: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Se não encontrou pelo ID, tenta pelo token
    if (!invite) {
      invite = await db.invite.findUnique({
        where: { inviteToken: inviteId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              logoIcon: true,
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    }

    if (!invite) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o convite expirou
    if (new Date() > invite.expiresAt) {
      await db.invite.update({
        where: { id: invite.id },
        data: { status: "expired" },
      });

      return NextResponse.json({ error: "Convite expirado" }, { status: 410 });
    }

    // Verificar se o convite já foi aceito ou rejeitado
    if (invite.status !== "pending") {
      return NextResponse.json({
        invite: {
          id: invite.id,
          status: invite.status,
          email: invite.email,
          project: invite.project,
          sender: invite.sender,
        },
      });
    }

    return NextResponse.json({
      invite: {
        id: invite.id,
        token: invite.inviteToken,
        email: invite.email,
        status: invite.status,
        project: invite.project,
        sender: invite.sender,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar convite:", error);
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}
