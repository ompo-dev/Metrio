import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para atualização de função do membro
const updateMemberRoleSchema = z.object({
  role: z.string().min(1, "Função é obrigatória"),
});

// PATCH - Atualizar função de um membro na equipe
export async function PATCH(
  request: NextRequest,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const { teamId, memberId } = params;

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar o membro da equipe
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        team: true,
      },
    });

    if (!teamMember || teamMember.teamId !== teamId) {
      return NextResponse.json(
        { error: "Membro não encontrado nesta equipe" },
        { status: 404 }
      );
    }

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: teamMember.team.projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const currentUserMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: teamMember.team.projectId,
        },
      },
    });

    // Se não é proprietário direto e não é membro, não tem acesso
    if (!isProjectOwner && !currentUserMember) {
      return NextResponse.json(
        { error: "Você não tem acesso a este projeto" },
        { status: 403 }
      );
    }

    // Verificar se o usuário tem permissão para editar membros
    // (proprietário direto, admin, owner ou lead da equipe)
    const isTeamLead = await prisma.teamMember.findFirst({
      where: {
        teamId,
        projectMemberId: currentUserMember?.id,
        role: "lead",
      },
    });

    if (
      !isProjectOwner &&
      (!currentUserMember ||
        !["admin", "owner"].includes(currentUserMember.role)) &&
      !isTeamLead
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar membros desta equipe" },
        { status: 403 }
      );
    }

    // Obter dados da requisição
    const body = await request.json();

    // Validar dados
    const validationResult = updateMemberRoleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { role } = validationResult.data;

    // Atualizar a função do membro
    const updatedTeamMember = await prisma.teamMember.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
      include: {
        projectMember: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Formatar a resposta
    const formattedMember = {
      id: updatedTeamMember.id,
      role: updatedTeamMember.role,
      joinedAt: updatedTeamMember.joinedAt,
      projectMemberId: updatedTeamMember.projectMemberId,
      user: updatedTeamMember.projectMember.user,
    };

    return NextResponse.json({ member: formattedMember });
  } catch (error) {
    console.error("Erro ao atualizar função do membro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar função do membro" },
      { status: 500 }
    );
  }
}

// DELETE - Remover membro de uma equipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const { teamId, memberId } = params;

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar o membro da equipe
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        team: true,
      },
    });

    if (!teamMember || teamMember.teamId !== teamId) {
      return NextResponse.json(
        { error: "Membro não encontrado nesta equipe" },
        { status: 404 }
      );
    }

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: teamMember.team.projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const currentUserMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: teamMember.team.projectId,
        },
      },
    });

    // Se não é proprietário direto e não é membro, não tem acesso
    if (!isProjectOwner && !currentUserMember) {
      return NextResponse.json(
        { error: "Você não tem acesso a este projeto" },
        { status: 403 }
      );
    }

    // Verificar se o usuário tem permissão para remover membros
    // (proprietário direto, admin, owner ou lead da equipe)
    const isTeamLead = await prisma.teamMember.findFirst({
      where: {
        teamId,
        projectMemberId: currentUserMember?.id,
        role: "lead",
      },
    });

    if (
      !isProjectOwner &&
      (!currentUserMember ||
        !["admin", "owner"].includes(currentUserMember.role)) &&
      !isTeamLead
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para remover membros desta equipe" },
        { status: 403 }
      );
    }

    // Remover o membro da equipe
    await prisma.teamMember.delete({
      where: {
        id: memberId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Membro removido da equipe com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover membro da equipe:", error);
    return NextResponse.json(
      { error: "Erro ao remover membro da equipe" },
      { status: 500 }
    );
  }
}
