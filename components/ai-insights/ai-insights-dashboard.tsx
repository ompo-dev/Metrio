"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from "recharts"
import { 
  AlertTriangle, 
  ArrowRight, 
  Brain, 
  LineChart as LineChartIcon, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Share2, 
  Zap, 
  Users, 
  Activity, 
  ShoppingCart,
  Clock,
  BellRing,
  X,
  ChevronDown,
  Check,
  BookOpen,
  Lightbulb,
  ExternalLink,
  BrainCircuit
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dados de exemplo para gráficos
const engagementData = [
  { name: "Jan", ativos: 4000, novos: 2400 },
  { name: "Fev", ativos: 3000, novos: 1398 },
  { name: "Mar", ativos: 2000, novos: 9800 },
  { name: "Abr", ativos: 2780, novos: 3908 },
  { name: "Mai", ativos: 1890, novos: 4800 },
  { name: "Jun", ativos: 2390, novos: 3800 },
  { name: "Jul", ativos: 3490, novos: 4300 },
]

export function AiInsightsDashboard() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [insightFilter, setInsightFilter] = useState("all")
  
  const sentimentData = [
    { name: "Positivo", value: 65, color: "hsl(var(--success))" },
    { name: "Neutro", value: 25, color: "hsl(var(--muted-foreground))" },
    { name: "Negativo", value: 10, color: "hsl(var(--destructive))" },
  ]
  
  // Dados para gráfico de conversão
  const conversionData = [
    { name: "Visitas", value: 12500 },
    { name: "Registros", value: 5400 },
    { name: "Compras", value: 1800 },
  ]

  // Lista de novos insights
  const newInsights = [
    {
      id: 1,
      title: "Pico de conversão detectado",
      description: "A taxa de conversão aumentou 23% nas últimas 24h",
      type: "opportunity",
      date: "Há 2 horas",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />
    },
    {
      id: 2,
      title: "Possível problema no checkout",
      description: "Aumento de 18% nos abandonos no checkout móvel",
      type: "alert",
      date: "Há 5 horas",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
    },
    {
      id: 3,
      title: "Nova tendência de uso",
      description: "Aumento no uso do produto X por segmento Y",
      type: "trend",
      date: "Hoje, 09:45",
      icon: <Activity className="h-5 w-5 text-blue-500" />
    }
  ]

  return (
    <div className="space-y-6">
      {/* Barra de filtros e ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg">
        <div className="flex flex-wrap gap-3">
          <Button 
            variant={selectedPeriod === "week" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("week")}
          >
            Semana
          </Button>
          <Button 
            variant={selectedPeriod === "month" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("month")}
          >
            Mês
          </Button>
          <Button 
            variant={selectedPeriod === "quarter" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("quarter")}
          >
            Trimestre
          </Button>
          <Button 
            variant={selectedPeriod === "year" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("year")}
          >
            Ano
          </Button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder="Buscar insights..." 
            className="h-9 w-full sm:w-[200px]" 
          />
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <BellRing className="h-4 w-4 mr-2" />
              Notificações
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
            </Button>
            
            {notificationsOpen && (
              <Card className="absolute right-0 top-[calc(100%+5px)] w-[350px] z-50">
                <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Novos Insights</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[250px] pr-3">
                    <div className="space-y-2">
                      {newInsights.map(insight => (
                        <div 
                          key={insight.id} 
                          className="flex p-2 gap-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                        >
                          <div className="mt-0.5">{insight.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{insight.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={
                                  insight.type === "opportunity" 
                                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" 
                                    : insight.type === "alert"
                                    ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                    : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                }
                              >
                                {insight.type === "opportunity" ? "Oportunidade" : insight.type === "alert" ? "Alerta" : "Tendência"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">{insight.date}</span>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Ver detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-2 border-t">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Ver todos os insights
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
                <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Dashboard completo</DropdownMenuItem>
              <DropdownMenuItem>Apenas insights</DropdownMenuItem>
              <DropdownMenuItem>Apenas métricas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* KPIs principais */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs">
              <Users className="h-3.5 w-3.5 mr-1" />
              Usuários Ativos
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">12,874</div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                +8.2% <TrendingUp className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs">
              <Activity className="h-3.5 w-3.5 mr-1" />
              Taxa de Conversão
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">3.7%</div>
              <Badge className="bg-red-50 text-red-700 border-red-200">
                -1.3% <TrendingUp className="h-3 w-3 ml-1 rotate-180" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs">
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Vendas Totais
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">R$ 87.4k</div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                +12.5% <TrendingUp className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Tempo Médio
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">8m 42s</div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                +3.1% <TrendingUp className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="sentiment">Análise de Sentimentos</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Insights Inteligentes</h3>
          <div className="flex gap-2">
            <Button 
              variant={insightFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setInsightFilter("all")}
              className="h-8"
            >
              Todos
            </Button>
            <Button 
              variant={insightFilter === "opportunities" ? "default" : "outline"} 
              size="sm"
              onClick={() => setInsightFilter("opportunities")}
              className="h-8"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Oportunidades
            </Button>
            <Button 
              variant={insightFilter === "alerts" ? "default" : "outline"} 
              size="sm"
              onClick={() => setInsightFilter("alerts")}
              className="h-8"
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              Alertas
            </Button>
            <Button 
              variant={insightFilter === "trends" ? "default" : "outline"} 
              size="sm"
              onClick={() => setInsightFilter("trends")}
              className="h-8"
            >
              <Activity className="h-3.5 w-3.5 mr-1.5" />
              Tendências
            </Button>
          </div>
        </div>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Oportunidade de Crescimento</span>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Importante</Badge>
                </CardTitle>
                <CardDescription>Baseado em análise de padrões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Usuários que acessam via dispositivos móveis têm 2.5x mais chances de finalizar compras quando
                      recebem notificações push.
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" />
                        Confiança Alta
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Atualizado hoje
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="h-8">
                        Implementar <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-destructive">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Alerta de Conversão</span>
                  <Badge variant="destructive">Crítico</Badge>
                </CardTitle>
                <CardDescription>Queda detectada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      A taxa de conversão de visualizações para compras caiu 8% na última semana. Recomendamos revisar a
                      jornada de compra.
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                        <Check className="h-3 w-3 mr-1" />
                        Confiança Média
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Há 2 dias
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="h-8">
                        Investigar <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Comportamento do Usuário</span>
                  <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Insight</Badge>
                </CardTitle>
                <CardDescription>Padrão identificado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Brain className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Usuários tendem a abandonar o carrinho após 3 minutos de inatividade. Recomendamos implementar
                      lembretes automáticos.
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" />
                        Confiança Alta
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Há 3 dias
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="h-8">
                        Implementar <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Análise de Sentimentos</CardTitle>
                <CardDescription>Distribuição de sentimentos baseada em feedback e interações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Comentários Recentes</CardTitle>
                <CardDescription>Análise de sentimentos em comentários e feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Usuário #12345</p>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Positivo</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    "Adorei a nova interface! Muito mais fácil de encontrar o que preciso e finalizar minhas compras."
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Usuário #67890</p>
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Neutro</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    "O produto chegou no prazo, mas a embalagem estava um pouco danificada. O produto em si está
                    funcionando bem."
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Usuário #54321</p>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Negativo</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    "Tive problemas com o pagamento, tentei várias vezes e não consegui finalizar a compra. Precisei
                    entrar em contato com o suporte."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tendência de Crescimento</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <LineChart className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      Os cadastros via mobile aumentaram 23% em relação ao mês anterior, indicando uma tendência de
                      crescimento neste canal.
                    </p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Tendência Alta</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Comportamento Sazonal</CardTitle>
                <CardDescription>Padrão identificado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <LineChart className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      Detectamos um aumento de 35% nas compras durante os finais de semana, especialmente entre 10h e 14h.
                    </p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Padrão Confirmado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Correlação Identificada</CardTitle>
                <CardDescription>Análise multivariada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Brain className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      Usuários que visitam a página de blog antes da página de produtos têm 45% mais chances de finalizar
                      uma compra.
                    </p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Correlação Forte</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previsões de Crescimento</CardTitle>
              <CardDescription>Projeções baseadas em análise de tendências históricas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Cadastros</Badge>
                    <span className="text-sm font-medium">+15% projetado</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Confiança: 85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Compras</Badge>
                    <span className="text-sm font-medium">+8% projetado</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Confiança: 72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Receita</Badge>
                    <span className="text-sm font-medium">+12% projetado</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Confiança: 78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Anomalias Detectadas</CardTitle>
                <CardDescription>
                  Padrões incomuns identificados nos seus dados que podem requerer atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                        Queda em Conversões
                      </h4>
                      <Badge variant="destructive">Crítico</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Queda abrupta de 32% nas conversões entre 15/10 e 18/10. Coincide com problemas reportados no
                      gateway de pagamento.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      Investigar <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        Pico de Tráfego Incomum
                      </h4>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        Médio
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aumento de 300% no tráfego em 22/10 às 14h. Origem identificada: campanha de marketing não
                      documentada.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      Investigar <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Análise de Impacto</CardTitle>
                <CardDescription>Estimativa do impacto das anomalias detectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Impacto em Receita</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-destructive h-2.5 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Estimativa de perda de receita: R$ 12.500,00</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Impacto em Usuários</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Aproximadamente 850 usuários afetados</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 mt-4">
                    <h4 className="text-sm font-medium mb-1">Recomendação da IA</h4>
                    <p className="text-xs">
                      Implementar monitoramento em tempo real para o gateway de pagamento e criar um plano de
                      contingência para falhas similares no futuro.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

