import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getWebhookById,
  verifyWebhookAuth,
  validateWebhookPayload,
} from "@/app/lib/webhooks";

interface RouteParams {
  params: {
    projectId: string;
    webhookId: string;
  };
}

/**
 * @swagger
 * /api/webhook/{projectId}/{webhookId}:
 *   post:
 *     tags: ["Webhook Callbacks"]
 *     summary: "Endpoint para receber dados de webhooks"
 *     description: "Endpoint que recebe callbacks de sistemas externos e armazena os dados"
 *     parameters:
 *       - name: projectId
 *         in: path
 *         description: ID do projeto
 *         required: true
 *         schema:
 *           type: string
 *       - name: webhookId
 *         in: path
 *         description: ID do webhook
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyHook:
 *                 type: string
 *                 description: Token secreto para autenticação
 *     responses:
 *       200:
 *         description: Dados recebidos com sucesso
 *       400:
 *         description: Payload inválido ou webhook inativo
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Webhook não encontrado
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Obter o webhook ID dos parâmetros
    const webhookId = params.webhookId;

    // Buscar o webhook pelo ID
    const webhook = await getWebhookById(webhookId);

    // Verificar se o webhook existe e pertence ao projeto
    if (!webhook || webhook.projectId !== params.projectId) {
      return NextResponse.json(
        { error: "Webhook não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o webhook está ativo
    if (!webhook.isActive) {
      return NextResponse.json({ error: "Webhook inativo" }, { status: 400 });
    }

    // Obter o payload da requisição
    const payload = await request.json();

    // Verificar autenticação usando o token secreto
    if (!verifyWebhookAuth(payload, webhook.secretToken)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Validar o formato do payload conforme o schema definido
    const validation = validateWebhookPayload(
      payload,
      webhook.payloadSchema as any
    );
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Payload inválido", details: validation.errors },
        { status: 400 }
      );
    }

    try {
      // Primeiro, verificar se já existe um registro para este webhook
      const existingData = await db.$queryRawUnsafe<any[]>(
        `
        SELECT data 
        FROM "DataWebhook" 
        WHERE id = $1
      `,
        webhookId
      );

      let dataArray = [];

      // Adicionar timestamp ao novo payload para registro
      const payloadWithTimestamp = {
        ...payload,
        receivedAt: new Date().toISOString(),
      };

      // Se já existir dados, adicionar o novo payload ao array existente
      if (existingData && existingData.length > 0) {
        // Se o dado existente não for um array, convertê-lo para array
        if (Array.isArray(existingData[0].data)) {
          dataArray = [...existingData[0].data];
        } else {
          dataArray = [existingData[0].data];
        }

        // Adicionar o novo payload ao array
        dataArray.push(payloadWithTimestamp);
      } else {
        // Criar um novo array com apenas o payload atual
        dataArray = [payloadWithTimestamp];
      }

      // Armazenar os dados atualizados
      await db.$executeRaw`
        INSERT INTO "DataWebhook" ("id", "data", "updatedAt")
        VALUES (${webhookId}, ${JSON.stringify(dataArray)}::jsonb, NOW())
        ON CONFLICT ("id") 
        DO UPDATE SET 
          "data" = ${JSON.stringify(dataArray)}::jsonb,
          "updatedAt" = NOW()
      `;

      // Retornar sucesso
      return NextResponse.json({
        success: true,
        message: "Dados recebidos e armazenados com sucesso",
      });
    } catch (dbError) {
      console.error("Erro ao salvar dados no banco:", dbError);
      return NextResponse.json(
        { error: "Erro ao salvar dados" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
