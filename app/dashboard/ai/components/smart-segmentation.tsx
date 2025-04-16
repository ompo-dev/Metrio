"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  ChevronRight, 
  Clock, 
  Filter, 
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Target,
  Zap,
  UserPlus,
  UserCheck,
  UserX,
  UserCog
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SmartSegmentationSection() {
  const [segments, setSegments] = useState([
    {
      id: "segment_1",
      name: "Usuários Premium",
      description: "Usuários com alto valor de vida e engajamento consistente",
      size: 1250,
      growth: 15,
      attributes: ["Alto valor", "Engajamento", "Fidelidade"],
      status: "active"
    },
    {
      id: "segment_2",
      name: "Usuários em Risco",
      description: "Usuários com sinais de abandono ou redução de uso",
      size: 850,
      growth: -8,
      attributes: ["Baixo engajamento", "Risco de churn", "Inatividade"],
      status: "warning"
    },
    {
      id: "segment_3",
      name: "Usuários Novos",
      description: "Usuários recém-cadastrados nos últimos 30 dias",
      size: 2100,
      growth: 25,
      attributes: ["Novos", "Alto potencial", "Em adaptação"],
      status: "active"
    },
    {
      id: "segment_4",
      name: "Usuários Inativos",
      description: "Usuários sem atividade nos últimos 90 dias",
      size: 450,
      growth: -12,
      attributes: ["Inativos", "Baixo valor", "Churn"],
      status: "inactive"
    }
  ])

  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'warning':
        return 'text-amber-500'
      case 'inactive':
        return 'text-red-500'
      default:
        return 'text-slate-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-5 w-5" />
      case 'warning':
        return <UserCog className="h-5 w-5" />
      case 'inactive':
        return <UserX className="h-5 w-5" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  const handleGenerateSegments = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Segmentação Inteligente</h3>
          <p className="text-sm text-muted-foreground">
            Identificação automática de grupos de usuários
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateSegments}
            disabled={isGenerating}
            className="transition-all duration-200"
          >
            <Zap className={cn(
              "h-4 w-4 mr-2",
              isGenerating && "animate-pulse"
            )} />
            {isGenerating ? "Gerando segmentos..." : "Gerar segmentos"}
          </Button>
          <Button className="transition-all duration-200 hover:scale-105">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Segmentos Identificados</CardTitle>
          <CardDescription>
            Segmentos gerados automaticamente baseados em comportamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {segments.map(segment => (
              <div 
                key={segment.id} 
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200",
                  "hover:bg-slate-50 group cursor-pointer",
                  selectedSegment === segment.id && 'border-primary shadow-md'
                )}
                onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-1 p-2 rounded-full transition-all duration-200",
                      getStatusColor(segment.status),
                      "bg-opacity-10 group-hover:bg-opacity-20"
                    )}>
                      {getStatusIcon(segment.status)}
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center">
                        {segment.name}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "ml-2",
                            segment.growth > 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {segment.growth > 0 ? '+' : ''}{segment.growth}%
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {segment.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {segment.size} usuários
                        </Badge>
                        {segment.attributes.map(attr => (
                          <Badge 
                            key={attr} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    selectedSegment === segment.id && "rotate-90"
                  )} />
                </div>
                
                {selectedSegment === segment.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Detalhes do segmento
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar usuários
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Atualizar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>{' '}
                        <span className={cn(
                          "font-medium",
                          getStatusColor(segment.status)
                        )}>
                          {segment.status === 'active' ? 'Ativo' : 
                           segment.status === 'warning' ? 'Em risco' : 'Inativo'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tamanho:</span>{' '}
                        <span className="font-medium">{segment.size} usuários</span>
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
          <CardTitle>Configurações de Segmentação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência de atualização</Label>
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
                  Com que frequência os segmentos são atualizados
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Sensibilidade</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="sensitivity" className="w-full">
                    <SelectValue placeholder="Selecione a sensibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa (segmentos maiores)</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta (segmentos menores)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Nível de granularidade dos segmentos
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Critérios de segmentação</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="criteria-value" checked={true} className="mr-2" />
                  <Label htmlFor="criteria-value">Valor do usuário</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="criteria-engagement" checked={true} className="mr-2" />
                  <Label htmlFor="criteria-engagement">Engajamento</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="criteria-behavior" checked={true} className="mr-2" />
                  <Label htmlFor="criteria-behavior">Comportamento</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="criteria-demographics" checked={true} className="mr-2" />
                  <Label htmlFor="criteria-demographics">Demográficos</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notification-segments" className="font-medium">Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber alertas quando novos segmentos forem identificados
                </p>
              </div>
              <Switch id="notification-segments" checked={true} />
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