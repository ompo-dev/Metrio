import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PUT /api/projects/active - Definir o projeto ativo do usuário
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem acesso ao projeto (é dono OU membro)
    const projectAccess = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // É o dono
          {
            members: {
              some: { userId: session.user.id }, // É membro
            },
          },
        ],
      },
    });

    if (!projectAccess) {
      return NextResponse.json(
        { error: "Projeto não encontrado ou você não tem acesso a ele" },
        { status: 404 }
      );
    }

    // Atualizar o projeto ativo do usuário
    await db.user.update({
      where: { id: session.user.id },
      data: { activeProjectId: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao definir projeto ativo:", error);
    return NextResponse.json(
      { error: "Erro ao definir projeto ativo" },
      { status: 500 }
    );
  }
}
