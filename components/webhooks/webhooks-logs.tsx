"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertCircle, 
  ArrowDownUp, 
  CheckCircle, 
  Clock, 
  Code, 
  Download, 
  FileJson, 
  Filter, 
  RefreshCw, 
  Search, 
  XCircle 
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Tipos de dados
type LogStatus = "success" | "failure" | "pending" | "retrying"

interface WebhookLog {
  id: string
  webhookId: string
  webhookName: string
  event: string
  status: LogStatus
  statusCode?: number
  url: string
  method: string
  requestHeaders: Record<string, string>
  requestBody: string
  responseHeaders?: Record<string, string>
  responseBody?: string
  duration?: number
  timestamp: string
  retryCount?: number
  error?: string
}

// Exemplo de dados para os logs
const sampleLogs: WebhookLog[] = [
  {
    id: "log_123456",
    webhookId: "wh_1",
    webhookName: "Monitoramento de Usuários",
    event: "user.created",
    status: "success",
    statusCode: 200,
    url: "https://api.cliente.com/webhooks/usuarios",
    method: "POST",
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=abc123...",
      "User-Agent": "MetricsSaaS-Webhook/1.0"
    },
    requestBody: JSON.stringify({
      id: "evt_789123",
      type: "user.created",
      created_at: "2023-07-15T14:30:00Z",
      data: {
        id: "usr_123456",
        name: "João Silva",
        email: "joao@exemplo.com",
        created_at: "2023-07-15T14:29:50Z"
      }
    }, null, 2),
    responseHeaders: {
      "Content-Type": "application/json",
      "Server": "nginx/1.18.0"
    },
    responseBody: JSON.stringify({ status: "received", message: "Webhook processado com sucesso" }, null, 2),
    duration: 235,
    timestamp: "2023-07-15T14:30:00Z"
  },
  {
    id: "log_789012",
    webhookId: "wh_2",
    webhookName: "Pagamentos",
    event: "payment.succeeded",
    status: "failure",
    statusCode: 500,
    url: "https://webhook.cliente.io/payments",
    method: "POST",
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=def456...",
      "User-Agent": "MetricsSaaS-Webhook/1.0"
    },
    requestBody: JSON.stringify({
      id: "evt_456789",
      type: "payment.succeeded",
      created_at: "2023-07-15T15:45:00Z",
      data: {
        id: "pay_789012",
        amount: 199.90,
        currency: "BRL",
        status: "paid",
        customer_id: "cus_123456"
      }
    }, null, 2),
    responseHeaders: {
      "Content-Type": "application/json",
      "Server": "nginx/1.18.0"
    },
    responseBody: JSON.stringify({ error: "Internal Server Error", message: "Database connection failed" }, null, 2),
    duration: 1230,
    timestamp: "2023-07-15T15:45:00Z",
    error: "O servidor retornou um erro 500 Internal Server Error"
  },
  {
    id: "log_345678",
    webhookId: "wh_1",
    webhookName: "Monitoramento de Usuários",
    event: "user.updated",
    status: "retrying",
    url: "https://api.cliente.com/webhooks/usuarios",
    method: "POST",
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=ghi789...",
      "User-Agent": "MetricsSaaS-Webhook/1.0"
    },
    requestBody: JSON.stringify({
      id: "evt_234567",
      type: "user.updated",
      created_at: "2023-07-15T16:20:00Z",
      data: {
        id: "usr_789012",
        name: "Maria Souza",
        email: "maria@exemplo.com",
        updated_at: "2023-07-15T16:19:50Z"
      }
    }, null, 2),
    timestamp: "2023-07-15T16:20:00Z",
    retryCount: 2,
    error: "Timeout ao conectar com o servidor"
  },
  {
    id: "log_901234",
    webhookId: "wh_3",
    webhookName: "Notificações de Produtos",
    event: "product.created",
    status: "pending",
    url: "https://hooks.cliente.net/products",
    method: "POST",
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=jkl012...",
      "User-Agent": "MetricsSaaS-Webhook/1.0"
    },
    requestBody: JSON.stringify({
      id: "evt_345678",
      type: "product.created",
      created_at: "2023-07-15T16:30:00Z",
      data: {
        id: "prod_345678",
        name: "Produto Premium",
        price: 59.90,
        stock: 100
      }
    }, null, 2),
    timestamp: "2023-07-15T16:30:00Z"
  },
  {
    id: "log_567890",
    webhookId: "wh_2",
    webhookName: "Pagamentos",
    event: "payment.refunded",
    status: "success",
    statusCode: 200,
    url: "https://webhook.cliente.io/payments",
    method: "POST",
    requestHeaders: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": "sha256=mno345...",
      "User-Agent": "MetricsSaaS-Webhook/1.0"
    },
    requestBody: JSON.stringify({
      id: "evt_901234",
      type: "payment.refunded",
      created_at: "2023-07-15T14:00:00Z",
      data: {
        id: "pay_567890",
        amount: 99.90,
        currency: "BRL",
        status: "refunded",
        customer_id: "cus_789012"
      }
    }, null, 2),
    responseHeaders: {
      "Content-Type": "application/json",
      "Server": "nginx/1.18.0"
    },
    responseBody: JSON.stringify({ status: "received", message: "Webhook processado com sucesso" }, null, 2),
    duration: 180,
    timestamp: "2023-07-15T14:00:00Z"
  }
]

