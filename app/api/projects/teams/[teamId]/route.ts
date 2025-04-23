import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para atualização de equipe
const updateTeamSchema = z.object({
  name: z.string().min(1, "O nome da equipe é obrigatório").optional(),
  description: z.string().optional().nullable(),
  logoIcon: z.string().optional().nullable(),
  iconColor: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET - Obter detalhes de uma equipe
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar a equipe
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
        members: {
          take: 5,
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
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Equipe não encontrada" },
        { status: 404 }
      );
    }

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: team.projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: team.projectId,
        },
      },
    });

    // Se não é proprietário direto e não é membro, não tem acesso
    if (!isProjectOwner && !projectMember) {
      return NextResponse.json(
        { error: "Você não tem acesso a este projeto" },
        { status: 403 }
      );
    }

    // Formatar a resposta
    const formattedTeam = {
      ...team,
      memberCount: team._count.members,
      _count: undefined,
      // Formatar membros para incluir apenas informações relevantes
      members: team.members.map((member) => ({
        id: member.id,
        role: member.role,
        joinedAt: member.joinedAt,
        user: member.projectMember.user,
      })),
    };

    return NextResponse.json({ team: formattedTeam });
  } catch (error) {
    console.error("Erro ao obter detalhes da equipe:", error);
    return NextResponse.json(
      { error: "Erro ao obter detalhes da equipe" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar equipe
export async function PATCH(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar a equipe para obter o projectId
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Equipe não encontrada" },
        { status: 404 }
      );
    }

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: team.projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: team.projectId,
        },
      },
    });

    // Se não é proprietário direto e não é membro, não tem acesso
    if (!isProjectOwner && !projectMember) {
      return NextResponse.json(
        { error: "Você não tem acesso a este projeto" },
        { status: 403 }
      );
    }

    // 3. Verificar permissões combinadas:
    // - Se é proprietário direto, tem permissão automaticamente
    // - Se é membro, precisa ter role "admin" ou "owner"
    if (
      !isProjectOwner &&
      (!projectMember || !["admin", "owner"].includes(projectMember.role))
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar equipes" },
        { status: 403 }
      );
    }

    // Obter dados da requisição
    const body = await request.json();

    // Validar dados
    const validationResult = updateTeamSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Atualizar a equipe
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: updateData,
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // Formatar a resposta
    const formattedTeam = {
      ...updatedTeam,
      memberCount: updatedTeam._count.members,
      _count: undefined,
    };

    return NextResponse.json({ team: formattedTeam });
  } catch (error) {
    console.error("Erro ao atualizar equipe:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar equipe" },
      { status: 500 }
    );
  }
}

// DELETE - Remover equipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar a equipe para obter o projectId
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Equipe não encontrada" },
        { status: 404 }
      );
    }

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: team.projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: team.projectId,
        },
      },
    });

    // Se não é proprietário direto e não é membro, não tem acesso
    if (!isProjectOwner && !projectMember) {
      return NextResponse.json(
        { error: "Você não tem acesso a este projeto" },
        { status: 403 }
      );
    }

    // 3. Verificar permissões combinadas:
    // - Se é proprietário direto, tem permissão automaticamente
    // - Se é membro, precisa ter role "admin" ou "owner"
    if (
      !isProjectOwner &&
      (!projectMember || !["admin", "owner"].includes(projectMember.role))
    ) {
      return NextResponse.json(
        { error: "Você não tem permissão para remover equipes" },
        { status: 403 }
      );
    }

    // Remover a equipe (isso irá remover automaticamente todos os membros da equipe devido ao CASCADE)
    await prisma.team.delete({
      where: {
        id: teamId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Equipe removida com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover equipe:", error);
    return NextResponse.json(
      { error: "Erro ao remover equipe" },
      { status: 500 }
    );
  }
}
