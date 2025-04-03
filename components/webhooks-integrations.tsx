"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WebhooksList, Webhook } from "@/components/webhooks/webhooks-list"
import { WebhooksDetails } from "@/components/webhooks/webhooks-details"
import { Copy, Eye, ExternalLink, Code, CheckCircle, Terminal, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function WebhooksIntegrations() {
  const { toast } = useToast();
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [activeTab, setActiveTab] = useState("configurados");
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Código copiado!",
      description: "O código de exemplo foi copiado para sua área de transferência."
    });
  };
  
  const handleWebhookSelect = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
  };
  
  return (
    <div className="grid gap-4 grid-cols-7">
      <div className="col-span-7">
        <Tabs defaultValue="configurados" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="configurados">Webhooks Configurados</TabsTrigger>
            <TabsTrigger value="exemplos">Exemplos de Implementação</TabsTrigger>
            <TabsTrigger value="eventos">Eventos Recebidos</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configurados" className="mt-4">
            <div className="grid grid-cols-7 gap-4">
              <div className="col-span-4">
                <WebhooksList onWebhookSelect={handleWebhookSelect} />
              </div>
              
              <div className="col-span-3">
                {selectedWebhook ? (
                  <WebhooksDetails webhook={{
                    ...selectedWebhook,
                    status: selectedWebhook.status === "error" ? "inactive" : selectedWebhook.status,
                    deliveryHistory: [
                      {
                        id: `del_${Math.random().toString(36).substring(2, 10)}`,
                        timestamp: selectedWebhook.lastTriggered || selectedWebhook.createdAt,
                        status: "success",
                        responseCode: 200,
                        responseTime: 345,
                        requestPayload: `{"type":"${selectedWebhook.events[0] || 'event'}","data":{"id":"usr_789"}}`,
                        responsePayload: '{"status":"received"}'
                      },
                      {
                        id: `del_${Math.random().toString(36).substring(2, 10)}`,
                        timestamp: selectedWebhook.lastTriggered ? new Date(new Date(selectedWebhook.lastTriggered).getTime() - 86400000).toISOString() : new Date(Date.now() - 86400000).toISOString(),
                        status: selectedWebhook.failureCount > 0 ? "failed" : "success",
                        responseCode: selectedWebhook.failureCount > 0 ? 500 : 200,
                        responseTime: 1245,
                        requestPayload: `{"type":"${selectedWebhook.events[0] || 'event'}","data":{"id":"usr_790"}}`,
                        responsePayload: selectedWebhook.failureCount > 0 ? '{"error":"Internal server error"}' : '{"status":"received"}',
                        error: selectedWebhook.failureCount > 0 ? "O servidor retornou um erro interno (500)" : undefined
                      }
                    ]
                  }} />
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-3">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">Selecione um webhook</h3>
                    <p className="text-muted-foreground">
                      Escolha um webhook da lista para visualizar detalhes e gerenciar suas configurações
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="exemplos" className="mt-4">
            <div className="grid gap-4 grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Exemplo em JavaScript/React</CardTitle>
                  <CardDescription>
                    Integração simples usando fetch para enviar dados para seu webhook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                    {`// Enviar dados para seu webhook
const sendWebhookData = async (data) => {
  try {
    const response = await fetch(
      'https://api.metrics-saas.com/seu-webhook', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          keyHook: 'sua-chave-secreta'
        })
      }
    );
    
    const result = await response.json();
    console.log('Webhook enviado com sucesso:', result);
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}`}
                  </pre>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => copyToClipboard(`// Enviar dados para seu webhook
const sendWebhookData = async (data) => {
  try {
    const response = await fetch(
      'https://api.metrics-saas.com/seu-webhook', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          keyHook: 'sua-chave-secreta'
        })
      }
    );
    
    const result = await response.json();
    console.log('Webhook enviado com sucesso:', result);
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}`)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Código
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Exemplo em Python</CardTitle>
                  <CardDescription>
                    Integração simples usando requests para enviar dados para seu webhook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                    {`import requests
import json

def send_webhook_data(data):
    webhook_url = "https://api.metrics-saas.com/seu-webhook"
    
    # Adicionar chave de segurança
    payload = data.copy()
    payload["keyHook"] = "sua-chave-secreta"
    
    try:
        response = requests.post(
            webhook_url,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"}
        )
        
        # Verificar se requisição foi bem-sucedida
        response.raise_for_status()
        
        print("Webhook enviado com sucesso!")
        return response.json()
    except Exception as error:
        print(f"Erro ao enviar webhook: {error}")
        return None`}
                  </pre>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => copyToClipboard(`import requests
import json

def send_webhook_data(data):
    webhook_url = "https://api.metrics-saas.com/seu-webhook"
    
    # Adicionar chave de segurança
    payload = data.copy()
    payload["keyHook"] = "sua-chave-secreta"
    
    try:
        response = requests.post(
            webhook_url,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"}
        )
        
        # Verificar se requisição foi bem-sucedida
        response.raise_for_status()
        
        print("Webhook enviado com sucesso!")
        return response.json()
    except Exception as error:
        print(f"Erro ao enviar webhook: {error}")
        return None`)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Código
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="eventos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Eventos Recebidos em Tempo Real</CardTitle>
                <CardDescription>
                  Últimos eventos recebidos através dos seus webhooks configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "evt_123",
                      webhookName: "payment-webhook",
                      data: { userId: 456, itemId: 789, value: "99.90", currency: "BRL" },
                      timestamp: "2023-10-16T15:45:22.000Z",
                      status: "success"
                    },
                    {
                      id: "evt_122",
                      webhookName: "signup-webhook",
                      data: { userId: 455, email: "novo@exemplo.com", plan: "premium" },
                      timestamp: "2023-10-16T15:40:12.000Z",
                      status: "success"
                    },
                    {
                      id: "evt_121",
                      webhookName: "login-webhook",
                      data: { userId: 430, deviceType: "mobile", browser: "chrome" },
                      timestamp: "2023-10-16T15:30:45.000Z",
                      status: "success"
                    }
                  ].map(event => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge className="mb-1">{event.webhookName}</Badge>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={event.status === "success" ? "outline" : "destructive"}>
                          {event.status === "success" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {event.status}
                        </Badge>
                      </div>
                      <pre className="bg-muted mt-2 p-2 rounded-md text-xs font-mono overflow-x-auto">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="docs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentação de Webhooks</CardTitle>
                <CardDescription>
                  Aprenda como implementar e usar webhooks em sua aplicação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">O que são Webhooks?</h3>
                    <p className="text-sm text-muted-foreground">
                      Webhooks são callbacks HTTP que são disparados por eventos específicos em sua aplicação. Eles permitem que você envie dados em tempo real para nossa plataforma, onde eles são processados e transformados em métricas valiosas.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Como implementar?</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-primary w-6 h-6 flex items-center justify-center text-primary-foreground font-medium mt-0.5">1</div>
                        <div>
                          <p className="font-medium">Crie um novo webhook</p>
                          <p className="text-sm text-muted-foreground">
                            Acesse a seção "Webhooks" e crie um novo webhook com um nome técnico que identifique a métrica que deseja rastrear.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-primary w-6 h-6 flex items-center justify-center text-primary-foreground font-medium mt-0.5">2</div>
                        <div>
                          <p className="font-medium">Defina o esquema de dados</p>
                          <p className="text-sm text-muted-foreground">
                            Use nossa interface no-code para definir quais dados seu webhook irá receber.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-primary w-6 h-6 flex items-center justify-center text-primary-foreground font-medium mt-0.5">3</div>
                        <div>
                          <p className="font-medium">Implemente em sua aplicação</p>
                          <p className="text-sm text-muted-foreground">
                            Use os exemplos de código fornecidos para enviar dados para o webhook sempre que o evento ocorrer em sua aplicação.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-primary w-6 h-6 flex items-center justify-center text-primary-foreground font-medium mt-0.5">4</div>
                        <div>
                          <p className="font-medium">Visualize as métricas</p>
                          <p className="text-sm text-muted-foreground">
                            Acesse a seção "Métricas" para visualizar os dados recebidos em tempo real e as análises geradas pela nossa IA.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Documentação Completa
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 