import { db } from "@/lib/db";
import { Webhook } from "@/lib/generated/prisma";

// Tipos específicos para webhooks
export type WebhookPayloadField = {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description?: string;
};

export type WebhookPayloadSchema = {
  fields: WebhookPayloadField[];
  version: string;
};

export type WebhookHeader = {
  key: string;
  value: string;
};

export type WebhookCreateInput = {
  name: string;
  technicalName: string;
  description?: string;
  secretToken: string;
  events: string[];
  headers?: WebhookHeader[];
  payloadSchema: WebhookPayloadSchema;
  userId: string;
  projectId: string;
};

export type WebhookUpdateInput = Partial<
  Omit<WebhookCreateInput, "userId" | "projectId">
> & {
  isActive?: boolean;
};

// Funções para gerenciar webhooks
export async function createWebhook(
  data: WebhookCreateInput
): Promise<Webhook> {
  // Converter headers para formato JSON
  const headers = data.headers
    ? data.headers.reduce((acc, header) => {
        return { ...acc, [header.key]: header.value };
      }, {})
    : undefined;

  return db.webhook.create({
    data: {
      name: data.name,
      technicalName: data.technicalName,
      description: data.description,
      secretToken: data.secretToken,
      events: data.events,
      headers: headers as any,
      payloadSchema: data.payloadSchema as any,
      userId: data.userId,
      projectId: data.projectId,
    },
  });
}

export async function getWebhookById(id: string): Promise<Webhook | null> {
  return db.webhook.findUnique({
    where: { id },
  });
}

export async function getWebhooksByProject(
  projectId: string
): Promise<Webhook[]> {
  return db.webhook.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWebhooksByUser(userId: string): Promise<Webhook[]> {
  return db.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateWebhook(
  id: string,
  data: WebhookUpdateInput
): Promise<Webhook> {
  // Converter headers para formato JSON se existirem
  const headers = data.headers
    ? data.headers.reduce((acc, header) => {
        return { ...acc, [header.key]: header.value };
      }, {})
    : undefined;

  // Preparar dados para atualização, removendo campos undefined
  const updateData: any = { ...data };
  if (headers) updateData.headers = headers;
  if (data.payloadSchema) updateData.payloadSchema = data.payloadSchema;

  // Remover campos que não pertencem ao modelo
  delete updateData.headers;
  delete updateData.payloadSchema;

  return db.webhook.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteWebhook(id: string): Promise<Webhook> {
  return db.webhook.delete({
    where: { id },
  });
}

// Utilidades para validação de webhooks
export function validateWebhookPayload(
  payload: any,
  schema: WebhookPayloadSchema
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar cada campo do schema
  for (const field of schema.fields) {
    // Verificar se campo obrigatório existe
    if (
      field.required &&
      (payload[field.name] === undefined || payload[field.name] === null)
    ) {
      errors.push(`Campo obrigatório '${field.name}' está ausente`);
      continue;
    }

    // Se o campo existe no payload, validar seu tipo
    if (payload[field.name] !== undefined) {
      const value = payload[field.name];
      let typeValid = false;

      switch (field.type) {
        case "string":
          typeValid = typeof value === "string";
          break;
        case "number":
          typeValid = typeof value === "number";
          break;
        case "boolean":
          typeValid = typeof value === "boolean";
          break;
        case "object":
          typeValid =
            typeof value === "object" &&
            !Array.isArray(value) &&
            value !== null;
          break;
        case "array":
          typeValid = Array.isArray(value);
          break;
      }

      if (!typeValid) {
        errors.push(`Campo '${field.name}' deve ser do tipo '${field.type}'`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Gera uma URL completa para o webhook
export function generateWebhookUrl(
  baseUrl: string,
  projectId: string,
  webhookId: string
): string {
  return `${baseUrl}/api/webhook/${projectId}/${webhookId}`;
}

// Verifica a autenticação do webhook usando o token secreto
export function verifyWebhookAuth(body: any, secretToken: string): boolean {
  return body.keyHook === secretToken;
}
