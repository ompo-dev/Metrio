"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code2, Filter, Plus, MailOpen, Send, Trash2, Webhook, Wand2, Zap, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Tipos
type ActionType = "email" | "webhook" | "transform" | "filter" | "notify"
type TriggerSource = "webhook" | "schedule" | "api"
type ConditionOperator = "equals" | "contains" | "greaterThan" | "lessThan" | "exists" | "notExists"

interface AutomationRule {
  id: string
  name: string
  description?: string
  isActive: boolean
  triggerSource: TriggerSource
  webhookEventType?: string
  conditions: Condition[]
  actions: Action[]
  createdAt: string
  lastTriggered?: string
  executions: number
}

interface Condition {
  id: string
  field: string
  operator: ConditionOperator
  value?: string
}

interface Action {
  id: string
  type: ActionType
  config: Record<string, any>
}

// Mock data
const mockRules: AutomationRule[] = [
  {
    id: "rule_1",
    name: "Notificar sobre novos cadastros",
    description: "Envia um email para o time de vendas quando um novo usuário se cadastra",
    isActive: true,
    triggerSource: "webhook",
    webhookEventType: "user.created",
    conditions: [
      {
        id: "cond_1",
        field: "data.source",
        operator: "equals",
        value: "website"
      }
    ],
    actions: [
      {
        id: "action_1",
        type: "email",
        config: {
          to: "vendas@empresa.com",
          subject: "Novo cadastro pelo site",
          template: "new_user"
        }
      }
    ],
    createdAt: "2023-03-15T10:00:00Z",
    lastTriggered: "2023-03-20T14:35:12Z",
    executions: 127
  },
  {
    id: "rule_2",
    name: "Transformar dados de venda",
    description: "Padroniza os dados de venda antes de enviar para o CRM",
    isActive: true,
    triggerSource: "webhook",
    webhookEventType: "order.created",
    conditions: [
      {
        id: "cond_2",
        field: "data.status",
        operator: "equals",
        value: "paid"
      }
    ],
    actions: [
      {
        id: "action_2",
        type: "transform",
        config: {
          mapping: {
            "customer.id": "data.buyer.id",
            "customer.name": "data.buyer.full_name",
            "customer.email": "data.buyer.email",
            "order.id": "data.id",
            "order.total": "data.total_amount"
          }
        }
      },
      {
        id: "action_3",
        type: "webhook",
        config: {
          url: "https://crm.empresa.com/api/orders",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {{env.CRM_API_KEY}}"
          }
        }
      }
    ],
    createdAt: "2023-02-10T08:45:00Z",
    lastTriggered: "2023-03-21T09:12:45Z",
    executions: 532
  },
  {
    id: "rule_3",
    name: "Alerta de pagamento falho",
    description: "Notifica o suporte quando um pagamento falha para contato proativo",
    isActive: false,
    triggerSource: "webhook",
    webhookEventType: "payment.failed",
    conditions: [
      {
        id: "cond_3",
        field: "data.amount",
        operator: "greaterThan",
        value: "1000"
      }
    ],
    actions: [
      {
        id: "action_4",
        type: "notify",
        config: {
          channel: "slack",
          destination: "#suporte-financeiro",
          message: "⚠️ Pagamento de alto valor falhou: {{data.amount}} - Cliente: {{data.customer.name}} ({{data.customer.email}})"
        }
      }
    ],
    createdAt: "2023-01-20T15:30:00Z",
    lastTriggered: "2023-02-05T11:20:18Z",
    executions: 18
  }
]

// Objetos de referência para lista de opções
const operatorOptions = [
  { value: "equals", label: "É igual a" },
  { value: "contains", label: "Contém" },
  { value: "greaterThan", label: "Maior que" },
  { value: "lessThan", label: "Menor que" },
  { value: "exists", label: "Existe" },
  { value: "notExists", label: "Não existe" }
]

const actionTypeOptions = [
  { value: "email", label: "Enviar Email", icon: <MailOpen className="h-4 w-4" /> },
  { value: "webhook", label: "Enviar para Webhook", icon: <Webhook className="h-4 w-4" /> },
  { value: "transform", label: "Transformar Dados", icon: <Wand2 className="h-4 w-4" /> },
  { value: "filter", label: "Filtrar Dados", icon: <Filter className="h-4 w-4" /> },
  { value: "notify", label: "Notificar", icon: <Send className="h-4 w-4" /> }
]

const triggerSourceOptions = [
  { value: "webhook", label: "Evento de Webhook" },
  { value: "schedule", label: "Agendamento" },
  { value: "api", label: "Chamada de API" }
]

const webhookEventTypes = [
  "user.created",
  "user.updated",
  "order.created",
  "order.updated",
  "order.canceled",
  "payment.succeeded",
  "payment.failed",
  "payment.refunded",
  "product.created",
  "product.updated"
]

