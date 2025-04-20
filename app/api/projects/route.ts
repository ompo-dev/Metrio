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

    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
