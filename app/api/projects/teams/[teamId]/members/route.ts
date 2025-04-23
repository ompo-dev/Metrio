import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para adicionar membro à equipe
const addMemberSchema = z.object({
  projectMemberId: z.string().min(1, "ID do membro do projeto é obrigatório"),
  role: z.string().default("member"),
});

// GET - Listar membros de uma equipe
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    // Extrair e validar parâmetros
    if (!params || !params.teamId) {
      return NextResponse.json(
        { error: "ID da equipe não fornecido" },
        { status: 400 }
      );
    }
    const teamId = params.teamId;

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

    // Buscar todos os membros da equipe
    const members = await prisma.teamMember.findMany({
      where: {
        teamId,
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
      orderBy: {
        joinedAt: "desc",
      },
    });

    // Formatar a resposta
    const formattedMembers = members.map((member) => ({
      id: member.id,
      role: member.role,
      joinedAt: member.joinedAt,
      projectMemberId: member.projectMemberId,
      user: member.projectMember.user,
    }));

    return NextResponse.json({ members: formattedMembers });
  } catch (error) {
    console.error("Erro ao listar membros da equipe:", error);
    return NextResponse.json(
      { error: "Erro ao listar membros da equipe" },
      { status: 500 }
    );
  }
}

// POST - Adicionar membro a uma equipe
export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    // Extrair e validar parâmetros
    if (!params || !params.teamId) {
      return NextResponse.json(
        { error: "ID da equipe não fornecido" },
        { status: 400 }
      );
    }
    const teamId = params.teamId;

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
    const currentUserMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: team.projectId,
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

    // Verificar se o usuário tem permissão para adicionar membros às equipes
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
        {
          error: "Você não tem permissão para adicionar membros a esta equipe",
        },
        { status: 403 }
      );
    }

    // Obter dados da requisição
    const body = await request.json();

    // Validar dados
    const validationResult = addMemberSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { projectMemberId, role } = validationResult.data;

    // Caso especial para o proprietário do projeto
    if (projectMemberId.startsWith("owner-")) {
      // Extrair o userId do formato "owner-[userId]"
      const userId = projectMemberId.replace("owner-", "");

      // Verificar se esse usuário realmente é o proprietário do projeto
      const projectOwner = await prisma.project.findFirst({
        where: {
          id: team.projectId,
          userId: userId,
        },
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
      });

      if (!projectOwner) {
        return NextResponse.json(
          { error: "Proprietário do projeto não encontrado" },
          { status: 404 }
        );
      }

      // Verificar se o proprietário já está na equipe
      // Primeiro, procurar se ele já tem um ProjectMember
      let ownerProjectMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: userId,
            projectId: team.projectId,
          },
        },
      });

      // Se não existe, criar um ProjectMember para o proprietário
      if (!ownerProjectMember) {
        ownerProjectMember = await prisma.projectMember.create({
          data: {
            userId: userId,
            projectId: team.projectId,
            role: "owner", // Proprietário sempre tem o papel de "owner"
          },
        });
      }

      // Verificar se já existe membro na equipe
      const existingTeamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_projectMemberId: {
            teamId,
            projectMemberId: ownerProjectMember.id,
          },
        },
      });

      if (existingTeamMember) {
        return NextResponse.json(
          { error: "Membro já pertence a esta equipe" },
          { status: 409 }
        );
      }

      // Adicionar o proprietário à equipe
      const newTeamMember = await prisma.teamMember.create({
        data: {
          teamId,
          projectMemberId: ownerProjectMember.id,
          role, // Usar o papel especificado na requisição
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
        id: newTeamMember.id,
        role: newTeamMember.role,
        joinedAt: newTeamMember.joinedAt,
        projectMemberId: newTeamMember.projectMemberId,
        user: newTeamMember.projectMember.user,
      };

      return NextResponse.json({ member: formattedMember }, { status: 201 });
    }

    // Caso para membros regulares (com formato "member-xyz")
    let projectMemberIdClean = projectMemberId;

    // Se o ID vier no formato "member-xyz", extrair apenas a parte "xyz"
    if (projectMemberId.startsWith("member-")) {
      projectMemberIdClean = projectMemberId.substring(7);
    }

    // Verificar se o membro que será adicionado pertence ao mesmo projeto
    const memberToAdd = await prisma.projectMember.findUnique({
      where: {
        id: projectMemberIdClean,
      },
    });

    if (!memberToAdd || memberToAdd.projectId !== team.projectId) {
      return NextResponse.json(
        { error: "Membro não encontrado ou não pertence a este projeto" },
        { status: 404 }
      );
    }

    // Verificar se o membro já está na equipe
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_projectMemberId: {
          teamId,
          projectMemberId: memberToAdd.id, // Usar o ID limpo, sem prefixo
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Membro já pertence a esta equipe" },
        { status: 409 }
      );
    }

    // Adicionar membro à equipe
    const newTeamMember = await prisma.teamMember.create({
      data: {
        teamId,
        projectMemberId: memberToAdd.id, // Usar o ID limpo, sem prefixo
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
      id: newTeamMember.id,
      role: newTeamMember.role,
      joinedAt: newTeamMember.joinedAt,
      projectMemberId: newTeamMember.projectMemberId,
      user: newTeamMember.projectMember.user,
    };

    return NextResponse.json({ member: formattedMember }, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar membro à equipe:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar membro à equipe" },
      { status: 500 }
    );
  }
}
