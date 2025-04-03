"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Code, 
  CreditCard, 
  FileCode2, 
  Github, 
  Globe, 
  Layout, 
  LifeBuoy, 
  MoreHorizontal, 
  RefreshCw, 
  Search, 
  ShoppingCart, 
  Slack, 
  UserRound, 
  Webhook, 
  Zap 
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import React from "react"

// Tipos
interface Integration {
  id: string
  name: string
  description: string
  category: "ecommerce" | "cms" | "marketing" | "payment" | "communication" | "other"
  icon: React.ReactNode
  url: string
  isPopular: boolean
  difficulty: "easy" | "medium" | "advanced"
  docsUrl: string
  setupSteps: number
  tags: string[]
}

const integrations: Integration[] = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Conecte sua loja Shopify para rastrear pedidos, produtos e clientes",
    category: "ecommerce",
    icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
    url: "https://shopify.com",
    isPopular: true,
    difficulty: "easy",
    docsUrl: "/docs/integrations/shopify",
    setupSteps: 3,
    tags: ["ecommerce", "vendas", "produtos"]
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Integre com sua loja WooCommerce para monitorar vendas e clientes",
    category: "ecommerce",
    icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
    url: "https://woocommerce.com",
    isPopular: true,
    difficulty: "medium",
    docsUrl: "/docs/integrations/woocommerce",
    setupSteps: 4,
    tags: ["ecommerce", "wordpress", "vendas"]
  },
  {
    id: "wordpress",
    name: "WordPress",
    description: "Monitore publicações, comentários e usuários do seu site WordPress",
    category: "cms",
    icon: <Globe className="h-6 w-6 text-blue-600" />,
    url: "https://wordpress.org",
    isPopular: true,
    difficulty: "medium",
    docsUrl: "/docs/integrations/wordpress",
    setupSteps: 3,
    tags: ["cms", "blog", "conteúdo"]
  },
  {
    id: "github",
    name: "GitHub",
    description: "Receba notificações de issues, pull requests e novas releases",
    category: "other",
    icon: <Github className="h-6 w-6" />,
    url: "https://github.com",
    isPopular: true,
    difficulty: "easy",
    docsUrl: "/docs/integrations/github",
    setupSteps: 2,
    tags: ["desenvolvimento", "código", "git"]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Envie eventos e alertas para seus canais do Slack",
    category: "communication",
    icon: <Slack className="h-6 w-6 text-emerald-600" />,
    url: "https://slack.com",
    isPopular: true,
    difficulty: "easy",
    docsUrl: "/docs/integrations/slack",
    setupSteps: 2,
    tags: ["comunicação", "notificações", "equipe"]
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sincronize assinantes e acompanhe campanhas de email",
    category: "marketing",
    icon: <LifeBuoy className="h-6 w-6 text-yellow-600" />,
    url: "https://mailchimp.com",
    isPopular: false,
    difficulty: "medium",
    docsUrl: "/docs/integrations/mailchimp",
    setupSteps: 4,
    tags: ["email", "marketing", "segmentação"]
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Monitore pagamentos, assinaturas e disputas",
    category: "payment",
    icon: <CreditCard className="h-6 w-6 text-indigo-600" />,
    url: "https://stripe.com",
    isPopular: true,
    difficulty: "medium",
    docsUrl: "/docs/integrations/stripe",
    setupSteps: 3,
    tags: ["pagamentos", "assinaturas", "financeiro"]
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Conecte com milhares de aplicativos através do Zapier",
    category: "other",
    icon: <Zap className="h-6 w-6 text-orange-600" />,
    url: "https://zapier.com",
    isPopular: true,
    difficulty: "easy",
    docsUrl: "/docs/integrations/zapier",
    setupSteps: 2,
    tags: ["automação", "fluxo de trabalho", "integrações"]
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Monitore leads, contatos e atividades do seu CRM",
    category: "marketing",
    icon: <UserRound className="h-6 w-6 text-orange-600" />,
    url: "https://hubspot.com",
    isPopular: false,
    difficulty: "advanced",
    docsUrl: "/docs/integrations/hubspot",
    setupSteps: 5,
    tags: ["crm", "marketing", "vendas"]
  },
]