// Componente principal
export function WebhooksAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Obter a regra selecionada
  const selectedRule = selectedRuleId ? rules.find(r => r.id === selectedRuleId) : null
  
  // Filtrar regras com base na busca
  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  )
  
  // Alternar o estado ativo de uma regra
  const toggleRuleActive = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }
  
  // Excluir uma regra
  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
    if (selectedRuleId === ruleId) {
      setSelectedRuleId(null)
    }
  }
  
  // Adicionar uma nova regra (versão simplificada para demonstração)
  const addRule = (rule: Partial<AutomationRule>) => {
    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: rule.name || "Nova automação",
      description: rule.description,
      isActive: rule.isActive !== undefined ? rule.isActive : true,
      triggerSource: rule.triggerSource || "webhook",
      webhookEventType: rule.webhookEventType,
      conditions: rule.conditions || [],
      actions: rule.actions || [],
      createdAt: new Date().toISOString(),
      executions: 0
    }
    
    setRules([newRule, ...rules])
    setIsCreating(false)
    setSelectedRuleId(newRule.id)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Automações de Webhook</h2>
          <p className="text-muted-foreground">
            Configure regras automatizadas para processar eventos recebidos pelos webhooks
          </p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <AutomationForm 
              onSubmit={(data) => addRule(data)}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid md:grid-cols-12 gap-6">
        <Card className="md:col-span-5 lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Regras</CardTitle>
              <Badge variant="outline">
                {rules.filter(r => r.isActive).length}/{rules.length} ativas
              </Badge>
            </div>
            <div className="relative">
              <Input
                className="pl-8"
                placeholder="Buscar automações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Zap className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {filteredRules.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-muted-foreground">
                    Nenhuma automação encontrada
                  </p>
                </div>
              ) : (
                <div>
                  {filteredRules.map(rule => (
                    <div 
                      key={rule.id}
                      className={cn(
                        "border-b last:border-b-0 p-4 cursor-pointer hover:bg-muted/40 transition-colors",
                        selectedRuleId === rule.id && "bg-muted"
                      )}
                      onClick={() => setSelectedRuleId(rule.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            rule.isActive ? "bg-green-500" : "bg-red-500"
                          )} />
                          <span className="font-medium">{rule.name}</span>
                        </div>
                        <Badge variant="outline">
                          {rule.triggerSource === "webhook" ? rule.webhookEventType : rule.triggerSource}
                        </Badge>
                      </div>
                      
                      {rule.description && (
                        <p className="text-sm text-muted-foreground ml-4 mt-1 line-clamp-2">
                          {rule.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 ml-4">
                        <span>
                          {rule.executions} execuções
                        </span>
                        {rule.lastTriggered && (
                          <span>
                            Última: {new Date(rule.lastTriggered).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-7 lg:col-span-8">
          {selectedRule ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedRule.name}</CardTitle>
                    <CardDescription>
                      {selectedRule.description || "Sem descrição"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rule-active"
                        checked={selectedRule.isActive}
                        onCheckedChange={() => toggleRuleActive(selectedRule.id)}
                      />
                      <Label htmlFor="rule-active">
                        {selectedRule.isActive ? "Ativa" : "Inativa"}
                      </Label>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => deleteRule(selectedRule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Detalhes da Automação</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">ID</Label>
                        <p className="text-sm font-mono">{selectedRule.id}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Criada em</Label>
                        <p className="text-sm">{new Date(selectedRule.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Tipo de Gatilho</Label>
                        <p className="text-sm capitalize">{selectedRule.triggerSource}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Executada</Label>
                        <p className="text-sm">{selectedRule.executions} vezes</p>
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="trigger">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="trigger">Gatilho</TabsTrigger>
                      <TabsTrigger value="conditions">Condições ({selectedRule.conditions.length})</TabsTrigger>
                      <TabsTrigger value="actions">Ações ({selectedRule.actions.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="trigger" className="space-y-4 pt-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Webhook className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              {selectedRule.triggerSource === "webhook" ? "Evento de Webhook" : 
                               selectedRule.triggerSource === "schedule" ? "Agendamento" : "Chamada de API"}
                            </h4>
                            {selectedRule.triggerSource === "webhook" && selectedRule.webhookEventType && (
                              <div className="flex items-center gap-1">
                                <code className="text-xs bg-muted p-1 rounded">
                                  {selectedRule.webhookEventType}
                                </code>
                                <Badge variant="outline" className="text-xs">evento</Badge>
                              </div>
                            )}
                            
                            {selectedRule.triggerSource === "schedule" && (
                              <p className="text-sm text-muted-foreground">Executa automaticamente com base em um cronograma</p>
                            )}
                            
                            {selectedRule.triggerSource === "api" && (
                              <p className="text-sm text-muted-foreground">Executada manualmente via API</p>
                            )}
                            
                            <p className="text-sm text-muted-foreground mt-1">
                              Última execução: {selectedRule.lastTriggered 
                                ? new Date(selectedRule.lastTriggered).toLocaleString() 
                                : "Nunca executada"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="conditions" className="pt-4">
                      {selectedRule.conditions.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed rounded-md">
                          <p className="text-muted-foreground">
                            Sem condições - esta automação será executada para todos os eventos {selectedRule.webhookEventType}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedRule.conditions.map((condition, index) => (
                            <div key={condition.id} className="p-4 border rounded-md">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-muted px-1.5 py-0.5 rounded-sm">
                                  Condição {index + 1}
                                </span>
                                {index > 0 && (
                                  <span className="text-xs text-muted-foreground">E</span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <code className="bg-muted rounded p-1 text-xs">
                                  {condition.field}
                                </code>
                                <span>
                                  {operatorOptions.find(o => o.value === condition.operator)?.label}
                                </span>
                                {condition.value && (
                                  <code className="bg-muted rounded p-1 text-xs">
                                    {condition.value}
                                  </code>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="actions" className="pt-4">
                      <div className="space-y-3">
                        {selectedRule.actions.map((action, index) => (
                          <div key={action.id} className="p-4 border rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-full bg-primary/10">
                                {actionTypeOptions.find(a => a.value === action.type)?.icon}
                              </div>
                              <div>
                                <h5 className="font-medium">
                                  {actionTypeOptions.find(a => a.value === action.type)?.label} {index > 0 && `(passo ${index + 1})`}
                                </h5>
                              </div>
                            </div>
                            
                            <div className="ml-9 text-sm">
                              {action.type === "email" && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Para:</span>
                                    <span>{action.config.to}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Assunto:</span>
                                    <span>{action.config.subject}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Template:</span>
                                    <Badge variant="outline">{action.config.template}</Badge>
                                  </div>
                                </div>
                              )}
                              
                              {action.type === "webhook" && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">URL:</span>
                                    <code className="bg-muted rounded p-1 text-xs">
                                      {action.config.url}
                                    </code>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Método:</span>
                                    <Badge variant="outline">{action.config.method}</Badge>
                                  </div>
                                </div>
                              )}
                              
                              {action.type === "transform" && (
                                <div>
                                  <span className="text-muted-foreground">Mapeamento:</span>
                                  <div className="mt-1 bg-muted p-2 rounded text-xs font-mono">
                                    {Object.entries(action.config.mapping).map(([key, value]) => (
                                      <div key={key} className="flex items-center gap-2">
                                        <span>{key}</span>
                                        <ArrowRight className="h-3 w-3" />
                                        <span>{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {action.type === "notify" && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Canal:</span>
                                    <Badge variant="outline">{action.config.channel}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Destino:</span>
                                    <span>{action.config.destination}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Mensagem:</span>
                                    <span className="text-xs break-all">{action.config.message}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="w-full flex items-center justify-between">
                  <Button variant="outline">Testar Automação</Button>
                  <Button variant="default">Editar Automação</Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="p-12 text-center">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhuma automação selecionada</h3>
              <p className="text-muted-foreground mb-4">
                Selecione uma automação existente ou crie uma nova para começar
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Automação
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// Formulário de criação/edição de automação
function AutomationForm({ 
  initialData,
  onSubmit,
  onCancel
}: { 
  initialData?: Partial<AutomationRule>,
  onSubmit: (data: Partial<AutomationRule>) => void,
  onCancel: () => void
}) {
  // State para os campos do formulário
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [triggerSource, setTriggerSource] = useState<TriggerSource>(initialData?.triggerSource || "webhook")
  const [webhookEventType, setWebhookEventType] = useState(initialData?.webhookEventType || "")
  const [isActive, setIsActive] = useState(initialData?.isActive !== undefined ? initialData.isActive : true)
  
  // Versão simplificada para demonstração
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      description,
      triggerSource,
      webhookEventType,
      isActive,
      conditions: [],
      actions: []
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Nova Automação</DialogTitle>
        <DialogDescription>
          Configure o gatilho, condições e ações para sua automação
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="basic" className="mt-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="trigger">Gatilho</TabsTrigger>
          <TabsTrigger value="advanced" disabled>Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Automação</Label>
            <Input 
              id="name" 
              placeholder="Ex: Notificar novos cadastros" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Breve descrição do que essa automação faz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20"
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="automation-active" className="cursor-pointer">
              Ativar automação imediatamente
            </Label>
            <Switch 
              id="automation-active" 
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="trigger" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Gatilho</Label>
            <Select 
              value={triggerSource} 
              onValueChange={(value) => setTriggerSource(value as TriggerSource)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de gatilho" />
              </SelectTrigger>
              <SelectContent>
                {triggerSourceOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {triggerSource === "webhook" && (
            <div className="space-y-2">
              <Label>Evento de Webhook</Label>
              <Select 
                value={webhookEventType} 
                onValueChange={setWebhookEventType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
                <SelectContent>
                  {webhookEventTypes.map(event => (
                    <SelectItem key={event} value={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                A automação será acionada sempre que este tipo de evento for recebido
              </p>
            </div>
          )}
          
          {triggerSource === "schedule" && (
            <div className="p-4 border rounded-md bg-muted text-center">
              <Code2 className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Configuração de agendamento disponível na versão completa
              </p>
            </div>
          )}
          
          {triggerSource === "api" && (
            <div className="p-4 border rounded-md bg-muted text-center">
              <Code2 className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Configuração de API disponível na versão completa
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Continuar Configuração</Button>
      </DialogFooter>
    </form>
  )
} 