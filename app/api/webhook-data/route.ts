import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Interface para os resultados da consulta SQL
interface WebhookDataResult {
  id: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
  webhook_name: string;
  projectId: string;
}

/**
 * @swagger
 * /api/webhook-data:
 *   get:
 *     tags: ["Webhook Data"]
 *     summary: "Listar todos os dados de webhooks"
 *     description: "Obter dados recebidos por todos os webhooks, com opção de filtro por projeto"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: query
 *         description: ID do projeto para filtrar dados
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de dados de webhooks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DataWebhook"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    // Construir a consulta base
    let query = `
      SELECT dw.*, w.name as webhook_name, w."projectId" 
      FROM "DataWebhook" dw
      JOIN "Webhook" w ON dw.id = w.id
      WHERE w."userId" = $1
    `;

    const queryParams: any[] = [session.user.id];

    // Adicionar filtro por projeto se fornecido
    if (projectId) {
      query += ` AND w."projectId" = $2`;
      queryParams.push(projectId);
    }

    // Ordenar por data de atualização mais recente
    query += ` ORDER BY dw."updatedAt" DESC`;

    // Executar a consulta
    const result = await db.$queryRawUnsafe<WebhookDataResult[]>(
      query,
      ...queryParams
    );

    // Formatar os resultados
    const formattedResult = result.map((item: WebhookDataResult) => ({
      id: item.id,
      data: item.data,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      webhookName: item.webhook_name,
      projectId: item.projectId,
    }));

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error("Erro ao buscar dados de webhooks:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados de webhooks" },
      { status: 500 }
    );
  }
}