// Componente principal de integrações
export function WebhooksIntegrations() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(1)
  
  // Filtra as integrações com base na busca e categoria
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })
  
  // Obter a integração selecionada
  const currentIntegration = selectedIntegration 
    ? integrations.find(i => i.id === selectedIntegration) 
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Integração com Plataformas</h2>
        <p className="text-muted-foreground">
          Conecte sua aplicação com as principais plataformas e serviços
        </p>
      </div>
      
      {selectedIntegration ? (
        <IntegrationDetail 
          integration={currentIntegration!} 
          onBack={() => setSelectedIntegration(null)}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar integrações..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="cms">CMS</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="payment">Pagamentos</SelectItem>
                <SelectItem value="communication">Comunicação</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid sm:w-auto w-full grid-cols-2 sm:inline-flex">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="popular">
                Populares
                <Badge className="ml-2 h-5 px-1.5" variant="secondary">
                  {integrations.filter(i => i.isPopular).length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredIntegrations.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Nenhuma integração encontrada</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Tente uma busca diferente ou remova os filtros
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredIntegrations.map(integration => (
                    <IntegrationCard 
                      key={integration.id} 
                      integration={integration}
                      onClick={() => setSelectedIntegration(integration.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredIntegrations
                  .filter(i => i.isPopular)
                  .map(integration => (
                    <IntegrationCard 
                      key={integration.id} 
                      integration={integration}
                      onClick={() => setSelectedIntegration(integration.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

// Componente de cartão de integração
function IntegrationCard({ integration, onClick }: { integration: Integration, onClick: () => void }) {
  const difficultyColor = 
    integration.difficulty === "easy" 
      ? "text-green-600" 
      : integration.difficulty === "medium" 
        ? "text-yellow-600" 
        : "text-red-600"
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={onClick}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start mb-2">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-muted">
            {integration.icon}
          </div>
          {integration.isPopular && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              Popular
            </Badge>
          )}
        </div>
        <CardTitle className="text-base">{integration.name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <span className={cn("mr-1", difficultyColor)}>
              {integration.difficulty === "easy" ? "Básico" : integration.difficulty === "medium" ? "Intermediário" : "Avançado"}
            </span>
            ·
            <span className="ml-1">{integration.setupSteps} passos</span>
          </div>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de detalhes da integração
function IntegrationDetail({ 
  integration, 
  onBack,
  activeStep,
  setActiveStep
}: { 
  integration: Integration, 
  onBack: () => void
  activeStep: number
  setActiveStep: (step: number) => void
}) {
  const steps = [
    { id: 1, title: "Configuração Inicial" },
    { id: 2, title: "Conexão com a API" },
    { id: 3, title: "Configurar Eventos" },
    ...(integration.setupSteps > 3 ? [{ id: 4, title: "Personalização" }] : []),
    ...(integration.setupSteps > 4 ? [{ id: 5, title: "Validação" }] : []),
  ]
  
  // Detalhes para diferentes steps e integrações
  const getStepContent = (stepId: number) => {
    const baseSteps: Record<number, React.ReactNode> = {
      1: (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium mb-2">Pré-requisitos</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Você precisará de uma conta ativa no serviço {integration.name}</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Acesso administrativo para configurar webhooks</span>
              </li>
              <li className="flex gap-2 items-start">
                <Check className="h-4 w-4 text-green-500 mt-1" />
                <span>Endpoint configurado no MetricsSaaS para receber eventos</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Configure seu ambiente</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-endpoint">Seu endpoint de webhook</Label>
                <div className="flex gap-2">
                  <Input 
                    id="webhook-endpoint" 
                    value={`https://webhooks.metricassaas.com/${integration.id}/hook_${Math.random().toString(36).substring(2, 10)}`} 
                    readOnly
                  />
                  <Button variant="outline" size="icon">
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Este é o endereço do seu webhook que você precisará configurar no {integration.name}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secret-key">Chave secreta</Label>
                <div className="flex gap-2">
                  <Input 
                    id="secret-key" 
                    value={`whsec_${Math.random().toString(36).substring(2, 15)}`} 
                    readOnly
                  />
                  <Button variant="outline" size="icon">
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use esta chave para verificar a autenticidade dos eventos recebidos
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      2: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Acessar o painel de administração</h3>
            <ol className="space-y-3 ml-6 list-decimal">
              <li>
                <span>Acesse o painel de administração do {integration.name}</span>
                <a 
                  href={integration.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-2 text-primary hover:underline text-sm"
                >
                  Abrir {integration.name}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Navegue até as configurações de integrações ou webhooks</li>
              <li>Clique em "Adicionar webhook" ou "Nova integração"</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Configurar o endpoint</h3>
            <ol className="space-y-3 ml-6 list-decimal">
              <li>Cole o endpoint do webhook fornecido acima</li>
              <li>Configure a chave secreta ou token de autenticação</li>
              <li>Selecione o formato de payload como JSON</li>
            </ol>
          </div>
          
          <div className="border p-4 rounded-lg bg-amber-50 border-amber-200">
            <div className="flex gap-2">
              <FileCode2 className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Importante</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Certifique-se de usar HTTPS para seu endpoint e manter sua chave secreta segura.
                  Não compartilhe estes dados em repositórios públicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      3: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Selecione os eventos para monitorar</h3>
            <p className="text-sm text-muted-foreground">
              Escolha quais eventos você deseja que o {integration.name} envie para o seu webhook:
            </p>
            
            <div className="space-y-3 mt-4">
              {integration.category === "ecommerce" && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-order" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-order" defaultChecked />
                      <span>Pedidos (criação, atualização, cancelamento)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-product" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-product" defaultChecked />
                      <span>Produtos (criação, atualização, exclusão)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-customer" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-customer" defaultChecked />
                      <span>Clientes (cadastro, atualização)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-cart" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-cart" />
                      <span>Carrinhos (criação, abandono, atualização)</span>
                    </Label>
                    <Badge variant="outline">Opcional</Badge>
                  </div>
                </>
              )}
              
              {integration.category === "payment" && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-payment" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-payment" defaultChecked />
                      <span>Pagamentos (sucesso, falha, reembolso)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-subscription" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-subscription" defaultChecked />
                      <span>Assinaturas (criação, cancelamento, atualização)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                </>
              )}
              
              {integration.category === "cms" && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-post" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-post" defaultChecked />
                      <span>Posts (publicação, atualização, exclusão)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-comment" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-comment" defaultChecked />
                      <span>Comentários (criação, aprovação, spam)</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                </>
              )}
              
              {/* Default events for other categories */}
              {!["ecommerce", "payment", "cms"].includes(integration.category) && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-create" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-create" defaultChecked />
                      <span>Eventos de criação</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-update" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-update" defaultChecked />
                      <span>Eventos de atualização</span>
                    </Label>
                    <Badge variant="outline">Recomendado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-delete" className="flex items-center gap-2 cursor-pointer">
                      <Switch id="event-delete" />
                      <span>Eventos de exclusão</span>
                    </Label>
                    <Badge variant="outline">Opcional</Badge>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="border p-4 rounded-lg bg-blue-50 border-blue-200">
            <div className="flex gap-2">
              <Layout className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Dica</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Selecione apenas os eventos que você realmente precisa monitorar para evitar
                  sobrecarga de dados e melhorar o desempenho.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      4: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Personalização avançada</h3>
            <p className="text-sm text-muted-foreground">
              Configure opções adicionais para personalizar a integração:
            </p>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="retry-count">Número máximo de tentativas</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o número de tentativas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 tentativa</SelectItem>
                    <SelectItem value="3">3 tentativas (recomendado)</SelectItem>
                    <SelectItem value="5">5 tentativas</SelectItem>
                    <SelectItem value="10">10 tentativas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Determina quantas vezes o sistema tentará reenviar um webhook que falhou
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout da requisição</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 segundos</SelectItem>
                    <SelectItem value="10">10 segundos (recomendado)</SelectItem>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">60 segundos</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo máximo que o {integration.name} aguardará por uma resposta do seu servidor
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="event-log" className="flex items-center gap-2 cursor-pointer">
                  <Switch id="event-log" defaultChecked />
                  <span>Habilitar logs detalhados</span>
                </Label>
                <Badge variant="outline">Recomendado</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="idempotency-check" className="flex items-center gap-2 cursor-pointer">
                  <Switch id="idempotency-check" defaultChecked />
                  <span>Verificação de idempotência</span>
                </Label>
                <Badge variant="outline">Recomendado</Badge>
              </div>
            </div>
          </div>
        </div>
      ),
      5: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Validação e teste</h3>
            <p className="text-sm text-muted-foreground">
              Verifique se a integração está funcionando corretamente:
            </p>
            
            <div className="p-4 border rounded-lg bg-muted/30 mt-4">
              <h4 className="font-medium mb-3">Passos para validar</h4>
              <ol className="space-y-3 ml-6 list-decimal">
                <li>No painel do {integration.name}, envie um evento de teste</li>
                <li>Verifique nos logs do MetricsSaaS se o evento foi recebido</li>
                <li>Realize uma ação real (ex: criar um pedido) para testar o fluxo completo</li>
                <li>Configure alertas para falhas de entrega de webhook</li>
              </ol>
            </div>
            
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Status da validação</h4>
              <div className="p-4 border rounded-lg">
                <p className="text-sm">Nenhum evento recebido ainda. Realize um teste no {integration.name} para validar a integração.</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar eventos recebidos
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    }
    
    return baseSteps[stepId] || <div>Conteúdo não disponível para este passo</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Voltar
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
            {integration.icon}
          </div>
          <div>
            <h3 className="font-medium leading-none">{integration.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {integration.setupSteps} passos para configurar
            </p>
          </div>
        </div>
        
        <div className="ml-auto">
          <Link href={integration.docsUrl} target="_blank">
            <Button variant="ghost" size="sm">
              Documentação completa
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle>Assistente de Configuração</CardTitle>
              <Badge>
                Passo {activeStep} de {integration.setupSteps}
              </Badge>
            </div>
            <CardDescription>
              Siga o passo a passo para configurar a integração com {integration.name}
            </CardDescription>
          </div>
          <Progress value={(activeStep / integration.setupSteps) * 100} className="h-2" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-2">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div 
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border",
                          activeStep === step.id 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : activeStep > step.id
                              ? "bg-primary/20 text-primary border-primary/50"
                              : "bg-muted border-muted-foreground/20"
                        )}
                      >
                        {step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div 
                          className={cn(
                            "w-0.5 h-10", 
                            activeStep > step.id ? "bg-primary/50" : "bg-muted-foreground/20"
                          )} 
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-medium mb-4">
                    {steps.find(s => s.id === activeStep)?.title}
                  </h3>
                  
                  {getStepContent(activeStep)}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
          >
            Anterior
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="default"
              onClick={() => 
                activeStep === integration.setupSteps 
                  ? onBack()
                  : setActiveStep(Math.min(integration.setupSteps, activeStep + 1))
              }
            >
              {activeStep === integration.setupSteps ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 