import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type RoleType = "owner" | "admin" | "member" | "viewer";
type RolePriorityMap = {
  [key in RoleType]: number;
};

// Funções ordenadas por prioridade (do mais alto para o mais baixo)
const rolePriority: RolePriorityMap = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

/**
 * @swagger
 * /api/projects/members/{id}:
 *   delete:
 *     tags:
 *       - Membros
 *     summary: Remover membro do projeto
 *     description: Remove um membro do projeto atual
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do membro a ser removido
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membro removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou tentativa de remover a si mesmo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Sem permissão para remover este membro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Membro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 *   patch:
 *     tags:
 *       - Membros
 *     summary: Atualizar dados de um membro
 *     description: Atualiza a função ou outros dados de um membro no projeto atual
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do membro
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: Nova função do membro (admin, member, viewer)
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 lastActive:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou tentativa de alterar a própria função
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Sem permissão para alterar este membro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Membro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

// Rota para remover um membro do projeto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Extrair o ID do membro a ser removido e o projectId opcional
    const [memberId, projectIdParam] = params.params;

    if (!memberId) {
      return NextResponse.json(
        { error: "ID do membro é obrigatório" },
        { status: 400 }
      );
    }

    // Na URL, o ID pode vir no formato 'member-xyz' ou apenas o ID real do membro
    // Vamos extrair o ID real
    const memberIdClean = memberId.startsWith("member-")
      ? memberId.substring(7)
      : memberId;

    // Se foi fornecido um projectId, usá-lo, caso contrário buscar o projeto ativo
    let projectId = projectIdParam;
    if (!projectId) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { activeProjectId: true },
      });

      if (!user?.activeProjectId) {
        return NextResponse.json(
          { error: "Nenhum projeto ativo encontrado" },
          { status: 404 }
        );
      }

      projectId = user.activeProjectId;
    }

    // Buscar o projeto
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para remover membros (deve ser dono ou admin)
    const userRole =
      project.userId === session.user.id
        ? "owner"
        : (
            await db.projectMember.findUnique({
              where: {
                userId_projectId: {
                  userId: session.user.id,
                  projectId,
                },
              },
              select: { role: true },
            })
          )?.role || null;

    if (userRole !== "owner" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Sem permissão para remover membros" },
        { status: 403 }
      );
    }

    // Buscar o membro a ser removido
    const memberToRemove = await db.projectMember.findUnique({
      where: { id: memberIdClean },
      include: {
        user: {
          select: { id: true },
        },
      },
    });

    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Membro não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se está tentando remover a si mesmo
    if (memberToRemove.user.id === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode remover a si mesmo do projeto" },
        { status: 400 }
      );
    }

    // Verificar se o membro é do projeto correto
    if (memberToRemove.projectId !== projectId) {
      return NextResponse.json(
        { error: "Este membro não pertence ao projeto atual" },
        { status: 400 }
      );
    }

    // Verificar se está tentando remover um membro com cargo superior ao seu
    // Admin não pode remover outro admin ou proprietário
    if (userRole === "admin" && memberToRemove.role === "admin") {
      return NextResponse.json(
        { error: "Você não pode remover um membro com cargo igual ao seu" },
        { status: 403 }
      );
    }

    // Remover o membro
    await db.projectMember.delete({
      where: { id: memberIdClean },
    });

    return NextResponse.json({
      success: true,
      message: "Membro removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover membro:", error);
    return NextResponse.json(
      { error: "Erro ao remover membro" },
      { status: 500 }
    );
  }
}

// Rota para atualizar um membro (alterar função)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Extrair o ID do membro
    const [memberId, projectIdParam] = params.params;

    if (!memberId) {
      return NextResponse.json(
        { error: "ID do membro é obrigatório" },
        { status: 400 }
      );
    }

    // Na URL, o ID pode vir no formato 'member-xyz' ou apenas o ID real do membro
    // Vamos extrair o ID real
    const memberIdClean = memberId.startsWith("member-")
      ? memberId.substring(7)
      : memberId;

    // Obter os dados da requisição (nova função)
    const { role } = await request.json();

    // Validar a função
    const validRoles = ["admin", "member", "viewer"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Função inválida. Deve ser admin, member ou viewer" },
        { status: 400 }
      );
    }

    // Se foi fornecido um projectId, usá-lo, caso contrário buscar o projeto ativo
    let projectId = projectIdParam;
    if (!projectId) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { activeProjectId: true },
      });

      if (!user?.activeProjectId) {
        return NextResponse.json(
          { error: "Nenhum projeto ativo encontrado" },
          { status: 404 }
        );
      }

      projectId = user.activeProjectId;
    }

    // Buscar o projeto
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem permissão para atualizar funções (deve ser dono ou admin)
    const userRole =
      project.userId === session.user.id
        ? "owner"
        : (
            await db.projectMember.findUnique({
              where: {
                userId_projectId: {
                  userId: session.user.id,
                  projectId,
                },
              },
              select: { role: true },
            })
          )?.role || null;

    if (userRole !== "owner" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Sem permissão para alterar funções de membros" },
        { status: 403 }
      );
    }

    // Buscar o membro a ser atualizado
    const memberToUpdate = await db.projectMember.findUnique({
      where: { id: memberIdClean },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!memberToUpdate) {
      return NextResponse.json(
        { error: "Membro não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se está tentando atualizar a própria função
    if (memberToUpdate.user.id === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode alterar sua própria função" },
        { status: 400 }
      );
    }

    // Verificar se o membro é do projeto correto
    if (memberToUpdate.projectId !== projectId) {
      return NextResponse.json(
        { error: "Este membro não pertence ao projeto atual" },
        { status: 400 }
      );
    }

    // Verificar se o usuário tem permissão para alterar este membro
    // Admin não pode alterar outro admin
    if (userRole === "admin" && memberToUpdate.role === "admin") {
      return NextResponse.json(
        {
          error:
            "Você não pode alterar a função de um membro com cargo igual ao seu",
        },
        { status: 403 }
      );
    }

    // Não pode dar cargo maior que o seu próprio
    if (rolePriority[role as RoleType] > rolePriority[userRole as RoleType]) {
      return NextResponse.json(
        { error: "Você não pode atribuir um cargo maior que o seu próprio" },
        { status: 403 }
      );
    }

    // Atualizar a função do membro
    const updatedMember = await db.projectMember.update({
      where: { id: memberIdClean },
      data: { role },
    });

    // Retornar o membro atualizado
    return NextResponse.json({
      id: `member-${updatedMember.id}`,
      userId: memberToUpdate.user.id,
      name: memberToUpdate.user.name || "Sem nome",
      email: memberToUpdate.user.email,
      role: updatedMember.role,
      status: "Ativo",
      lastActive: "Agora",
    });
  } catch (error) {
    console.error("Erro ao atualizar função do membro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar função do membro" },
      { status: 500 }
    );
  }
}

// Rota para remover vários membros de uma vez
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter os dados da requisição
    const { memberIds, projectId: requestProjectId } = await request.json();

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json(
        { error: "Lista de IDs de membros é obrigatória" },
        { status: 400 }
      );
    }

    // Determinar o ID do projeto
    let projectId = requestProjectId;

    // Se não foi fornecido um projectId, buscar o projeto ativo do usuário
    if (!projectId) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { activeProjectId: true },
      });

      if (!user?.activeProjectId) {
        return NextResponse.json(
          { error: "Nenhum projeto ativo encontrado" },
          { status: 404 }
        );
      }

      projectId = user.activeProjectId;
    }

    // Verificar se o usuário tem permissão para remover membros (deve ser dono ou admin)
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Determinar o papel do usuário no projeto
    const userRole =
      project.userId === session.user.id
        ? "owner"
        : (
            await db.projectMember.findUnique({
              where: {
                userId_projectId: {
                  userId: session.user.id,
                  projectId,
                },
              },
              select: { role: true },
            })
          )?.role || null;

    if (userRole !== "owner" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Sem permissão para remover membros" },
        { status: 403 }
      );
    }

    // Limpar os IDs (remover prefixos como 'member-')
    const cleanMemberIds = memberIds.map((id: string) =>
      id.startsWith("member-") ? id.substring(7) : id
    );

    // Buscar todos os membros a serem removidos
    const membersToRemove = await db.projectMember.findMany({
      where: {
        id: { in: cleanMemberIds },
        projectId: projectId,
      },
      include: {
        user: {
          select: { id: true },
        },
      },
    });

    // Verificar restrições para cada membro
    const errors: string[] = [];

    // Filtrar membros permitidos para remoção
    const membersAllowedToRemove = membersToRemove.filter((member) => {
      // Não permitir auto-remoção
      if (member.user.id === session.user.id) {
        errors.push(`Você não pode remover a si mesmo do projeto`);
        return false;
      }

      // Admin não pode remover outro admin
      if (userRole === "admin" && member.role === "admin") {
        errors.push(
          `Você não pode remover um membro com cargo igual ao seu: ${member.id}`
        );
        return false;
      }

      return true;
    });

    // Se houver erros, retornar
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Verificar se sobrou algum membro para remover
    if (membersAllowedToRemove.length === 0) {
      return NextResponse.json(
        { message: "Nenhum membro qualificado para remoção" },
        { status: 400 }
      );
    }

    // Remover membros
    await db.projectMember.deleteMany({
      where: {
        id: { in: membersAllowedToRemove.map((m) => m.id) },
        projectId,
      },
    });

    return NextResponse.json({
      message: `${membersAllowedToRemove.length} membros removidos com sucesso`,
      removedCount: membersAllowedToRemove.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Erro ao remover membros:", error);
    return NextResponse.json(
      { error: "Falha ao remover membros do projeto" },
      { status: 500 }
    );
  }
}
