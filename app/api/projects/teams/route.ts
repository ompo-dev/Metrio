import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para criação de equipe
const createTeamSchema = z.object({
  name: z.string().min(1, "O nome da equipe é obrigatório"),
  description: z.string().optional(),
  logoIcon: z.string().optional(),
  iconColor: z.string().optional(),
  projectId: z.string().min(1, "O ID do projeto é obrigatório"),
});

// GET - Listar equipes
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter o projectId da query
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório" },
        { status: 400 }
      );
    }

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId,
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

    // Buscar todas as equipes do projeto
    const teams = await prisma.team.findMany({
      where: {
        projectId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Formatar a resposta
    const formattedTeams = teams.map((team) => ({
      ...team,
      memberCount: team._count.members,
      _count: undefined,
    }));

    return NextResponse.json({ teams: formattedTeams });
  } catch (error) {
    console.error("Erro ao listar equipes:", error);
    return NextResponse.json(
      { error: "Erro ao listar equipes" },
      { status: 500 }
    );
  }
}

// POST - Criar equipe
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter dados da requisição
    const body = await request.json();

    // Validar dados
    const validationResult = createTeamSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { name, description, logoIcon, iconColor, projectId } =
      validationResult.data;

    // 1. Verificar se o usuário é o proprietário direto do projeto
    const isProjectOwner = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    // 2. Verificar se o usuário é um membro do projeto
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId,
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
        { error: "Você não tem permissão para criar equipes" },
        { status: 403 }
      );
    }

    // Criar a equipe
    const team = await prisma.team.create({
      data: {
        name,
        description,
        logoIcon,
        iconColor,
        projectId,
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    return NextResponse.json(
      { error: "Erro ao criar equipe" },
      { status: 500 }
    );
  }
}
