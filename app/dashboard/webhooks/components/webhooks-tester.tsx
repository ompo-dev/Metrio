"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LoaderIcon,
  Check,
  Copy,
  ArrowLeft,
  ArrowRight,
  GitCompareArrows,
  Play,
  Code2,
  Wrench,
  Activity,
  RefreshCw,
  X as XIcon,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreadcrumbSelect } from "@/components/breadcrumb-select/breadcrumb-select";
import Link from "next/link";

// Tipos de dados
type EventCategory = "users" | "payments" | "products" | "system";

interface EventTemplate {
  id: string;
  category: EventCategory;
  name: string;
  description: string;
  payload: Record<string, any>;
}

interface DeliveryResult {
  id: string;
  timestamp: string;
  url: string;
  status: "success" | "failure" | "pending";
  statusCode?: number;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  duration?: number;
  error?: string;
}

// Exemplos de eventos
const eventTemplates: EventTemplate[] = [
  {
    id: "template_user_created",
    category: "users",
    name: "user.created",
    description: "Enviado quando um novo usuário é cadastrado",
    payload: {
      id: "evt_123456789",
      type: "user.created",
      created_at: new Date().toISOString(),
      data: {
        id: "usr_987654321",
        name: "João Silva",
        email: "joao@exemplo.com",
        created_at: new Date().toISOString(),
      },
    },
  },
  {
    id: "template_user_updated",
    category: "users",
    name: "user.updated",
    description: "Enviado quando os dados de um usuário são atualizados",
    payload: {
      id: "evt_123456790",
      type: "user.updated",
      created_at: new Date().toISOString(),
      data: {
        id: "usr_987654321",
        name: "João Silva Santos",
        email: "joao@exemplo.com",
        updated_at: new Date().toISOString(),
      },
    },
  },
  {
    id: "template_payment_succeeded",
    category: "payments",
    name: "payment.succeeded",
    description: "Enviado quando um pagamento é aprovado",
    payload: {
      id: "evt_123456791",
      type: "payment.succeeded",
      created_at: new Date().toISOString(),
      data: {
        id: "pay_987654322",
        amount: 199.9,
        currency: "BRL",
        status: "paid",
        customer_id: "usr_987654321",
        payment_method: "credit_card",
        created_at: new Date().toISOString(),
      },
    },
  },
  {
    id: "template_payment_failed",
    category: "payments",
    name: "payment.failed",
    description: "Enviado quando um pagamento falha",
    payload: {
      id: "evt_123456792",
      type: "payment.failed",
      created_at: new Date().toISOString(),
      data: {
        id: "pay_987654323",
        amount: 299.9,
        currency: "BRL",
        status: "failed",
        customer_id: "usr_987654321",
        payment_method: "credit_card",
        error: {
          code: "card_declined",
          message: "Cartão recusado pela operadora",
        },
        created_at: new Date().toISOString(),
      },
    },
  },
  {
    id: "template_product_created",
    category: "products",
    name: "product.created",
    description: "Enviado quando um novo produto é cadastrado",
    payload: {
      id: "evt_123456793",
      type: "product.created",
      created_at: new Date().toISOString(),
      data: {
        id: "prod_987654324",
        name: "Produto Premium",
        description: "Descrição do produto premium",
        price: 99.9,
        currency: "BRL",
        active: true,
        created_at: new Date().toISOString(),
      },
    },
  },
];

