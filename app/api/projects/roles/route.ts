import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * @swagger
 * /api/projects/roles:
 *   get:
 *     tags:
 *       - Funções
 *     summary: Listar funções disponíveis
 *     description: Obtém a lista de funções disponíveis para membros de projetos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de funções
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
 *                   description:
 *                     type: string
 *                   members:
 *                     type: integer
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
export async function GET() {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Lista de papéis pré-definidos
    // No futuro, isso poderia vir de um banco de dados
    const roles = [
      {
        id: "owner",
        name: "Proprietário",
        description: "Acesso total a todas as funcionalidades do projeto",
        members: 1, // Sempre haverá apenas um proprietário
      },
      {
        id: "admin",
        name: "Administrador",
        description: "Pode gerenciar membros e configurações do projeto",
        members: 0, // Este valor será calculado no futuro
      },
      {
        id: "member",
        name: "Membro",
        description: "Acesso básico às funcionalidades do projeto",
        members: 0, // Este valor será calculado no futuro
      },
      {
        id: "viewer",
        name: "Visualizador",
        description: "Acesso somente leitura ao projeto",
        members: 0, // Este valor será calculado no futuro
      },
    ];

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Erro ao listar funções:", error);
    return NextResponse.json(
      { error: "Erro ao listar funções" },
      { status: 500 }
    );
  }
}
