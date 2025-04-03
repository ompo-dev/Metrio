"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ClockIcon, FileClock, FileWarning, Gauge, HistoryIcon, RefreshCw, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart } from "@tremor/react"

// Tipo para um evento do webhook
type WebhookEvent = {
  id: string
  webhookId: string
  webhookName: string
  event: string
  status: "success" | "failed" | "retrying" | "pending"
  statusCode?: number
  url: string
  attempt: number
  maxAttempts: number
  requestPayload: string
  responseBody?: string
  createdAt: string
  completedAt?: string
  nextRetry?: string
  executionTimeMs?: number
  error?: string
}

// Dados de exemplo para a demonstração
const mockDeliveryHistory: WebhookEvent[] = [
  {
    id: "evt_123456789",
    webhookId: "wh_1",
    webhookName: "Notificações de Usuários",
    event: "user.created",
    status: "success",
    statusCode: 200,
    url: "https://api.exemplo.com/webhooks/usuario",
    attempt: 1,
    maxAttempts: 5,
    requestPayload: '{"type":"user.created","data":{"id":"usr_123","name":"João Silva","email":"joao@exemplo.com"}}',
    responseBody: '{"status":"received"}',
    createdAt: "2023-06-15T14:30:00Z",
    completedAt: "2023-06-15T14:30:01Z",
    executionTimeMs: 230
  },
  {
    id: "evt_987654321",
    webhookId: "wh_2",
    webhookName: "Notificações de Pagamentos",
    event: "payment.succeeded",
    status: "failed",
    statusCode: 500,
    url: "https://api.exemplo.com/webhooks/pagamentos",
    attempt: 3,
    maxAttempts: 5,
    requestPayload: '{"type":"payment.succeeded","data":{"id":"pay_456","amount":199.90,"status":"paid"}}',
    responseBody: '{"error":"Internal Server Error"}',
    createdAt: "2023-06-15T15:45:00Z",
    completedAt: "2023-06-15T15:45:02Z",
    executionTimeMs: 1230,
    error: "O servidor retornou um erro interno",
    nextRetry: "2023-06-15T16:45:00Z"
  },
  {
    id: "evt_456789123",
    webhookId: "wh_1",
    webhookName: "Notificações de Usuários",
    event: "user.updated",
    status: "retrying",
    url: "https://api.exemplo.com/webhooks/usuario",
    attempt: 2,
    maxAttempts: 5,
    requestPayload: '{"type":"user.updated","data":{"id":"usr_456","name":"Maria Souza","email":"maria@exemplo.com"}}',
    createdAt: "2023-06-15T16:20:00Z",
    nextRetry: "2023-06-15T17:20:00Z"
  },
  {
    id: "evt_789123456",
    webhookId: "wh_3",
    webhookName: "Notificações de Produtos",
    event: "product.created",
    status: "pending",
    url: "https://api.exemplo.com/webhooks/produtos",
    attempt: 0,
    maxAttempts: 5,
    requestPayload: '{"type":"product.created","data":{"id":"prod_789","name":"Produto Novo","price":59.90}}',
    createdAt: "2023-06-15T16:30:00Z"
  },
  {
    id: "evt_654321987",
    webhookId: "wh_2",
    webhookName: "Notificações de Pagamentos",
    event: "payment.refunded",
    status: "success",
    statusCode: 200,
    url: "https://api.exemplo.com/webhooks/pagamentos",
    attempt: 1,
    maxAttempts: 5,
    requestPayload: '{"type":"payment.refunded","data":{"id":"pay_789","amount":99.90,"status":"refunded"}}',
    responseBody: '{"status":"received"}',
    createdAt: "2023-06-15T14:00:00Z",
    completedAt: "2023-06-15T14:00:01Z",
    executionTimeMs: 180
  }
]

// Dados para os gráficos
const deliveryStatusData = [
  { date: "15/06", success: 45, failed: 5, retry: 8 },
  { date: "16/06", success: 56, failed: 3, retry: 4 },
  { date: "17/06", success: 48, failed: 7, retry: 9 },
  { date: "18/06", success: 61, failed: 2, retry: 3 },
  { date: "19/06", success: 53, failed: 6, retry: 5 },
  { date: "20/06", success: 68, failed: 4, retry: 2 },
  { date: "21/06", success: 73, failed: 1, retry: 1 }
]

