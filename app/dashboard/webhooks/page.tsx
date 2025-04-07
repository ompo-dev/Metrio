"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebhooksHeader } from "@/components/webhooks/webhooks-header"
import { WebhooksList, Webhook as WebhookFromList } from "@/components/webhooks/webhooks-list"
import { WebhooksMonitor } from "@/components/webhooks/webhooks-monitor"
import { WebhooksLogs } from "@/components/webhooks/webhooks-logs"
import { WebhooksDetails } from "@/components/webhooks/webhooks-details"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Activity, AlertCircle, BookOpen, Clock, 
  FileText, Heart, Server, ShieldCheck, Webhook,
  Wrench, Globe, Zap, PlusCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Tipo para o componente WebhooksDetails
type DeliveryRecord = {
  id: string
  timestamp: string
  status: "success" | "failed"
  responseCode?: number
  responseTime: number
  requestPayload: string
  responsePayload?: string
  error?: string
}

type WebhookDetails = {
  id: string
  name: string
  url: string
  status: "active" | "inactive"
  events: string[]
  createdAt: string
  lastTriggered?: string
  secret: string
  description?: string
  deliveryHistory: DeliveryRecord[]
}

export default function WebhooksPage() {
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookDetails | null>(null);

  // Função para converter string de data no formato DD/MM/YYYY para objeto Date
  const parseDate = (dateString: string): Date => {
    try {
      // Verifica se a data está no formato DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // month é 0-indexed em JS Date
      }
      // Tenta o formato padrão ISO
      const date = new Date(dateString);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return new Date(); // Retorna data atual como fallback
      }
      
      return date;
    } catch (error) {
      console.error("Erro ao processar data:", error);
      return new Date(); // Retorna data atual como fallback
    }
  };

  const handleWebhookSelect = (webhook: WebhookFromList) => {
    // Use datas seguras garantindo que sempre são objetos Date válidos
    const now = new Date();
    
    let lastTriggeredDate: Date;
    try {
      // Tenta obter a data do último disparo ou criação
      if (webhook.lastTriggered) {
        lastTriggeredDate = parseDate(webhook.lastTriggered);
      } else {
        lastTriggeredDate = parseDate(webhook.createdAt);
      }
      
      // Verificação adicional para garantir que é uma data válida
      if (isNaN(lastTriggeredDate.getTime())) {
        lastTriggeredDate = now;
      }
    } catch (error) {
      console.error("Erro ao processar datas do webhook:", error);
      lastTriggeredDate = now; // Usa a data atual como fallback
    }
    
    // Data de um dia atrás (com segurança)
    const oneDayBefore = new Date(now.getTime() - 86400000); // 24h em milissegundos
    
    // Converte o webhook da lista para o formato esperado pelo componente de detalhes
    const webhookForDetails: WebhookDetails = {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      status: webhook.status === "error" ? "inactive" : webhook.status,
      events: webhook.events,
      createdAt: webhook.createdAt,
      lastTriggered: webhook.lastTriggered,
      secret: webhook.secret,
      description: webhook.description || `Webhook para ${webhook.name}`,
      deliveryHistory: [
        {
          id: `del_${Math.random().toString(36).substring(2, 10)}`,
          timestamp: now.toISOString(), // Usa 'now' que é garantidamente válido
          status: "success",
          responseCode: 200,
          responseTime: 345,
          requestPayload: `{"type":"${webhook.events[0] || 'event'}","data":{"id":"usr_789"}}`,
          responsePayload: '{"status":"received"}'
        },
        {
          id: `del_${Math.random().toString(36).substring(2, 10)}`,
          timestamp: oneDayBefore.toISOString(), // Usa oneDayBefore que é garantidamente válido
          status: webhook.failureCount > 0 ? "failed" : "success",
          responseCode: webhook.failureCount > 0 ? 500 : 200,
          responseTime: 1245,
          requestPayload: `{"type":"${webhook.events[0] || 'event'}","data":{"id":"usr_790"}}`,
          responsePayload: webhook.failureCount > 0 ? '{"error":"Internal server error"}' : '{"status":"received"}',
          error: webhook.failureCount > 0 ? "O servidor retornou um erro interno (500)" : undefined
        }
      ]
    };
    
    setSelectedWebhook(webhookForDetails);
  };

  return (
    <div className="flex flex-col gap-5">
      <WebhooksHeader />
      
      <Tabs defaultValue="manage" className="space-y-5">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="manage">Gerenciar Webhooks</TabsTrigger>
          <TabsTrigger value="monitor">Monitoramento</TabsTrigger>
          <TabsTrigger value="logs">Logs de Eventos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
            <Card className="col-span-3 row-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Webhooks Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">de 5 configurados</div>
                  <Badge className="ml-auto" variant="secondary">Saudáveis</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3 row-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Eventos Entregues (últimas 24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold">189</div>
                  <div className="flex items-center text-xs text-emerald-500">
                    <span className="i-lucide-trending-up h-3 w-3 mr-1" />
                    12.4%
                  </div>
                  <Badge className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200">Taxa de sucesso: 98.7%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-7 gap-5">
            <div className="md:col-span-4">
              <WebhooksList onWebhookSelect={handleWebhookSelect} />
              
              <Card className="mt-5">
                <CardHeader>
                  <CardTitle className="text-base">Webhooks Populares</CardTitle>
                  <CardDescription>Integrações comuns que você pode configurar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-3 px-4 justify-start">
                      <div className="mr-3 rounded-full bg-blue-100 p-1.5">
                        <Webhook className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium">GitHub</span>
                        <span className="text-xs text-muted-foreground">Sincronize com seu repositório</span>
                      </div>
                      <Badge className="ml-auto text-xs" variant="outline">UUID: gh73fhs8</Badge>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 px-4 justify-start">
                      <div className="mr-3 rounded-full bg-amber-100 p-1.5">
                        <Activity className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium">Slack</span>
                        <span className="text-xs text-muted-foreground">Envie eventos para seu canal</span>
                      </div>
                      <Badge className="ml-auto text-xs" variant="outline">UUID: sl47dk9p</Badge>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 px-4 justify-start">
                      <div className="mr-3 rounded-full bg-green-100 p-1.5">
                        <Server className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium">Zapier</span>
                        <span className="text-xs text-muted-foreground">Crie automações poderosas</span>
                      </div>
                      <Badge className="ml-auto text-xs" variant="outline">UUID: za91nv2r</Badge>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 px-4 justify-start">
                      <div className="mr-3 rounded-full bg-purple-100 p-1.5">
                        <ShieldCheck className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium">Discord</span>
                        <span className="text-xs text-muted-foreground">Notificações em tempo real</span>
                      </div>
                      <Badge className="ml-auto text-xs" variant="outline">UUID: di65ks3t</Badge>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-3 px-4 justify-start col-span-2" asChild>
                      <Link href="/dashboard/webhooks/new">
                        <div className="mr-3 rounded-full bg-indigo-100 p-1.5">
                          <Globe className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-medium">Personalizado</span>
                          <span className="text-xs text-muted-foreground">Crie webhooks customizados com UUIDs únicos</span>
                        </div>
                        <PlusCircle className="ml-auto h-5 w-5 text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <div className="space-y-5">
                {selectedWebhook ? (
                  <WebhooksDetails webhook={selectedWebhook} />
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">Selecione um webhook</h3>
                    <p className="text-muted-foreground">
                      Escolha um webhook da lista para visualizar detalhes e gerenciar suas configurações
                    </p>
                  </div>
                )}
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Dicas rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p>Use <strong>variáveis de ambiente</strong> para gerenciar suas chaves secretas e UUIDs de webhooks.</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p>Configure <strong>nomes técnicos</strong> para facilitar a referência aos UUIDs dos webhooks no seu código.</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p>Consulte nossa <strong>documentação</strong> para melhores práticas na integração de webhooks.</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p>Utilize o <strong>SDK personalizado</strong> para simplificar a implementação dos webhooks em seu projeto.</p>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="ml-6 h-7 text-xs px-2">
                        Ver mais dicas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="monitor">
          <WebhooksMonitor />
        </TabsContent>
        
        <TabsContent value="logs">
          <WebhooksLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}

