import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";

// Interface para tipar corretamente a sessão
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * GET - Obter convites pendentes para o usuário atual
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

    // Buscar convites pelo email do usuário ou pelo ID do usuário
    const invites = await prisma.invite.findMany({
      where: {
        OR: [
          {
            email: user.email || "",
            status: "pending",
          },
          {
            recipientId: user.id,
            status: "pending",
          },
        ],
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Erro ao buscar convites pendentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar convites pendentes" },
      { status: 500 }
    );
  }
}