const responseTimeData = [
  { date: "15/06", "Tempo médio (ms)": 245 },
  { date: "16/06", "Tempo médio (ms)": 321 },
  { date: "17/06", "Tempo médio (ms)": 278 },
  { date: "18/06", "Tempo médio (ms)": 198 },
  { date: "19/06", "Tempo médio (ms)": 234 },
  { date: "20/06", "Tempo médio (ms)": 187 },
  { date: "21/06", "Tempo médio (ms)": 210 }
]

export function WebhooksMonitor() {
  const [selectedWebhook, setSelectedWebhook] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("7d")
  
  // Estatísticas de resumo - poderiam vir da API
  const stats = {
    totalDelivered: 354,
    successRate: 92.7,
    avgResponseTime: 231,
    failureRate: 7.3,
    currentQueue: 3
  }
  
  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Monitoramento de Webhooks</h2>
          <p className="text-muted-foreground">Acompanhe o desempenho e histórico de entrega dos seus webhooks</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedWebhook} onValueChange={setSelectedWebhook}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por webhook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os webhooks</SelectItem>
              <SelectItem value="wh_1">Notificações de Usuários</SelectItem>
              <SelectItem value="wh_2">Notificações de Pagamentos</SelectItem>
              <SelectItem value="wh_3">Notificações de Produtos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Entregas Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalDelivered}</div>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">No período selecionado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <div>
                <Progress value={stats.successRate} className="h-2 w-16" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">{stats.successRate}%</span> entregues com sucesso
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Tempo de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Média no período</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Na Fila</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.currentQueue}</div>
              <ClockIcon className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Eventos aguardando entrega</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="deliveries">Histórico de Entregas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4" />
                  Entregas por Status
                </CardTitle>
                <CardDescription>
                  Status das entregas de webhook nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={deliveryStatusData}
                  index="date"
                  categories={["success", "failed", "retry"]}
                  colors={["emerald", "rose", "amber"]}
                  valueFormatter={(number: number) => `${number} eventos`}
                  yAxisWidth={40}
                  showLegend={true}
                  showAnimation={true}
                  className="h-64"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileClock className="h-4 w-4" />
                  Tempo de Resposta
                </CardTitle>
                <CardDescription>
                  Tempo médio de resposta nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={responseTimeData}
                  index="date"
                  categories={["Tempo médio (ms)"]}
                  colors={["indigo"]}
                  valueFormatter={(number: number) => `${number} ms`}
                  yAxisWidth={40}
                  showLegend={true}
                  showAnimation={true}
                  className="h-64"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HistoryIcon className="h-4 w-4" />
                Histórico de Entregas de Webhook
              </CardTitle>
              <CardDescription>
                Registro detalhado das tentativas de entrega de eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="py-2 px-4 text-left font-medium">Evento</th>
                        <th className="py-2 px-4 text-left font-medium">Webhook</th>
                        <th className="py-2 px-4 text-left font-medium">Status</th>
                        <th className="py-2 px-4 text-left font-medium">Tentativa</th>
                        <th className="py-2 px-4 text-left font-medium">Data</th>
                        <th className="py-2 px-4 text-left font-medium">Tempo</th>
                        <th className="py-2 px-4 text-left font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockDeliveryHistory.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">{delivery.event}</td>
                          <td className="py-2 px-4">{delivery.webhookName}</td>
                          <td className="py-2 px-4">
                            {delivery.status === "success" && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Sucesso
                              </Badge>
                            )}
                            {delivery.status === "failed" && (
                              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Falha
                              </Badge>
                            )}
                            {delivery.status === "retrying" && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Reenvio
                              </Badge>
                            )}
                            {delivery.status === "pending" && (
                              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Pendente
                              </Badge>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {delivery.attempt} / {delivery.maxAttempts}
                          </td>
                          <td className="py-2 px-4">
                            {new Date(delivery.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4">
                            {delivery.executionTimeMs ? `${delivery.executionTimeMs}ms` : "-"}
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileWarning className="h-4 w-4" />
                              </Button>
                              {(delivery.status === "failed" || delivery.status === "retrying") && (
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WebhooksMonitor 