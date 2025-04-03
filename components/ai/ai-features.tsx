"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Settings, 
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
  UserCog,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AnomalyDetectionSection } from "./anomaly-detection"
import { AutoInsightsSection } from "./auto-insights"
import { SmartSegmentationSection } from "./smart-segmentation"

export function AIFeatures() {
  const [activeTab, setActiveTab] = useState("anomalies")
  const [showConfig, setShowConfig] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Recursos de IA</h2>
          <p className="text-sm text-muted-foreground">
            Análise inteligente e automação dos seus dados
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowConfig(!showConfig)}
            className="transition-all duration-200"
          >
            <Settings className={cn(
              "h-4 w-4 mr-2",
              showConfig && "animate-spin"
            )} />
            {showConfig ? "Fechar Configurações" : "Configurar IA"}
          </Button>
          <Button className="transition-all duration-200 hover:scale-105">
            <Brain className="h-4 w-4 mr-2" />
            Treinar Modelo
          </Button>
        </div>
      </div>

      {showConfig && (
        <Card className="overflow-hidden border-primary/20">
          <CardHeader>
            <CardTitle>Configurações Gerais de IA</CardTitle>
            <CardDescription>
              Ajuste as configurações globais dos recursos de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger id="model" className="w-full">
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Mais preciso)</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 (Mais rápido)</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Modelo de IA usado para análise e geração
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="pt-BR">
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Idioma dos resultados e análises
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="confidence">Nível de Confiança</Label>
                  <Select defaultValue="high">
                    <SelectTrigger id="confidence" className="w-full">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alto (mais preciso)</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="low">Baixo (mais rápido)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Nível de confiança mínimo para resultados
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequência de Atualização</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="frequency" className="w-full">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Tempo real</SelectItem>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Com que frequência os dados são atualizados
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Recursos Ativos</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                    <Switch id="feature-anomalies" checked={true} className="mr-2" />
                    <Label htmlFor="feature-anomalies">Detecção de Anomalias</Label>
                  </div>
                  <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                    <Switch id="feature-insights" checked={true} className="mr-2" />
                    <Label htmlFor="feature-insights">Insights Automáticos</Label>
                  </div>
                  <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                    <Switch id="feature-segments" checked={true} className="mr-2" />
                    <Label htmlFor="feature-segments">Segmentação Inteligente</Label>
                  </div>
                  <div className="flex items-center p-2 rounded border hover:border-primary/50 transition-colors duration-200">
                    <Switch id="feature-predictions" checked={true} className="mr-2" />
                    <Label htmlFor="feature-predictions">Previsões</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas sobre descobertas importantes
                  </p>
                </div>
                <Switch id="notifications" checked={true} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button className="transition-all duration-200 hover:scale-105">
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="anomalies" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Detecção de Anomalias
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Insights Automáticos
          </TabsTrigger>
          <TabsTrigger 
            value="segments" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            <Users className="h-4 w-4 mr-2" />
            Segmentação Inteligente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="mt-6">
          <AnomalyDetectionSection />
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          <AutoInsightsSection />
        </TabsContent>
        <TabsContent value="segments" className="mt-6">
          <SmartSegmentationSection />
        </TabsContent>
      </Tabs>
    </div>
  )
} 