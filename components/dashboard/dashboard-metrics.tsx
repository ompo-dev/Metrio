"use client"

import { Suspense, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsOverview } from "@/components/metrics/metrics-overview"
import { MetricsAnalytics } from "@/components/metrics/metrics-analytics"
import { MetricsReports } from "@/components/metrics/metrics-reports"
import { MetricsOverviewSkeleton } from "@/components/skeletons/metrics-overview-skeleton"
import { AreaChart, BarChart, LineChart, FileText, Plus, PieChart, Grid } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardWidgets } from "@/components/dashboard/dashboard-widgets"

// Tipos para o diálogo de adição de widgets
type ChartType = "area" | "bar" | "line" | "pie"
type TimeRange = "hour" | "day" | "week" | "month" | "year"

export function DashboardMetrics() {
  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("personalizado");
  
  // Estados para o formulário de adicionar widget
  const [newWidgetTitle, setNewWidgetTitle] = useState("");
  const [newWebhookId, setNewWebhookId] = useState("");
  const [newChartType, setNewChartType] = useState<ChartType>("area");
  const [newTimeRange, setNewTimeRange] = useState<TimeRange>("day");
  
  // Função para resetar o formulário
  const resetForm = () => {
    setNewWidgetTitle("");
    setNewWebhookId("");
    setNewChartType("area");
    setNewTimeRange("day");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personalizado" className="flex items-center gap-2">
          <Grid className="h-4 w-4" />
          <span>Dashboard Personalizado</span>
        </TabsTrigger>
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          <span>Visão Geral</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span>Análises</span>
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Relatórios</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="personalizado" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard Personalizado</h2>
          <Button onClick={() => setShowAddWidgetDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Widget
          </Button>
        </div>
        
        <DashboardWidgets />
        
        <Dialog open={showAddWidgetDialog} onOpenChange={setShowAddWidgetDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Widget</DialogTitle>
              <DialogDescription>
                Crie um novo widget para monitorar dados específicos
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Widget</Label>
                <Input
                  id="title"
                  placeholder="Ex: Logins por Mês"
                  value={newWidgetTitle}
                  onChange={(e) => setNewWidgetTitle(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="webhook">Webhook</Label>
                <Select value={newWebhookId} onValueChange={setNewWebhookId}>
                  <SelectTrigger id="webhook">
                    <SelectValue placeholder="Selecione um webhook" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="login">Eventos de Login</SelectItem>
                    <SelectItem value="cadastro">Eventos de Cadastro</SelectItem>
                    <SelectItem value="compra">Eventos de Compra</SelectItem>
                    <SelectItem value="erro">Logs de Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Tipo de Gráfico</Label>
                <Tabs defaultValue={newChartType} onValueChange={(value) => setNewChartType(value as ChartType)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="area" className="flex items-center gap-1">
                      <AreaChart className="h-4 w-4" />
                      <span className="hidden sm:inline">Área</span>
                    </TabsTrigger>
                    <TabsTrigger value="bar" className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      <span className="hidden sm:inline">Barras</span>
                    </TabsTrigger>
                    <TabsTrigger value="line" className="flex items-center gap-1">
                      <LineChart className="h-4 w-4" />
                      <span className="hidden sm:inline">Linha</span>
                    </TabsTrigger>
                    <TabsTrigger value="pie" className="flex items-center gap-1">
                      <PieChart className="h-4 w-4" />
                      <span className="hidden sm:inline">Pizza</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timeRange">Período de Tempo</Label>
                <Select value={newTimeRange} onValueChange={value => setNewTimeRange(value as TimeRange)}>
                  <SelectTrigger id="timeRange">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Por Hora</SelectItem>
                    <SelectItem value="day">Por Dia</SelectItem>
                    <SelectItem value="week">Por Semana</SelectItem>
                    <SelectItem value="month">Por Mês</SelectItem>
                    <SelectItem value="year">Por Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setShowAddWidgetDialog(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Aqui você adicionaria o widget através do contexto ou outro mecanismo
                resetForm();
                setShowAddWidgetDialog(false);
              }} disabled={!newWidgetTitle || !newWebhookId}>
                Adicionar Widget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
      
      <TabsContent value="overview" className="space-y-4">
        <Suspense fallback={<MetricsOverviewSkeleton />}>
          <MetricsOverview />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-4">
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-muted" />}>
          <MetricsAnalytics />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-4">
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-muted" />}>
          <MetricsReports />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

