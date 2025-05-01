import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/projects - Listar projetos do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar projetos onde o usuário é dono
    const ownedProjects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Buscar projetos onde o usuário é membro
    const memberProjects = await db.projectMember.findMany({
      where: { userId: session.user.id },
      include: {
        project: true,
      },
    });

    // Converter os resultados de memberProjects para o formato de projeto
    const memberProjectsFormatted = memberProjects.map((pm) => ({
      id: pm.project.id,
      name: pm.project.name,
      logoIcon: pm.project.logoIcon,
      type: pm.project.type,
      role: pm.role, // Adicionar o papel do usuário neste projeto
    }));

    // Filtrar para remover duplicatas (caso o usuário seja dono e membro do mesmo projeto)
    const memberOnlyProjects = memberProjectsFormatted.filter(
      (mp) => !ownedProjects.some((op) => op.id === mp.id)
    );

    // Combinar projetos onde é dono com projetos onde é apenas membro
    const allProjects = [
      ...ownedProjects.map((p) => ({ ...p, role: "owner" })), // Marcar como dono
      ...memberOnlyProjects,
    ];

    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("Erro ao listar projetos:", error);
    return NextResponse.json(
      { error: "Erro ao listar projetos" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Criar um novo projeto
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, logoIcon, type } = body;

    if (!name || !logoIcon) {
      return NextResponse.json(
        { error: "Nome e ícone são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar o projeto
    const project = await db.project.create({
      data: {
        name,
        logoIcon,
        type,
        userId: session.user.id,
      },
    });

    // Definir como projeto ativo para o usuário
    await db.user.update({
      where: { id: session.user.id },
      data: { activeProjectId: project.id },
    });

    return NextResponse.json({ ...project, role: "owner" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