// Componente para exibir o status do log
const LogStatusBadge = ({ status }: { status: LogStatus }) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">
          <CheckCircle className="h-3 w-3 mr-1" /> Sucesso
        </Badge>
      )
    case "failure":
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
          <XCircle className="h-3 w-3 mr-1" /> Falha
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
          <Clock className="h-3 w-3 mr-1" /> Pendente
        </Badge>
      )
    case "retrying":
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50">
          <RefreshCw className="h-3 w-3 mr-1" /> Repetindo
        </Badge>
      )
  }
}

// Componente de detalhes do log
const LogDetails = ({ log }: { log: WebhookLog }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Detalhes do Evento</h4>
          <div className="text-sm space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>ID:</span>
              <span className="font-mono">{log.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Webhook:</span>
              <span>{log.webhookName}</span>
            </div>
            <div className="flex justify-between">
              <span>Evento:</span>
              <span className="font-mono">{log.event}</span>
            </div>
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Detalhes da Requisição</h4>
          <div className="text-sm space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>URL:</span>
              <span className="font-mono truncate max-w-[200px]" title={log.url}>{log.url}</span>
            </div>
            <div className="flex justify-between">
              <span>Método:</span>
              <span>{log.method}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span><LogStatusBadge status={log.status} /></span>
            </div>
            {log.duration && (
              <div className="flex justify-between">
                <span>Duração:</span>
                <span>{log.duration}ms</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Tabs defaultValue="request">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">Requisição</TabsTrigger>
            <TabsTrigger value="response">Resposta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="space-y-4 mt-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Headers</h4>
              <div className="bg-muted rounded-md p-2 max-h-32 overflow-y-auto">
                <pre className="text-xs">
                  {JSON.stringify(log.requestHeaders, null, 2)}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Body</h4>
              <div className="bg-muted rounded-md p-2 max-h-64 overflow-y-auto">
                <pre className="text-xs">
                  {log.requestBody}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4 mt-2">
            {(log.status === "success" || log.status === "failure") ? (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-2">Headers</h4>
                  <div className="bg-muted rounded-md p-2 max-h-32 overflow-y-auto">
                    <pre className="text-xs">
                      {JSON.stringify(log.responseHeaders, null, 2)}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Body</h4>
                  <div className="bg-muted rounded-md p-2 max-h-64 overflow-y-auto">
                    <pre className="text-xs">
                      {log.responseBody}
                    </pre>
                  </div>
                </div>
                
                {log.status === "failure" && log.error && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-red-500">Erro</h4>
                    <div className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-md p-2">
                      <p className="text-xs">{log.error}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                {log.status === "pending" ? (
                  <p className="text-muted-foreground">Este webhook ainda não foi entregue.</p>
                ) : (
                  <p className="text-muted-foreground">Aguardando resposta do servidor.</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente principal
export function WebhooksLogs() {
  const [logs, setLogs] = useState(sampleLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [webhookFilter, setWebhookFilter] = useState<string>("all")
  const [eventFilter, setEventFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Lista de webhooks únicos para o filtro
  const uniqueWebhooks = Array.from(new Set(logs.map(log => log.webhookId))).map(
    id => ({ id, name: logs.find(log => log.webhookId === id)?.webhookName || "" })
  )
  
  // Lista de eventos únicos para o filtro
  const uniqueEvents = Array.from(new Set(logs.map(log => log.event)))
  
  // Função para aplicar os filtros
  const filteredLogs = logs.filter(log => {
    // Filtro de busca
    const matchesSearch = searchTerm === "" || 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.webhookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.url.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro de status
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    
    // Filtro de webhook
    const matchesWebhook = webhookFilter === "all" || log.webhookId === webhookFilter
    
    // Filtro de evento
    const matchesEvent = eventFilter === "all" || log.event === eventFilter
    
    return matchesSearch && matchesStatus && matchesWebhook && matchesEvent
  })
  
  // Função para exportar logs
  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `webhook-logs-${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    linkElement.remove()
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Logs de Webhooks</h2>
          <p className="text-muted-foreground">Histórico detalhado de todas as requisições de webhooks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar logs..."
              className="w-[200px] pl-8 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {(statusFilter !== "all" || webhookFilter !== "all" || eventFilter !== "all") && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                  >
                    {(statusFilter !== "all" ? 1 : 0) + 
                     (webhookFilter !== "all" ? 1 : 0) + 
                     (eventFilter !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="failure">Falha</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="retrying">Repetindo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs">Webhook</Label>
                  <Select value={webhookFilter} onValueChange={setWebhookFilter}>
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue placeholder="Todos os webhooks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os webhooks</SelectItem>
                      {uniqueWebhooks.map(webhook => (
                        <SelectItem key={webhook.id} value={webhook.id}>
                          {webhook.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs">Evento</Label>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="mt-1 h-8">
                      <SelectValue placeholder="Todos os eventos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os eventos</SelectItem>
                      {uniqueEvents.map(event => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setStatusFilter("all")
                      setWebhookFilter("all")
                      setEventFilter("all")
                    }}
                  >
                    Limpar filtros
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" className="h-9" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredLogs.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <FileJson className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum log encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Não foram encontrados logs com os filtros selecionados.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setWebhookFilter("all")
              setEventFilter("all")
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-base">Histórico de Logs</CardTitle>
            <CardDescription>
              Exibindo {filteredLogs.length} de {logs.length} logs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="border-t">
              <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground bg-muted/50 px-6 py-3">
                <div className="col-span-2">ID / Evento</div>
                <div className="col-span-2">Webhook</div>
                <div className="col-span-3">URL</div>
                <div className="col-span-2">Timestamp</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Código</div>
                <div className="col-span-1 text-center">Ações</div>
              </div>
              
              <div>
                {filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className={cn(
                      "grid grid-cols-12 px-6 py-3 text-sm items-center hover:bg-muted/50 transition-colors",
                      index !== filteredLogs.length - 1 && "border-b"
                    )}
                  >
                    <div className="col-span-2">
                      <div className="font-mono text-xs">{log.id.substring(0, 10)}...</div>
                      <div className="text-xs text-muted-foreground mt-1">{log.event}</div>
                    </div>
                    
                    <div className="col-span-2 truncate" title={log.webhookName}>
                      {log.webhookName}
                    </div>
                    
                    <div className="col-span-3 truncate font-mono text-xs" title={log.url}>
                      {log.url}
                    </div>
                    
                    <div className="col-span-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.timestamp), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <LogStatusBadge status={log.status} />
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {log.statusCode ? (
                        <span className={cn(
                          "text-xs font-mono",
                          log.statusCode >= 200 && log.statusCode < 300 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        )}>
                          {log.statusCode}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span className="font-mono text-sm">{log.id}</span>
                              <LogStatusBadge status={log.status} />
                            </DialogTitle>
                            <DialogDescription>
                              {log.event} • {new Date(log.timestamp).toLocaleString()}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="flex-1 mt-6">
                            <LogDetails log={log} />
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 py-4 border-t">
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-muted-foreground">
                Exibindo logs dos últimos 30 dias
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
                <Select defaultValue="10">
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground ml-2">por página</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 