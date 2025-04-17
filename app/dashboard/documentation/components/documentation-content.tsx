"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface DocumentationContentProps {
  activeTab: "webhooks" | "examples";
}

export function DocumentationContent({ activeTab }: DocumentationContentProps) {
  // Renderiza o conteúdo com base na seleção ativa
  const renderContent = () => {
    switch (activeTab) {
      case "webhooks":
        return <WebhooksContent />;
      case "examples":
        return <ExamplesContent />;
      default:
        return <WebhooksContent />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">{renderContent()}</div>
    </div>
  );
}

function ExamplesContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exemplos de Integração</CardTitle>
        <CardDescription>
          Exemplos práticos de como integrar com a plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">
            Rastreamento de Eventos em um E-commerce
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Exemplo de como rastrear eventos de visualização de produto, adição
            ao carrinho e compra.
          </p>
          <div className="mt-2 rounded-md bg-muted p-3">
            <pre className="text-xs">
              {`// Visualização de produto
client.metrics.create({
  event_type: 'product_view',
  source: 'website',
  properties: {
    product_id: '12345',
    product_name: 'Smartphone XYZ',
    category: 'Eletrônicos',
    price: 1999.90
  }
});

// Adição ao carrinho
client.metrics.create({
  event_type: 'add_to_cart',
  source: 'website',
  properties: {
    product_id: '12345',
    product_name: 'Smartphone XYZ',
    quantity: 1,
    price: 1999.90
  }
});

// Compra finalizada
client.metrics.create({
  event_type: 'purchase',
  source: 'website',
  properties: {
    order_id: 'order-789',
    total: 1999.90,
    payment_method: 'credit_card',
    products: [
      {
        product_id: '12345',
        product_name: 'Smartphone XYZ',
        quantity: 1,
        price: 1999.90
      }
    ]
  }
});`}
            </pre>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">
            Configuração de Webhook para Notificações
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Exemplo de como configurar um servidor para receber notificações via
            webhook.
          </p>
          <div className="mt-2 rounded-md bg-muted p-3">
            <pre className="text-xs">
              {`// Exemplo de configuração de Webhook para Notificações
// Função para verificar a assinatura do webhook
function verificarAssinaturaWebhook(payload, signature, secret) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  const calculatedSignature = 'sha256=' + hmac.update(payload).digest('hex');
  return calculatedSignature === signature;
}

// Exemplo de manipulador de webhook
function processarWebhook(req) {
  // Extrair dados da requisição
  const signature = req.headers['x-signature'];
  const payload = JSON.stringify(req.body);
  const secret = 'seu-webhook-secret';
  
  // Verificar assinatura
  if (verificarAssinaturaWebhook(payload, signature, secret)) {
    const event = req.body;
    
    // Processar o evento com base no tipo
    console.log('Evento recebido:', event.type);
    
    switch (event.type) {
      case 'metric.created':
        // Lógica para métrica criada
        return { status: 200, message: 'Métrica processada' };
      case 'alert.triggered':
        // Lógica para alerta disparado
        return { status: 200, message: 'Alerta processado' };
      default:
        return { status: 200, message: 'Evento processado' };
    }
  } else {
    return { status: 401, message: 'Assinatura inválida' };
  }
}
`}
            </pre>
          </div>
        </div>
        <Button variant="link" className="px-0">
          Ver Mais Exemplos <ExternalLink className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function WebhooksContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentação de Webhooks</CardTitle>
        <CardDescription>
          Como configurar e receber notificações via webhooks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Formato de Payload</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Todos os webhooks enviam dados no seguinte formato JSON:
          </p>
          <div className="mt-2 rounded-md bg-muted p-3">
            <pre className="text-xs">
              {`{
  "id": "evt-123456",
  "type": "metric.created",
  "created_at": "2023-01-15T14:32:45Z",
  "data": {
    "id": "metric-123",
    "event_type": "cadastro",
    "timestamp": "2023-01-15T14:32:45Z",
    "source": "website",
    "properties": {
      "user_id": "user-456",
      "referrer": "google.com"
    }
  }
}`}
            </pre>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Verificação de Assinatura</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Para garantir a autenticidade das notificações, cada webhook inclui
            um cabeçalho de assinatura:
          </p>
          <div className="mt-2 rounded-md bg-muted p-3">
            <pre className="text-xs">
              {`X-Signature: sha256=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce7b91d6fad`}
            </pre>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Você deve verificar esta assinatura usando sua chave secreta:
          </p>
          <div className="mt-2 rounded-md bg-muted p-3">
            <pre className="text-xs">
              {`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const calculatedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}`}
            </pre>
          </div>
        </div>
        <Button variant="link" className="px-0">
          Ver Documentação Completa <ExternalLink className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
