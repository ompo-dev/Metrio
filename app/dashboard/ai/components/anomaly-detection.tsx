"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Search, RefreshCw, ChevronRight, XCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function AnomalyDetectionSection() {
  const [anomalies, setAnomalies] = useState([
    {
      id: "anomaly_1",
      metric: "Cadastros",
      date: "2023-07-21T08:45:00Z",
      expected: 125,
      actual: 312,
      severity: "high",
      status: "open"
    },
    {
      id: "anomaly_2",
      metric: "Taxa de Conversão",
      date: "2023-07-20T14:15:00Z",
      expected: "2.3%",
      actual: "1.1%",
      severity: "medium",
      status: "investigating"
    },
    {
      id: "anomaly_3",
      metric: "Tempo Médio de Sessão",
      date: "2023-07-19T10:30:00Z",
      expected: "4m12s",
      actual: "1m45s",
      severity: "high",
      status: "resolved"
    },
    {
      id: "anomaly_4",
      metric: "Taxa de Abandono",
      date: "2023-07-17T16:20:00Z",
      expected: "15%",
      actual: "28%",
      severity: "medium",
      status: "resolved"
    }
  ])

  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-amber-500'
      case 'low': return 'text-blue-500'
      default: return 'text-slate-500'
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive" className="animate-pulse">Não resolvido</Badge>
      case 'investigating':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Investigando</Badge>
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Resolvido</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Detecção de Anomalias</h3>
          <p className="text-sm text-muted-foreground">
            Identificação automática de padrões incomuns em seus dados
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="transition-all duration-200"
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2",
              isRefreshing && "animate-spin"
            )} />
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button className="transition-all duration-200 hover:scale-105">
            <Search className="h-4 w-4 mr-2" />
            Analisar dados
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Anomalias Detectadas</CardTitle>
          <CardDescription>
            Anomalias identificadas nos últimos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map(anomaly => (
              <div 
                key={anomaly.id} 
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200",
                  anomaly.status === 'resolved' ? 'bg-slate-50' : 'hover:bg-slate-50',
                  selectedAnomaly === anomaly.id && 'border-primary shadow-md',
                  'group cursor-pointer'
                )}
                onClick={() => setSelectedAnomaly(selectedAnomaly === anomaly.id ? null : anomaly.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-1 p-2 rounded-full transition-all duration-200",
                      getSeverityColor(anomaly.severity),
                      "bg-opacity-10 group-hover:bg-opacity-20"
                    )}>
                      <AlertCircle className={cn(
                        "h-5 w-5",
                        getSeverityColor(anomaly.severity)
                      )} />
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center">
                        {anomaly.metric}
                        <span className="text-sm text-muted-foreground ml-2">
                          {new Date(anomaly.date).toLocaleDateString()}
                        </span>
                      </h4>
                      <div className="mt-1 flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Esperado:</span>{' '}
                          <span className="font-medium">{anomaly.expected}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Atual:</span>{' '}
                          <span className={cn(
                            "font-medium",
                            getSeverityColor(anomaly.severity)
                          )}>
                            {anomaly.actual}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(anomaly.status)}
                    <ChevronRight className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      selectedAnomaly === anomaly.id && "rotate-90"
                    )} />
                  </div>
                </div>
                
                {selectedAnomaly === anomaly.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Detalhes da anomalia
                      </div>
                      <div className="flex gap-2">
                        {(anomaly.status === 'open' || anomaly.status === 'investigating') && (
                          <>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4 mr-2" />
                              Ignorar
                            </Button>
                            <Button variant="outline" size="sm">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Marcar como resolvido
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Severidade:</span>{' '}
                        <span className={cn(
                          "font-medium",
                          getSeverityColor(anomaly.severity)
                        )}>
                          {anomaly.severity === 'high' ? 'Alta' : anomaly.severity === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>{' '}
                        <span className="font-medium">
                          {anomaly.status === 'open' ? 'Não resolvido' : 
                           anomaly.status === 'investigating' ? 'Investigando' : 'Resolvido'}
                        </span>
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
          <CardTitle>Configurações de Detecção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Sensibilidade</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="sensitivity" className="w-full">
                    <SelectValue placeholder="Selecione a sensibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa (menos alertas)</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta (mais alertas)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controla a sensibilidade da detecção de anomalias
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência de análise</Label>
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
                  Com que frequência os dados são analisados
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Métricas monitoradas</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="metric-signups" checked={true} className="mr-2" />
                  <Label htmlFor="metric-signups">Cadastros</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="metric-conversions" checked={true} className="mr-2" />
                  <Label htmlFor="metric-conversions">Taxas de conversão</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="metric-revenue" checked={true} className="mr-2" />
                  <Label htmlFor="metric-revenue">Receita</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="metric-engagement" checked={true} className="mr-2" />
                  <Label htmlFor="metric-engagement">Engajamento</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="metric-retention" checked={true} className="mr-2" />
                  <Label htmlFor="metric-retention">Retenção</Label>
                </div>
                <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                  <Switch id="metric-errors" checked={false} className="mr-2" />
                  <Label htmlFor="metric-errors">Erros</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notification-anomaly" className="font-medium">Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber alertas quando anomalias forem detectadas
                </p>
              </div>
              <Switch id="notification-anomaly" checked={true} />
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