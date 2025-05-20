"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Calendar,
  Copy,
  Edit,
  ExternalLink,
  EyeOff,
  FileWarning,
  Info,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Trash,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  AlertCircle,
  ArrowUpDown,
  Check
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

type WebhookStatus = "active" | "inactive" | "error"

export interface Webhook {
  id: string
  name: string
  url: string
  status: WebhookStatus
  events: string[]
  createdAt: string
  lastTriggered?: string
  failureCount: number
  successCount: number
  secret: string
  type: string
  description?: string
}

// Adicionando interface de props para WebhooksList
interface WebhooksListProps {
  onWebhookSelect?: (webhook: Webhook) => void;
}

export function WebhooksList({ onWebhookSelect }: WebhooksListProps) {
  const { toast } = useToast()
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "webhook-1",
      name: "Notificação de Cadastros",
      url: "https://exemplo.com/webhooks/cadastros",
      status: "active",
      events: ["user.created", "user.updated"],
      createdAt: "10/10/2023",
      lastTriggered: "15/10/2023 14:32:45",
      failureCount: 0,
      successCount: 145,
      secret: "whsec_4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z",
      type: "standard"
    },
    {
      id: "webhook-2",
      name: "Notificação de Compras",
      url: "https://exemplo.com/webhooks/compras",
      status: "active",
      events: ["payment.succeeded", "payment.failed", "payment.refunded"],
      createdAt: "15/09/2023",
      lastTriggered: "15/10/2023 12:15:30",
      failureCount: 3,
      successCount: 89,
      secret: "whsec_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      type: "standard"
    },
    {
      id: "webhook-3",
      name: "Notificação de Erros",
      url: "https://exemplo.com/webhooks/erros",
      status: "inactive",
      events: ["error.server", "error.client"],
      createdAt: "05/08/2023",
      lastTriggered: "10/10/2023 08:45:12",
      failureCount: 0,
      successCount: 27,
      secret: "TOKEN_MANTIDO_SEGURO",
      type: "discord"
    },
    {
      id: "webhook-4",
      name: "Integração com CRM",
      url: "https://crm.empresa.com/api/webhook",
      status: "error",
      events: ["customer.created", "customer.updated", "lead.created"],
      createdAt: "20/07/2023",
      lastTriggered: "14/10/2023 10:22:18",
      failureCount: 7,
      successCount: 42,
      secret: "TOKEN_MANTIDO_SEGURO",
      type: "discord"
    },
    {
      id: "webhook-5",
      name: "Logs de Auditoria",
      url: "https://auditoria.exemplo.com/webhook",
      status: "active",
      events: ["user.login", "user.logout", "user.permission.change"],
      createdAt: "01/06/2023",
      lastTriggered: "15/10/2023 09:10:05",
      failureCount: 1,
      successCount: 203,
      secret: "whsec_4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z",
      type: "standard"
    }
  ])
  
  const [selectedWebhooks, setSelectedWebhooks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<string>("recent")
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null)
  
  // Filtrar webhooks baseado na busca
  const filteredWebhooks = webhooks.filter(webhook => 
    webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.events.some(event => event.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  // Ordenar webhooks
  const sortedWebhooks = [...filteredWebhooks].sort((a, b) => {
    switch(sortOrder) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "recent":
        return new Date(b.lastTriggered || b.createdAt).getTime() - new Date(a.lastTriggered || a.createdAt).getTime()
      case "oldest":
        return new Date(a.lastTriggered || a.createdAt).getTime() - new Date(b.lastTriggered || b.createdAt).getTime()
      case "success-rate":
        const rateA = a.successCount / (a.successCount + a.failureCount || 1) * 100
        const rateB = b.successCount / (b.successCount + b.failureCount || 1) * 100
        return rateB - rateA
      default:
        return 0
    }
  })
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "URL copiada",
      description: "A URL do webhook foi copiada para a área de transferência.",
      duration: 3000
    })
  }
  
  const toggleWebhookStatus = (id: string) => {
    setWebhooks(webhooks.map(webhook => {
      if (webhook.id === id) {
        const newStatus = webhook.status === "active" ? "inactive" : "active"
        
        toast({
          title: `Webhook ${newStatus === "active" ? "ativado" : "desativado"}`,
          description: `O webhook "${webhook.name}" foi ${newStatus === "active" ? "ativado" : "desativado"} com sucesso.`,
          duration: 3000
        })
        
        return {
          ...webhook,
          status: newStatus
        }
      }
      return webhook
    }))
  }
  
  const retryFailedWebhook = (id: string) => {
    toast({
      title: "Tentando novamente",
      description: "Estamos tentando reenviar os eventos que falharam para este webhook.",
      duration: 3000
    })
    
    // Simulação de sucesso após 2 segundos
    setTimeout(() => {
      setWebhooks(webhooks.map(webhook => {
        if (webhook.id === id) {
          return {
            ...webhook,
            status: "active",
            failureCount: 0
          }
        }
        return webhook
      }))
      
      toast({
        title: "Reenvio concluído",
        description: "Os eventos foram reenviados com sucesso.",
        duration: 3000
      })
    }, 2000)
  }
  
  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id))
    setWebhookToDelete(null)
    setOpenDeleteDialog(false)
    
    toast({
      title: "Webhook excluído",
      description: "O webhook foi excluído permanentemente.",
      duration: 3000
    })
  }
  
  const confirmDelete = (id: string) => {
    setWebhookToDelete(id)
    setOpenDeleteDialog(true)
  }
  
  const getWebhookStatusBadge = (status: WebhookStatus) => {
    switch(status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            <Pause className="h-3 w-3 mr-1" />
            Inativo
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Erro
          </Badge>
        )
    }
  }
  
  const toggleSelectAll = () => {
    if (selectedWebhooks.length === webhooks.length) {
      setSelectedWebhooks([])
    } else {
      setSelectedWebhooks(webhooks.map(webhook => webhook.id))
    }
  }
  
  const toggleWebhookSelection = (id: string) => {
    if (selectedWebhooks.includes(id)) {
      setSelectedWebhooks(selectedWebhooks.filter(item => item !== id))
    } else {
      setSelectedWebhooks([...selectedWebhooks, id])
    }
    
    // Se temos uma função onWebhookSelect, chamamos com o webhook selecionado
    if (onWebhookSelect) {
      const webhook = webhooks.find(w => w.id === id);
      if (webhook) {
        onWebhookSelect(webhook);
      }
    }
  }
  
  const formatWebhookUrl = (url: string, type: string) => {
    if (type === "discord") {
      // Extrair ID e token do webhook do Discord a partir da URL
      const parts = url.split('/')
      const id = parts[parts.length - 2]
      const token = parts[parts.length - 1]
      
      // Mostrar versão truncada para segurança
      return (
        <div className="flex flex-col">
          <span className="font-mono text-xs truncate max-w-[300px]">
            {`https://api.metrio.com/webhooks/${id.substring(0, 6)}.../${token.substring(0, 6)}...`}
          </span>
          <span className="text-xs text-muted-foreground mt-1">Webhook Personalizado (estilo Discord)</span>
        </div>
      )
    }
    
    // Para webhooks padrão, apenas truncar
    return (
      <span className="font-mono text-xs truncate max-w-[300px]">{url}</span>
    )
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <CardTitle>Seus Webhooks</CardTitle>
            <CardDescription>Gerencie seus webhooks para receber notificações em tempo real</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                  <SelectItem value="success-rate">Taxa de sucesso</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Input
              placeholder="Buscar por nome, URL ou eventos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos ({webhooks.length})</TabsTrigger>
            <TabsTrigger value="active">Ativos ({webhooks.filter(w => w.status === "active").length})</TabsTrigger>
            <TabsTrigger value="inactive">Inativos ({webhooks.filter(w => w.status === "inactive").length})</TabsTrigger>
            <TabsTrigger value="error">Com erro ({webhooks.filter(w => w.status === "error").length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3">
            {sortedWebhooks.length > 0 ? (
              sortedWebhooks.map((webhook) => (
                <div 
                  key={webhook.id} 
                  className={`flex flex-col space-y-2 rounded-lg border p-4 transition-colors ${
                    selectedWebhooks.includes(webhook.id) ? "border-primary/50 bg-muted/30" : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleWebhookSelection(webhook.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{webhook.name}</h3>
                      {getWebhookStatusBadge(webhook.status)}
                      {webhook.failureCount > 0 && (
                        <Badge variant="destructive">
                          {webhook.failureCount} {webhook.failureCount === 1 ? "falha" : "falhas"}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => console.log("Editar", webhook.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(webhook.url)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(webhook.url, "_blank")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Abrir URL
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Bell className="mr-2 h-4 w-4" />
                            Notificações
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Receber por e-mail
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Silenciar alertas
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        
                        <DropdownMenuItem onClick={() => toggleWebhookStatus(webhook.id)}>
                          {webhook.status === "active" ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        {webhook.status === "error" && (
                          <DropdownMenuItem onClick={() => retryFailedWebhook(webhook.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tentar novamente
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(webhook.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      Criado em: {webhook.createdAt}
                    </div>
                    {webhook.lastTriggered && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="mr-1 h-3.5 w-3.5" />
                        Último disparo: {webhook.lastTriggered}
                      </div>
                    )}
                    {webhook.status === "error" && (
                      <div className="flex items-center text-sm text-red-500">
                        <FileWarning className="mr-1 h-3.5 w-3.5" />
                        Falhas recentes: {webhook.failureCount}
                      </div>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 cursor-help">
                            {webhook.successCount + webhook.failureCount} eventos
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {webhook.successCount} com sucesso,{" "}
                            {webhook.failureCount} falhas
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1 break-all">
                    URL: {formatWebhookUrl(webhook.url, webhook.type)}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 pt-1">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileWarning className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg mb-1">Nenhum webhook encontrado</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery 
                    ? `Não encontramos webhooks correspondentes a "${searchQuery}". Tente uma busca diferente.` 
                    : "Você ainda não tem webhooks configurados. Crie um webhook para começar."}
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar novo webhook
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-3">
            {sortedWebhooks.filter(webhook => webhook.status === "active").length > 0 ? (
              sortedWebhooks
                .filter(webhook => webhook.status === "active")
                .map((webhook) => (
                  <div 
                    key={webhook.id}
                    className={`flex flex-col space-y-2 rounded-lg border p-4 transition-colors ${
                      selectedWebhooks.includes(webhook.id) ? "border-primary/50 bg-muted/30" : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleWebhookSelection(webhook.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        {getWebhookStatusBadge(webhook.status)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => console.log("Editar", webhook.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(webhook.url)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar URL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleWebhookStatus(webhook.id)}>
                            <Pause className="mr-2 h-4 w-4" />
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1 break-all">
                      URL: {formatWebhookUrl(webhook.url, webhook.type)}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum webhook ativo encontrado.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inactive" className="space-y-3">
            {sortedWebhooks.filter(webhook => webhook.status === "inactive").length > 0 ? (
              sortedWebhooks
                .filter(webhook => webhook.status === "inactive")
                .map((webhook) => (
                  <div 
                    key={webhook.id}
                    className={`flex flex-col space-y-2 rounded-lg border p-4 transition-colors ${
                      selectedWebhooks.includes(webhook.id) ? "border-primary/50 bg-muted/30" : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleWebhookSelection(webhook.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        {getWebhookStatusBadge(webhook.status)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => console.log("Editar", webhook.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(webhook.url)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar URL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleWebhookStatus(webhook.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Ativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1 break-all">
                      URL: {formatWebhookUrl(webhook.url, webhook.type)}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum webhook inativo encontrado.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="error" className="space-y-3">
            {sortedWebhooks.filter(webhook => webhook.status === "error").length > 0 ? (
              sortedWebhooks
                .filter(webhook => webhook.status === "error")
                .map((webhook) => (
                  <div 
                    key={webhook.id}
                    className={`flex flex-col space-y-2 rounded-lg border border-red-200 bg-red-50/30 p-4 transition-colors ${
                      selectedWebhooks.includes(webhook.id) ? "border-red-300 bg-red-50/50" : "hover:bg-red-50/50"
                    }`}
                    onClick={() => toggleWebhookSelection(webhook.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        {getWebhookStatusBadge(webhook.status)}
                        <Badge variant="destructive">
                          {webhook.failureCount} {webhook.failureCount === 1 ? "falha" : "falhas"}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => retryFailedWebhook(webhook.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tentar novamente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log("Editar", webhook.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(webhook.url)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar URL
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center text-sm text-red-500 mt-1">
                      <FileWarning className="mr-1 h-3.5 w-3.5" />
                      Ocorreram falhas no envio de eventos para este webhook. 
                      Verifique se a URL está acessível e responde corretamente.
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1 break-all">
                      URL: {formatWebhookUrl(webhook.url, webhook.type)}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p>Nenhum webhook com erro. Tudo funcionando corretamente!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O webhook será removido permanentemente 
              da nossa base de dados e não receberá mais notificações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => webhookToDelete && deleteWebhook(webhookToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

