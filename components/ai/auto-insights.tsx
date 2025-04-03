"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  Clock, 
  Filter, 
  RefreshCw,
  ShoppingCart,
  Users,
  TrendingUp,
  Target,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AutoInsightsSection() {
  const [insights, setInsights] = useState([
    {
      id: "insight_1",
      title: "Aumento significativo na taxa de conversão",
      description: "A taxa de conversão aumentou 25% em relação ao mês anterior, impulsionada por melhorias no checkout.",
      date: "2023-07-21T08:45:00Z",
      source: "Análise de Vendas",
      saved: false,
      category: "vendas"
    },
    {
      id: "insight_2",
      title: "Padrão de abandono de carrinho",
      description: "Identificado um padrão de abandono de carrinho após 3 minutos de inatividade.",
      date: "2023-07-20T14:15:00Z",
      source: "Análise de Comportamento",
      saved: true,
      category: "comportamento"
    },
    {
      id: "insight_3",
      title: "Otimização de preços recomendada",
      description: "Análise sugere ajuste de preços em 3 categorias para maximizar receita.",
      date: "2023-07-19T10:30:00Z",
      source: "Análise de Preços",
      saved: false,
      category: "precos"
    },
    {
      id: "insight_4",
      title: "Tendência de crescimento em segmento",
      description: "Segmento de usuários premium mostra crescimento consistente de 15% ao mês.",
      date: "2023-07-18T16:20:00Z",
      source: "Análise de Segmentos",
      saved: true,
      category: "segmentos"
    }
  ])

  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vendas':
        return <ShoppingCart className="h-5 w-5" />
      case 'comportamento':
        return <Users className="h-5 w-5" />
      case 'precos':
        return <TrendingUp className="h-5 w-5" />
      case 'segmentos':
        return <Target className="h-5 w-5" />
      default:
        return <BarChart3 className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vendas':
        return 'text-blue-500'
      case 'comportamento':
        return 'text-purple-500'
      case 'precos':
        return 'text-green-500'
      case 'segmentos':
        return 'text-amber-500'
      default:
        return 'text-slate-500'
    }
  }

  const handleGenerateInsights = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 2000)
  }

  const toggleSaveInsight = (id: string) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, saved: !insight.saved } : insight
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Insights Automáticos</h3>
          <p className="text-sm text-muted-foreground">
            Análises inteligentes sobre seus dados
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateInsights}
            disabled={isGenerating}
            className="transition-all duration-200"
          >
            <Zap className={cn(
              "h-4 w-4 mr-2",
              isGenerating && "animate-pulse"
            )} />
            {isGenerating ? "Gerando insights..." : "Gerar insights"}
          </Button>
          <Button className="transition-all duration-200 hover:scale-105">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Insights Recentes</CardTitle>
          <CardDescription>
            Insights gerados nos últimos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map(insight => (
              <div 
                key={insight.id} 
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200",
                  "hover:bg-slate-50 group cursor-pointer",
                  selectedInsight === insight.id && 'border-primary shadow-md'
                )}
                onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-1 p-2 rounded-full transition-all duration-200",
                      getCategoryColor(insight.category),
                      "bg-opacity-10 group-hover:bg-opacity-20"
                    )}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center">
                        {insight.title}
                        <span className="text-sm text-muted-foreground ml-2">
                          {new Date(insight.date).toLocaleDateString()}
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.source}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          getCategoryColor(insight.category)
                        )}>
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSaveInsight(insight.id)
                      }}
                    >
                      {insight.saved ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <ChevronRight className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      selectedInsight === insight.id && "rotate-90"
                    )} />
                  </div>
                </div>
                
                {selectedInsight === insight.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Detalhes do insight
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Atualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clock className="h-4 w-4 mr-2" />
                          Agendar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Categoria:</span>{' '}
                        <span className={cn(
                          "font-medium",
                          getCategoryColor(insight.category)
                        )}>
                          {insight.category === 'vendas' ? 'Vendas' : 
                           insight.category === 'comportamento' ? 'Comportamento' :
                           insight.category === 'precos' ? 'Preços' : 'Segmentos'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fonte:</span>{' '}
                        <span className="font-medium">{insight.source}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência de geração</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="frequency" className="w-full">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Com que frequência novos insights são gerados
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="depth">Profundidade da análise</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="depth" className="w-full">
                    <SelectValue placeholder="Selecione a profundidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básica (mais rápida)</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="deep">Profunda (mais detalhada)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Nível de detalhamento das análises
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Categorias de insights</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="category-sales" checked={true} className="mr-2" />
                  <Label htmlFor="category-sales">Vendas</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="category-behavior" checked={true} className="mr-2" />
                  <Label htmlFor="category-behavior">Comportamento</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="category-pricing" checked={true} className="mr-2" />
                  <Label htmlFor="category-pricing">Preços</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="category-segments" checked={true} className="mr-2" />
                  <Label htmlFor="category-segments">Segmentos</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notification-insights" className="font-medium">Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber alertas quando novos insights forem gerados
                </p>
              </div>
              <Switch id="notification-insights" checked={true} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button className="transition-all duration-200 hover:scale-105">
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 