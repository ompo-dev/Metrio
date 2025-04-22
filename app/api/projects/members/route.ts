import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Definir tipos para os níveis de prioridade de papéis
type RoleType = "owner" | "admin" | "member" | "viewer";
type RolePriorityMap = {
  [key in RoleType]: number;
};

/**
 * @swagger
 * /api/projects/members:
 *   get:
 *     tags:
 *       - Membros
 *     summary: Listar membros do projeto
 *     description: Obtém a lista de membros do projeto atual ou do projeto especificado
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: query
 *         description: ID do projeto (opcional, usa o projeto ativo se não fornecido)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de membros do projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 *                   lastActive:
 *                     type: string
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *   post:
 *     tags:
 *       - Membros
 *     summary: Adicionar membro ao projeto
 *     description: Adiciona um novo membro ao projeto atual
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do membro
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do membro
 *               role:
 *                 type: string
 *                 description: Função do membro (admin, member, viewer)
 *               projectId:
 *                 type: string
 *                 description: ID do projeto (opcional, usa o projeto ativo se não fornecido)
 *     responses:
 *       201:
 *         description: Membro adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
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
 *         description: Dados inválidos
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
 *       404:
 *         description: Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter projectId dos parâmetros de consulta ou usar o projeto ativo do usuário
    const { searchParams } = new URL(request.url);
    let projectId = searchParams.get("projectId");

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

    // Verificar se o usuário tem acesso ao projeto
    const project = await db.project.findFirst({
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

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado ou sem permissão de acesso" },
        { status: 404 }
      );
    }

    // Buscar o dono do projeto
    const projectOwner = await db.user.findUnique({
      where: { id: project.userId },
      select: { id: true, name: true, email: true, image: true },
    });

    // Buscar os membros do projeto
    const projectMembers = await db.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Criar um mapa para armazenar os membros por userId, garantindo que tenhamos apenas
    // um registro por usuário com o cargo mais alto
    const userMap = new Map();

    // Funções ordenadas por prioridade (do mais alto para o mais baixo)
    const rolePriority: RolePriorityMap = {
      owner: 4,
      admin: 3,
      member: 2,
      viewer: 1,
    };

    // Adicionar o dono como primeiro membro com papel "owner" (se o dono existir)
    if (projectOwner) {
      userMap.set(projectOwner.id, {
        id: `owner-${projectOwner.id}`,
        userId: projectOwner.id,
        name: projectOwner.name || "Sem nome",
        email: projectOwner.email || "",
        role: "owner" as RoleType,
        status: "Ativo",
        lastActive: "Agora",
        priority: rolePriority["owner"], // Prioridade máxima
      });
    }

    // Processar os membros, mantendo apenas o cargo mais alto para cada usuário
    projectMembers.forEach((member) => {
      const userId = member.user.id;
      const role = member.role as RoleType;
      const priority = rolePriority[role] || 0;

      // Se o usuário já existe no mapa, verificar se este cargo tem prioridade mais alta
      if (userMap.has(userId)) {
        const existingMember = userMap.get(userId);
        if (priority > existingMember.priority) {
          // Atualizar para o cargo mais alto
          userMap.set(userId, {
            id: `member-${member.id}`,
            userId: userId,
            name: member.user.name || "Sem nome",
            email: member.user.email || "",
            role: role,
            status: "Ativo",
            lastActive: "Recente",
            priority: priority,
          });
        }
      } else {
        // Adicionar novo usuário ao mapa
        userMap.set(userId, {
          id: `member-${member.id}`,
          userId: userId,
          name: member.user.name || "Sem nome",
          email: member.user.email || "",
          role: role,
          status: "Ativo",
          lastActive: "Recente",
          priority: priority,
        });
      }
    });

    // Converter o mapa para uma array e remover o campo priority que foi usado internamente
    const formattedMembers = Array.from(userMap.values()).map((member) => {
      const { priority, ...memberWithoutPriority } = member;
      return memberWithoutPriority;
    });

    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error("Erro ao listar membros do projeto:", error);
    return NextResponse.json(
      { error: "Erro ao listar membros do projeto" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter os dados da requisição
    const {
      name,
      email,
      role,
      projectId: requestProjectId,
    } = await request.json();

    // Validar dados básicos
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Nome, email e função são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar que a função é válida
    const validRoles = ["admin", "member", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Função inválida" }, { status: 400 });
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

    // Verificar se o usuário tem permissão para adicionar membros (deve ser dono ou admin)
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // É o dono
          {
            members: {
              some: {
                userId: session.user.id,
                role: "admin", // É admin
              },
            },
          },
        ],
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto não encontrado ou sem permissão de acesso" },
        { status: 404 }
      );
    }

    // Verificar se já existe um usuário com este email
    let user = await db.user.findUnique({
      where: { email },
    });

    // Se o usuário não existir, criá-lo
    if (!user) {
      // Em uma implementação real, aqui enviaríamos um convite e não criaríamos
      // o usuário automaticamente. Mas para simplificar, vamos criar o usuário.
      user = await db.user.create({
        data: {
          name,
          email,
          // Não definimos uma senha, pois o usuário usaria "forgot password" para definir
        },
      });
    }

    // Verificar se o usuário é o proprietário do projeto
    if (project.userId === user.id) {
      return NextResponse.json(
        { error: "Este usuário já é o proprietário do projeto" },
        { status: 400 }
      );
    }

    // Verificar se o usuário já é membro do projeto
    const existingMember = await db.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (existingMember) {
      // Se o usuário já é membro, verificar se o novo cargo tem prioridade mais alta
      const rolePriority: Record<string, number> = {
        admin: 3,
        member: 2,
        viewer: 1,
      };

      if (
        (rolePriority[role] || 0) > (rolePriority[existingMember.role] || 0)
      ) {
        // Atualizar para o cargo mais alto
        const updatedMember = await db.projectMember.update({
          where: {
            id: existingMember.id,
          },
          data: {
            role,
          },
        });

        // Retornar o membro atualizado
        const formattedMember = {
          id: `member-${updatedMember.id}`,
          userId: user.id,
          name: user.name || "Sem nome",
          email: user.email,
          role,
          status: "Ativo",
          lastActive: "Agora",
        };

        return NextResponse.json(formattedMember, { status: 200 });
      } else {
        return NextResponse.json(
          {
            error:
              "Este usuário já é membro do projeto com um cargo igual ou superior",
          },
          { status: 400 }
        );
      }
    }

    // Adicionar o usuário como membro do projeto
    const newMember = await db.projectMember.create({
      data: {
        role,
        user: {
          connect: { id: user.id },
        },
        project: {
          connect: { id: projectId },
        },
      },
    });

    // Retornar o novo membro no formato esperado pelo componente
    const formattedMember = {
      id: `member-${newMember.id}`,
      userId: user.id,
      name: user.name || "Sem nome",
      email: user.email,
      role,
      status: "Ativo",
      lastActive: "Agora",
    };

    return NextResponse.json(formattedMember, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar membro ao projeto:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar membro ao projeto" },
      { status: 500 }
    );
  }
}
