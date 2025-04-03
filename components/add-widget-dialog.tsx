"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, BarChart, PieChart, LineChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipos de gráficos suportados
type ChartType = "area" | "bar" | "line" | "pie"

// Períodos de tempo suportados
type TimeRange = "hour" | "day" | "week" | "month" | "year"

interface AddWidgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddWidget?: (widget: any) => void
}

export function AddWidgetDialog({ open, onOpenChange, onAddWidget }: AddWidgetDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [webhookId, setWebhookId] = useState("")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [timeRange, setTimeRange] = useState<TimeRange>("month")

  // Lista de webhooks disponíveis para seleção
  const availableWebhooks = [
    { id: "webhook-1", name: "Login Events" },
    { id: "webhook-2", name: "Purchase Events" },
    { id: "webhook-3", name: "Error Logs" },
    { id: "webhook-4", name: "User Registration" },
    { id: "webhook-5", name: "Product Views" },
  ]

  const handleAddWidget = () => {
    if (!title || !webhookId) return

    // Encontrar o nome do webhook selecionado
    const selectedWebhook = availableWebhooks.find(w => w.id === webhookId)
    
    // Criar um novo widget
    const newWidget = {
      id: `widget-${Date.now()}`,
      title,
      description,
      webhookId,
      webhookName: selectedWebhook?.name || webhookId,
      chartType,
      timeRange,
      size: "medium",
      fields: ["count"]
    }
    
    // Adicionar o widget
    if (onAddWidget) {
      onAddWidget(newWidget)
    }
    
    // Fechar o modal e resetar os campos
    onOpenChange(false)
    setTitle("")
    setDescription("")
    setWebhookId("")
    setChartType("area")
    setTimeRange("month")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Widget</DialogTitle>
          <DialogDescription>
            Configure um novo widget para monitorar dados do seu webhook.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Logins por Mês" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Ex: Monitoramento de logins agregados por mês" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="webhook">Webhook</Label>
            <Select value={webhookId} onValueChange={setWebhookId}>
              <SelectTrigger id="webhook">
                <SelectValue placeholder="Selecione um webhook" />
              </SelectTrigger>
              <SelectContent>
                {availableWebhooks.map(webhook => (
                  <SelectItem key={webhook.id} value={webhook.id}>
                    {webhook.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Tipo de Gráfico</Label>
            <Tabs defaultValue={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
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
            <Select value={timeRange} onValueChange={value => setTimeRange(value as TimeRange)}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddWidget} disabled={!title || !webhookId}>
            Adicionar Widget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 