// Componente principal
export function WebhooksTester() {
  const [activeTab, setActiveTab] = useState("test");
  const [url, setUrl] = useState("");
  const [authHeader, setAuthHeader] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [useSignature, setUseSignature] = useState(true);
  const [payload, setPayload] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<DeliveryResult | null>(
    null
  );
  const [eventHistory, setEventHistory] = useState<DeliveryResult[]>([]);

  // Função para obter o ícone ativo com base na visualização selecionada
  const getActiveIcon = () => {
    switch (activeTab) {
      case "test":
        return <Play className="h-4 w-4" />;
      case "sandbox":
        return <GitCompareArrows className="h-4 w-4" />;
      case "implement":
        return <Code2 className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  // Função para selecionar um template de evento
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = eventTemplates.find((t) => t.id === templateId);
    if (template) {
      setPayload(JSON.stringify(template.payload, null, 2));
    }
  };

  // Função para testar o webhook
  const testWebhook = () => {
    // Validações básicas
    if (!url || !payload) {
      return;
    }

    setIsLoading(true);

    // Simular uma requisição com atraso
    setTimeout(() => {
      try {
        // Simular sucesso ou falha aleatoriamente
        const isSuccess = Math.random() > 0.3;

        // Construir resultado da entrega
        const result: DeliveryResult = {
          id: `test_${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          url,
          status: isSuccess ? "success" : "failure",
          statusCode: isSuccess ? 200 : 500,
          requestHeaders: {
            "Content-Type": "application/json",
            "User-Agent": "MetricsSaaS-Webhook-Tester/1.0",
            ...(authHeader ? { Authorization: authHeader } : {}),
            ...(useSignature
              ? {
                  "X-Webhook-Signature": `sha256=${Math.random()
                    .toString(36)
                    .substring(2, 15)}`,
                }
              : {}),
          },
          requestBody: payload,
          duration: Math.floor(Math.random() * 500) + 100, // Entre 100ms e 600ms
        };

        if (isSuccess) {
          result.responseHeaders = {
            "Content-Type": "application/json",
            Server: "nginx/1.18.0",
          };
          result.responseBody = JSON.stringify(
            {
              success: true,
              message: "Event received successfully",
            },
            null,
            2
          );
        } else {
          result.responseHeaders = {
            "Content-Type": "application/json",
            Server: "nginx/1.18.0",
          };
          result.responseBody = JSON.stringify(
            {
              success: false,
              error: "Internal server error",
            },
            null,
            2
          );
          result.error =
            "O servidor retornou um erro 500 Internal Server Error";
        }

        setDeliveryResult(result);
        setEventHistory((prev) => [result, ...prev]);
      } catch (error) {
        // Caso um erro real ocorra
        const result: DeliveryResult = {
          id: `test_${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          url,
          status: "failure",
          requestHeaders: {
            "Content-Type": "application/json",
            "User-Agent": "MetricsSaaS-Webhook-Tester/1.0",
            ...(authHeader ? { Authorization: authHeader } : {}),
            ...(useSignature
              ? {
                  "X-Webhook-Signature": `sha256=${Math.random()
                    .toString(36)
                    .substring(2, 15)}`,
                }
              : {}),
          },
          requestBody: payload,
          error:
            error instanceof Error
              ? error.message
              : "Ocorreu um erro ao processar a requisição",
        };

        setDeliveryResult(result);
        setEventHistory((prev) => [result, ...prev]);
      } finally {
        setIsLoading(false);
      }
    }, 1500); // Simula a latência da rede
  };

  // Função para copiar código para o clipboard
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Gera um código de exemplo para implementação
  const generateCodeSample = (language: string) => {
    const payloadObj = payload
      ? JSON.parse(payload)
      : { type: "event.type", data: {} };

    switch (language) {
      case "javascript":
        return `// JavaScript/Node.js usando fetch
fetch('${url}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ${authHeader ? `'Authorization': '${authHeader}',` : ""}
    ${useSignature ? `'X-Webhook-Signature': 'sha256=seu_token_secreto',` : ""}
  },
  body: JSON.stringify(${JSON.stringify(payloadObj, null, 2)})
})
.then(response => response.json())
.then(data => console.log('Sucesso:', data))
.catch((error) => console.error('Erro:', error));`;

      case "php":
        return `<?php
// PHP usando cURL
$data = ${JSON.stringify(payloadObj, null, 2)};

$ch = curl_init('${url}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  ${authHeader ? `'Authorization: ${authHeader}',` : ""}
  ${useSignature ? `'X-Webhook-Signature: sha256=seu_token_secreto',` : ""}
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: " . $httpCode . "\\n";
echo "Resposta: " . $response . "\\n";
?>`;

      case "python":
        return `# Python usando requests
import requests
import json

url = '${url}'
payload = ${JSON.stringify(payloadObj, null, 2)}

headers = {
    'Content-Type': 'application/json',
    ${authHeader ? `'Authorization': '${authHeader}',` : ""}
    ${useSignature ? `'X-Webhook-Signature': 'sha256=seu_token_secreto',` : ""}
}

response = requests.post(url, json=payload, headers=headers)
print(f'Status: {response.status_code}')
print(f'Resposta: {response.text}')`;

      default:
        return "// Selecione uma linguagem para ver o código de exemplo";
    }
  };

  // Renderiza o conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case "test":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Teste</CardTitle>
                <CardDescription>
                  Configure as opções para testar seu webhook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://seu-site.com/webhook"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL completa que receberá a requisição POST com os dados
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-header">
                    Cabeçalho de Autenticação (opcional)
                  </Label>
                  <Input
                    id="auth-header"
                    placeholder="Bearer seu_token_aqui"
                    value={authHeader}
                    onChange={(e) => setAuthHeader(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="use-signature"
                    checked={useSignature}
                    onCheckedChange={setUseSignature}
                  />
                  <Label htmlFor="use-signature">
                    Incluir assinatura do webhook
                  </Label>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Selecione um Evento</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um template de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">
                        Evento personalizado
                      </SelectItem>
                      {eventTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} - {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="payload">Payload (JSON)</Label>
                  <Textarea
                    id="payload"
                    className="font-mono text-xs h-56"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder='{"type":"event.type","data":{"key":"value"}}'
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={testWebhook}
                  disabled={isLoading || !url || !payload}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                      Enviando Webhook...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Enviar Webhook de Teste
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resultado do Teste</CardTitle>
                  <CardDescription>
                    {deliveryResult
                      ? `Enviado em ${new Date(
                          deliveryResult.timestamp
                        ).toLocaleString()}`
                      : "Envie um webhook para ver o resultado"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deliveryResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">Status:</h3>
                          {deliveryResult.status === "success" ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" /> Sucesso
                            </Badge>
                          ) : (
                            <Badge className="bg-red-50 text-red-700 border-red-200">
                              <XIcon className="h-3 w-3 mr-1" /> Falha
                            </Badge>
                          )}
                        </div>

                        {deliveryResult.statusCode && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-mono",
                              deliveryResult.statusCode >= 200 &&
                                deliveryResult.statusCode < 300
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            )}
                          >
                            HTTP {deliveryResult.statusCode}
                          </Badge>
                        )}
                      </div>

                      {deliveryResult.duration && (
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">Duração:</h3>
                          <span>{deliveryResult.duration}ms</span>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium mb-1">URL:</h3>
                        <p className="text-xs font-mono truncate bg-muted p-2 rounded">
                          {deliveryResult.url}
                        </p>
                      </div>

                      <Tabs defaultValue="request">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="request">Requisição</TabsTrigger>
                          <TabsTrigger value="response">Resposta</TabsTrigger>
                        </TabsList>

                        <TabsContent value="request" className="space-y-4 mt-2">
                          <div>
                            <h3 className="text-sm font-medium mb-1">
                              Headers:
                            </h3>
                            <div className="bg-muted p-2 rounded max-h-32 overflow-auto">
                              <pre className="text-xs">
                                {JSON.stringify(
                                  deliveryResult.requestHeaders,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Body:</h3>
                            <div className="bg-muted p-2 rounded max-h-64 overflow-auto">
                              <pre className="text-xs">
                                {deliveryResult.requestBody}
                              </pre>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent
                          value="response"
                          className="space-y-4 mt-2"
                        >
                          {deliveryResult.status === "success" ||
                          (deliveryResult.status === "failure" &&
                            deliveryResult.responseBody) ? (
                            <>
                              <div>
                                <h3 className="text-sm font-medium mb-1">
                                  Headers:
                                </h3>
                                <div className="bg-muted p-2 rounded max-h-32 overflow-auto">
                                  <pre className="text-xs">
                                    {JSON.stringify(
                                      deliveryResult.responseHeaders,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium mb-1">
                                  Body:
                                </h3>
                                <div className="bg-muted p-2 rounded max-h-64 overflow-auto">
                                  <pre className="text-xs">
                                    {deliveryResult.responseBody}
                                  </pre>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="py-12 text-center">
                              <p className="text-muted-foreground">
                                {deliveryResult.error ||
                                  "Nenhuma resposta recebida"}
                              </p>
                            </div>
                          )}

                          {deliveryResult.error && (
                            <div>
                              <h3 className="text-sm font-medium mb-1 text-red-500">
                                Erro:
                              </h3>
                              <div className="bg-red-50 text-red-700 p-2 rounded">
                                <p className="text-xs">
                                  {deliveryResult.error}
                                </p>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">
                        Nenhum teste enviado
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        Configure e envie um webhook de teste para ver os
                        resultados
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {eventHistory.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle>Histórico de Testes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-64">
                      <div className="divide-y">
                        {eventHistory.map((result) => (
                          <div
                            key={result.id}
                            className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setDeliveryResult(result)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono">
                                {result.id}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  result.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className="text-xs truncate max-w-[180px]"
                                title={result.url}
                              >
                                {result.url}
                              </span>
                              {result.status === "success" ? (
                                <Badge
                                  className="bg-green-50 text-green-700 border-green-200"
                                  variant="outline"
                                >
                                  {result.statusCode}
                                </Badge>
                              ) : (
                                <Badge
                                  className="bg-red-50 text-red-700 border-red-200"
                                  variant="outline"
                                >
                                  {result.statusCode || "Erro"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="py-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setEventHistory([])}
                    >
                      Limpar histórico
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        );
      case "sandbox":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sandbox para Testes</CardTitle>
              <CardDescription>
                Ambiente simulado para testar seus webhooks sem precisar
                configurar um servidor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
                  <h3 className="flex items-center text-base font-medium mb-2">
                    <Wrench className="h-4 w-4 mr-2 text-primary" />
                    Seu Endpoint Sandbox
                  </h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background p-2 rounded text-sm font-mono">
                      https://sandbox.metricassaas.com/webhooks/test-
                      {Math.random().toString(36).substring(2, 10)}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {}}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copiar URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Este endpoint está ativo por 24 horas e irá armazenar os
                    últimos 50 webhooks recebidos.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">
                      Como usar o Sandbox
                    </h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          1
                        </span>
                        <p>Copie o endpoint sandbox gerado acima</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          2
                        </span>
                        <p>
                          Configure este endpoint no seu sistema ou aplicação
                        </p>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          3
                        </span>
                        <p>
                          Acione eventos no seu sistema que disparem webhooks
                        </p>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          4
                        </span>
                        <p>Verifique na tabela ao lado os eventos recebidos</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          5
                        </span>
                        <p>Clique nos eventos para ver detalhes completos</p>
                      </li>
                    </ol>

                    <div className="mt-6 p-3 border rounded-md bg-amber-50 border-amber-200 text-sm">
                      <h4 className="font-medium text-amber-800 mb-1">
                        Ambiente seguro
                      </h4>
                      <p className="text-amber-700 text-xs">
                        O sandbox é um ambiente isolado e seguro. Nenhum webhook
                        enviado para cá será encaminhado para sistemas externos.
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-3 border-b">
                      <h3 className="text-sm font-medium">
                        Webhooks Recebidos
                      </h3>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">0</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-8 text-center">
                      <File className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">
                        Nenhum webhook recebido ainda
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Configure o URL do sandbox no seu sistema e acione
                        eventos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "implement":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Exemplos de Implementação</CardTitle>
              <CardDescription>
                Código pronto para usar em diferentes linguagens de programação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>URL do Webhook</Label>
                  <Input
                    placeholder="https://seu-site.com/webhook"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payload de Exemplo</Label>
                  <Textarea
                    className="font-mono text-xs h-40"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder='{"type":"event.type","data":{"key":"value"}}'
                  />
                </div>

                <Tabs defaultValue="javascript">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>

                  <TabsContent value="javascript" className="mt-2">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono">
                        {generateCodeSample("javascript")}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyCode(generateCodeSample("javascript"))
                        }
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copiar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="php" className="mt-2">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono">
                        {generateCodeSample("php")}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode(generateCodeSample("php"))}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copiar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="python" className="mt-2">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono">
                        {generateCodeSample("python")}
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode(generateCodeSample("python"))}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copiar
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-muted/50 p-4 rounded-md text-sm mt-4 border">
                  <h3 className="font-medium mb-2">Dicas de Implementação</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <p>Configure timeouts de ao menos 10 segundos</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <p>
                        Retorne 200 OK assim que o webhook for recebido, mesmo
                        que o processamento seja assíncrono
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <p>
                        Verifique a assinatura do webhook para garantir que os
                        dados são legítimos
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <p>
                        Implemente tratamento de idempotência para evitar
                        duplicação
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Teste e Depuração de Webhooks</h1>
          <div className="ml-2">
            <BreadcrumbSelect
              items={[
                {
                  icon: getActiveIcon(),
                  isSelect: true,
                  label: "Visualização",
                  selectProps: {
                    defaultValue: activeTab,
                    options: [
                      { value: "test", label: "Test Runner" },
                      { value: "sandbox", label: "Sandbox" },
                      { value: "implement", label: "Implementação" },
                    ],
                    onChange: (value) => {
                      setActiveTab(value);
                    },
                  },
                },
              ]}
            />
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/webhooks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex justify-end gap-2 md:hidden">
        <Button
          variant={activeTab === "test" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("test")}
        >
          <Play className="h-4 w-4 mr-2" />
          Test Runner
        </Button>
        <Button
          variant={activeTab === "sandbox" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("sandbox")}
        >
          <GitCompareArrows className="h-4 w-4 mr-2" />
          Sandbox
        </Button>
        <Button
          variant={activeTab === "implement" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("implement")}
        >
          <Code2 className="h-4 w-4 mr-2" />
          Implementação
        </Button>
      </div>

      {renderContent()}
    </div>
  );
}
