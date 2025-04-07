"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Save, 
  RotateCcw, 
  LayoutGrid, 
  Download, 
  Filter, 
  Share2, 
  Settings, 
  RefreshCw,
  BarChart,
  PieChart,
  LineChart
} from "lucide-react"

import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardWidget } from "@/components/dashboard/dashboard-widget"
import { StatsCard } from "@/components/dashboard/cards/stats-card"
import { ChartCard } from "@/components/dashboard/cards/chart-card"
import { TableCard } from "@/components/dashboard/cards/table-card"
import { AreaCard } from "@/components/dashboard/cards/area-card"
import { PieCard } from "@/components/dashboard/cards/pie-card"
import { InteractiveBarCard } from "@/components/dashboard/cards/interactive-bar-card"
import { ABTestCard } from "@/components/dashboard/cards/ab-test-card"
import { WebhookMetricsCard } from "@/components/dashboard/cards/webhook-metrics-card"
import { DeviceMetricsCard } from "@/components/dashboard/cards/device-metrics-card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Unique ID generator
const generateId = () => `widget_${Math.random().toString(36).substr(2, 9)}`

export default function Dashboard() {
  const [widgets, setWidgets] = useState([
    { id: "stats1", type: "stats", colSpan: 1, rowSpan: 1, position: 0 },
    { id: "stats2", type: "stats", colSpan: 1, rowSpan: 1, position: 1 },
    { id: "area1", type: "area", colSpan: 2, rowSpan: 1, position: 2 },
    { id: "device1", type: "device", colSpan: 2, rowSpan: 2, position: 4 },
    { id: "pie1", type: "pie", colSpan: 2, rowSpan: 2, position: 6 },
    { id: "interactive1", type: "interactive", colSpan: 2, rowSpan: 2, position: 8 },
    { id: "abtest1", type: "abtest", colSpan: 2, rowSpan: 2, position: 10 },
    { id: "webhook1", type: "webhook", colSpan: 4, rowSpan: 2, position: 12 },
  ])

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [newWidgetType, setNewWidgetType] = useState("stats")
  const [layouts, setLayouts] = useState<{ [key: string]: any[] }>({
    "Layout Padrão": [...widgets],
  })
  const [currentLayout, setCurrentLayout] = useState("Layout Padrão")
  const [showGridLines, setShowGridLines] = useState(false)
  const [refreshingData, setRefreshingData] = useState(false)
  const [activeView, setActiveView] = useState("all")

  const handleResize = (id: string, colSpan: number, rowSpan: number) => {
    console.log(`Resizing widget ${id} to ${colSpan}x${rowSpan}`)
    setWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, colSpan, rowSpan } : widget)))
  }

  // Função para iniciar o arrasto
  const handleDragStart = (id: string) => {
    console.log(`Starting drag for widget ${id}`)
    setDraggedWidget(id)
  }

  // Função para processar quando um widget é arrastado sobre outro
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault() // Necessário para permitir o drop
    
    if (!draggedWidget || draggedWidget === id) return

    // Find positions
    const draggedIndex = widgets.findIndex((w) => w.id === draggedWidget)
    const targetIndex = widgets.findIndex((w) => w.id === id)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Create new array with swapped positions
    const newWidgets = [...widgets]
    const draggedPosition = newWidgets[draggedIndex].position
    newWidgets[draggedIndex].position = newWidgets[targetIndex].position
    newWidgets[targetIndex].position = draggedPosition

    // Sort by position
    newWidgets.sort((a, b) => a.position - b.position)

    setWidgets(newWidgets)
  }

  // Função para finalizar o arrasto
  const handleDragEnd = () => {
    console.log("Ending drag")
    setDraggedWidget(null)
  }

  // Função para processar o drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    console.log("Drop completed")
    handleDragEnd()
  }

  const handleAddWidget = () => {
    const newWidget = {
      id: generateId(),
      type: newWidgetType,
      colSpan: 1,
      rowSpan: 1,
      position: widgets.length,
    }

    setWidgets([...widgets, newWidget])
    toast({
      title: "Widget adicionado",
      description: `Um novo widget do tipo ${newWidgetType} foi adicionado ao dashboard.`,
    })
  }

  const handleRemoveWidget = (id: string) => {
    const newWidgets = widgets.filter((widget) => widget.id !== id)
    // Reorder positions
    newWidgets.forEach((widget, index) => {
      widget.position = index
    })
    setWidgets(newWidgets)
  }

  const handleSaveLayout = () => {
    const layoutName = prompt("Nome do layout:", currentLayout)
    if (!layoutName) return

    setLayouts({
      ...layouts,
      [layoutName]: [...widgets],
    })
    setCurrentLayout(layoutName)

    toast({
      title: "Layout salvo",
      description: `O layout "${layoutName}" foi salvo com sucesso.`,
    })
  }

  const handleLoadLayout = (layoutName: string) => {
    if (layouts[layoutName]) {
      setWidgets([...layouts[layoutName]])
      setCurrentLayout(layoutName)

      toast({
        title: "Layout carregado",
        description: `O layout "${layoutName}" foi carregado com sucesso.`,
      })
    }
  }

  const handleRefresh = () => {
    setRefreshingData(true)
    // Simulando uma atualização de dados
    setTimeout(() => {
      setRefreshingData(false)
      toast({
        title: "Dashboard atualizado",
        description: "Os dados foram atualizados com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Modular Dashboard</h1>
              <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 h-7">
                Personalizado
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Última atualização: {new Date().toLocaleString('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit',
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Dashboard com componentes modulares e personalizáveis para visualização de métricas variadas.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
            <CalendarDateRangePicker />
            
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrar dados</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filtros de Visualização</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LineChart className="mr-2 h-4 w-4" />
                  Gráficos Lineares
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PieChart className="mr-2 h-4 w-4" />
                  Gráficos de Pizza
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart className="mr-2 h-4 w-4" />
                  Gráficos de Barra
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Exportar Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Exportar como Imagem
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Exportar Dados (CSV)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compartilhar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Compartilhar Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Gerar link compartilhável
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Enviar por e-mail
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Agendar relatório
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configurações</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button disabled={refreshingData} onClick={handleRefresh}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshingData ? "animate-spin" : ""}`} />
              {refreshingData ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Widgets</span>
              <span className="text-2xl font-semibold">{widgets.length}</span>
            </div>
            <div className="h-full w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Webhooks Ativos</span>
              <span className="text-2xl font-semibold">5</span>
            </div>
            <div className="h-full w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Layouts Salvos</span>
              <span className="text-2xl font-semibold">{Object.keys(layouts).length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs defaultValue={activeView} onValueChange={setActiveView}>
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs px-3">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs px-3">
                  Métricas
                </TabsTrigger>
                <TabsTrigger value="charts" className="text-xs px-3">
                  Gráficos
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={currentLayout} onValueChange={handleLoadLayout}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Selecione um layout" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(layouts).map((layout) => (
                  <SelectItem key={layout} value={layout}>
                    {layout}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleSaveLayout} className="h-9">
              <Save className="h-4 w-4 mr-2" />
              Salvar Layout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Widget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Widget</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <label className="block text-sm font-medium mb-2">Tipo de Widget</label>
              <Select value={newWidgetType} onValueChange={setNewWidgetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stats">Estatísticas</SelectItem>
                  <SelectItem value="chart">Gráfico Linear</SelectItem>
                  <SelectItem value="table">Tabela</SelectItem>
                  <SelectItem value="area">Gráfico de Área</SelectItem>
                  <SelectItem value="pie">Gráfico de Pizza</SelectItem>
                  <SelectItem value="interactive">Gráfico de Barras Interativo</SelectItem>
                  <SelectItem value="abtest">Teste A/B</SelectItem>
                  <SelectItem value="webhook">Métricas de Webhook</SelectItem>
                  <SelectItem value="device">Métricas de Dispositivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWidget}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant={showGridLines ? "default" : "outline"}
          onClick={() => setShowGridLines(!showGridLines)}
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          {showGridLines ? "Ocultar Grid" : "Mostrar Grid"}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("Restaurar o layout padrão?")) {
              handleLoadLayout("Layout Padrão")
            }
          }}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Restaurar Padrão
        </Button>
      </div>

      <div
        className={cn(
          "relative",
          showGridLines &&
            "before:absolute before:inset-0 before:grid before:grid-cols-4 before:gap-4 before:content-[''] before:border-dashed before:border-pink-200 before:border-2 before:z-0 before:pointer-events-none",
        )}
      >
        <DashboardGrid columns={4}>
          {widgets
            .sort((a, b) => a.position - b.position)
            .map((widget) => (
              <DashboardWidget
                key={widget.id}
                id={widget.id}
                colSpan={widget.colSpan}
                rowSpan={widget.rowSpan}
                onResize={handleResize}
                onDragStart={() => handleDragStart(widget.id)}
                onDragOver={(e) => handleDragOver(e, widget.id)}
                onDragEnd={handleDragEnd}
                onRemove={() => handleRemoveWidget(widget.id)}
                isDragging={draggedWidget === widget.id}
              >
                {widget.type === "stats" && <StatsCard />}
                {widget.type === "chart" && <ChartCard />}
                {widget.type === "table" && <TableCard />}
                {widget.type === "area" && <AreaCard />}
                {widget.type === "pie" && <PieCard />}
                {widget.type === "interactive" && <InteractiveBarCard />}
                {widget.type === "abtest" && <ABTestCard />}
                {widget.type === "webhook" && <WebhookMetricsCard />}
                {widget.type === "device" && <DeviceMetricsCard />}
              </DashboardWidget>
            ))}
        </DashboardGrid>
      </div>
    </div>
  )
}

