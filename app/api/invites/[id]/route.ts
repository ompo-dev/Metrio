import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

// Endpoint para responder um convite (aceitar/rejeitar)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { action } = await req.json();

    if (!action || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Ação inválida. Use 'accept' ou 'reject'" },
        { status: 400 }
      );
    }

    // Buscar o convite
    const invite = await db.invite.findUnique({
      where: {
        id: params.id,
        recipientId: session.user.id,
        status: "pending",
      },
      include: {
        project: true,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Convite não encontrado ou já respondido" },
        { status: 404 }
      );
    }

    // Verificar se o convite não expirou
    if (new Date() > invite.expiresAt) {
      await db.invite.update({
        where: { id: params.id },
        data: { status: "expired" },
      });

      return NextResponse.json({ error: "Convite expirado" }, { status: 410 });
    }

    if (action === "accept") {
      // Adicionar usuário como membro do projeto
      await db.projectMember.create({
        data: {
          userId: session.user.id,
          projectId: invite.projectId,
          role: "member",
        },
      });

      // Atualizar status do convite
      await db.invite.update({
        where: { id: params.id },
        data: { status: "accepted" },
      });

      return NextResponse.json({
        success: true,
        message: "Convite aceito com sucesso",
        projectId: invite.projectId,
        projectName: invite.project.name,
      });
    } else {
      // Rejeitar convite
      await db.invite.update({
        where: { id: params.id },
        data: { status: "rejected" },
      });

      return NextResponse.json({
        success: true,
        message: "Convite rejeitado",
      });
    }
  } catch (error) {
    console.error("Erro ao processar convite:", error);
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
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
