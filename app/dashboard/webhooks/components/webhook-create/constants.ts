import { Code, Rocket, Webhook } from "lucide-react";
import { EventCategory, WebhookTemplate } from "./types";
import React from "react";

// Templates de webhooks pré-configurados
export const webhookTemplates: WebhookTemplate[] = [
  {
    id: "user-events",
    title: "Eventos de Usuários",
    description:
      "Receba notificações sobre criação, atualização e remoção de usuários.",
    events: ["user.created", "user.updated", "user.deleted"],
    icon: React.createElement(Webhook, { className: "h-5 w-5 text-blue-500" }),
    schema: `[{
  "userId": "number",
  "action": "string",
  "timestamp": "string",
  "data": "object",
  "keyHook": "string"
}]`,
  },
  {
    id: "payment-events",
    title: "Eventos de Pagamentos",
    description:
      "Receba notificações sobre pagamentos, reembolsos e falhas de transação.",
    events: ["payment.succeeded", "payment.failed", "payment.refunded"],
    icon: React.createElement(Rocket, { className: "h-5 w-5 text-green-500" }),
    schema: `[{
  "userId": "number",
  "value": "string",
  "currency": "string",
  "itemId": "number",
  "status": "string",
  "keyHook": "string"
}]`,
  },
  {
    id: "product-events",
    title: "Eventos de Produtos",
    description:
      "Receba notificações sobre criação e atualização de produtos no catálogo.",
    events: ["product.created", "product.updated", "product.deleted"],
    icon: React.createElement(Code, { className: "h-5 w-5 text-purple-500" }),
    schema: `[{
  "productId": "number",
  "name": "string",
  "price": "string",
  "action": "string",
  "keyHook": "string"
}]`,
  },
];

// Todos os eventos disponíveis para seleção
export const availableEvents: EventCategory[] = [
  {
    category: "Usuários",
    events: [
      "user.created",
      "user.updated",
      "user.deleted",
      "user.login",
      "user.logout",
    ],
  },
  {
    category: "Pagamentos",
    events: [
      "payment.succeeded",
      "payment.failed",
      "payment.refunded",
      "payment.pending",
      "subscription.created",
      "subscription.cancelled",
    ],
  },
  {
    category: "Produtos",
    events: [
      "product.created",
      "product.updated",
      "product.deleted",
      "product.stock.updated",
    ],
  },
  {
    category: "Sistema",
    events: ["system.error", "system.notification", "system.maintenance"],
  },
];
