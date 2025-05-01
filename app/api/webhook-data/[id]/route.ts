import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

interface WebhookDataResult {
  id: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  projectId: string;
  userId: string;
}

/**
 * @swagger
 * /api/webhook-data/{id}:
 *   get:
 *     tags: ["Webhook Data"]
 *     summary: "Obter dados de um webhook específico"
 *     description: "Obter dados recebidos por um webhook específico"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do webhook
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do webhook
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DataWebhook"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Dados não encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Certifique-se de que o id é válido
    const webhookId = params.id;

    // Buscar os dados do webhook e verificar permissão
    const query = `
      SELECT dw.*, w.name, w."projectId", w."userId"
      FROM "DataWebhook" dw
      JOIN "Webhook" w ON dw.id = w.id
      WHERE dw.id = $1
    `;

    const result = await db.$queryRawUnsafe<WebhookDataResult[]>(
      query,
      webhookId
    );

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Dados não encontrados" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem acesso a este webhook
    const webhookData = result[0];
    if (webhookData.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    // Formatar os dados de retorno
    const formattedResult = {
      id: webhookData.id,
      data: webhookData.data,
      createdAt: webhookData.createdAt,
      updatedAt: webhookData.updatedAt,
      webhookName: webhookData.name,
      projectId: webhookData.projectId,
    };

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error("Erro ao buscar dados do webhook:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do webhook" },
      { status: 500 }
    );
  }
}
