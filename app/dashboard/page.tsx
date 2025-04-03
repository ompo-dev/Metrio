"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Plus, Save, RotateCcw, LayoutGrid } from "lucide-react"

import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardWidget } from "@/components/dashboard/dashboard-widget"
import { StatsCard } from "@/components/stats-card"
import { ChartCard } from "@/components/chart-card"
import { TableCard } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Unique ID generator
const generateId = () => `widget_${Math.random().toString(36).substr(2, 9)}`

export default function Dashboard() {
  const [widgets, setWidgets] = useState([
    { id: "stats1", type: "stats", colSpan: 1, rowSpan: 1, position: 0 },
    { id: "stats2", type: "stats", colSpan: 1, rowSpan: 1, position: 1 },
    { id: "stats3", type: "stats", colSpan: 1, rowSpan: 1, position: 2 },
    { id: "stats4", type: "stats", colSpan: 1, rowSpan: 1, position: 3 },
    { id: "chart1", type: "chart", colSpan: 2, rowSpan: 2, position: 4 },
    { id: "chart2", type: "chart", colSpan: 2, rowSpan: 2, position: 6 },
    { id: "table1", type: "table", colSpan: 4, rowSpan: 2, position: 8 },
  ])

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [newWidgetType, setNewWidgetType] = useState("stats")
  const [layouts, setLayouts] = useState<{ [key: string]: any[] }>({
    "Layout Padrão": [...widgets],
  })
  const [currentLayout, setCurrentLayout] = useState("Layout Padrão")
  const [showGridLines, setShowGridLines] = useState(false)

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

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Modular Dashboard</h1>
        <p className="text-muted-foreground">Dashboard com componentes modulares e personalizáveis</p>
      </header>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h2 className="font-medium text-amber-800">Instruções:</h2>
        <ul className="text-amber-700 list-disc pl-5 space-y-1">
          <li>
            <strong>Redimensionar:</strong> Clique no ícone de grade
            <span className="inline-flex items-center justify-center mx-1 bg-amber-100 rounded p-0.5">
              <LayoutGrid className="h-3 w-3 text-amber-700" />
            </span>
            e selecione o tamanho desejado
          </li>
          <li>
            <strong>Mover:</strong> Clique e arraste a alça "Mover" no topo para reposicionar
          </li>
          <li>
            <strong>Adicionar:</strong> Use o botão "+" para adicionar novos componentes
          </li>
          <li>
            <strong>Remover:</strong> Clique no "X" no canto superior direito para remover
          </li>
          <li>
            <strong>Minimizar:</strong> Use o botão ao lado do "X" para colapsar/expandir
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
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
                    <SelectItem value="chart">Gráfico</SelectItem>
                    <SelectItem value="table">Tabela</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button onClick={handleAddWidget}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleSaveLayout}>
            <Save className="h-4 w-4 mr-1" />
            Salvar Layout
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGridLines(!showGridLines)}
            className={showGridLines ? "bg-muted" : ""}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            {showGridLines ? "Ocultar Grid" : "Mostrar Grid"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select value={currentLayout} onValueChange={handleLoadLayout}>
            <SelectTrigger className="w-[180px]">
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Restaurar o layout padrão?")) {
                handleLoadLayout("Layout Padrão")
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
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
              </DashboardWidget>
            ))}
        </DashboardGrid>
      </div>
    </div>
  )
}

