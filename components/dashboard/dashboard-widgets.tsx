"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent,
  exampleAreaChartData,
  examplePieChartData,
  exampleChartConfig
} from "@/components/charts"

// Tipos para os widgets
type WidgetSize = "small" | "medium" | "large"
type ChartType = "area" | "bar" | "pie"
type TimeRange = "hour" | "day" | "week" | "month" | "year"

interface Widget {
  id: string
  title: string
  description?: string
  size: WidgetSize
  chartType: ChartType
  webhookId: string
  timeRange: TimeRange
  config?: any
}

// Dados iniciais dos widgets
const initialWidgets: Widget[] = [
  {
    id: "widget1",
    title: "Logins por Mês",
    description: "Total de logins registrados mensalmente",
    size: "medium",
    chartType: "area",
    webhookId: "login",
    timeRange: "month",
    config: exampleChartConfig
  },
  {
    id: "widget2",
    title: "Compras por Categoria",
    description: "Distribuição de compras por categoria",
    size: "medium",
    chartType: "pie",
    webhookId: "compra",
    timeRange: "month",
    config: {}
  },
  {
    id: "widget3",
    title: "Cadastros por Dia",
    description: "Novos cadastros registrados diariamente",
    size: "medium",
    chartType: "bar",
    webhookId: "cadastro",
    timeRange: "day",
    config: exampleChartConfig
  },
  {
    id: "widget4",
    title: "Erros por Hora",
    description: "Logs de erros agrupados por hora",
    size: "medium",
    chartType: "area",
    webhookId: "erro",
    timeRange: "hour",
    config: exampleChartConfig
  }
]

export function DashboardWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)
  const gridRef = useRef<HTMLDivElement>(null)

  // Função para remover um widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id))
  }

  // Função para atualizar um widget
  const updateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    ))
  }

  // Função para renderizar o gráfico correto com base no tipo
  const renderChart = (widget: Widget) => {
    const height = widget.size === "large" ? 350 : 200

    switch (widget.chartType) {
      case "area":
        return (
          <AreaChartComponent 
            data={exampleAreaChartData} 
            chartConfig={widget.config}
            height={height}
            className="w-full"
          />
        )
      case "bar":
        return (
          <BarChartComponent 
            data={exampleAreaChartData} 
            chartConfig={widget.config}
            height={height}
            className="w-full"
          />
        )
      case "pie":
        return (
          <PieChartComponent 
            data={examplePieChartData} 
            chartConfig={widget.config}
            height={height}
            className="w-full"
          />
        )
      default:
        return null
    }
  }

  // Configuração dos manipuladores de redimensionamento
  useEffect(() => {
    if (!gridRef.current) return

    const grid = gridRef.current
    const widgets = grid.querySelectorAll('.resizable-widget')

    widgets.forEach(widget => {
      const handleE = widget.querySelector('.resize-handle-e') as HTMLElement
      const handleS = widget.querySelector('.resize-handle-s') as HTMLElement
      const handleSE = widget.querySelector('.resize-handle-se') as HTMLElement

      if (handleE) {
        handleE.addEventListener('mousedown', (e) => {
          e.preventDefault()
          document.body.style.cursor = 'col-resize'
          
          const startX = e.clientX
          const startWidth = parseInt(window.getComputedStyle(widget).gridColumnEnd) - 
                            parseInt(window.getComputedStyle(widget).gridColumnStart)
          
          const onMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + Math.round((e.clientX - startX) / (grid.clientWidth / 3))
            if (newWidth >= 1 && newWidth <= 3) {
              (widget as HTMLElement).style.gridColumn = `span ${newWidth} / span ${newWidth}`
              
              // Atualizar tamanho do widget no estado
              const widgetId = widget.getAttribute('data-widget-id')
              if (widgetId) {
                const size = newWidth === 1 ? 'small' : newWidth === 2 ? 'medium' : 'large'
                setWidgets(prev => prev.map(w => 
                  w.id === widgetId ? {...w, size} : w
                ))
              }
            }
          }
          
          const onMouseUp = () => {
            document.body.style.cursor = ''
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
          }
          
          document.addEventListener('mousemove', onMouseMove)
          document.addEventListener('mouseup', onMouseUp)
        })
      }

      if (handleS) {
        handleS.addEventListener('mousedown', (e) => {
          e.preventDefault()
          document.body.style.cursor = 'row-resize'
          
          const startY = e.clientY
          const startHeight = parseInt(window.getComputedStyle(widget).gridRowEnd) - 
                             parseInt(window.getComputedStyle(widget).gridRowStart)
          
          const onMouseMove = (e: MouseEvent) => {
            const newHeight = startHeight + Math.round((e.clientY - startY) / 100)
            if (newHeight >= 1 && newHeight <= 2) {
              (widget as HTMLElement).style.gridRow = `span ${newHeight} / span ${newHeight}`
              
              // Atualizar tamanho do widget no estado
              const widgetId = widget.getAttribute('data-widget-id')
              if (widgetId) {
                const widthSpan = parseInt(window.getComputedStyle(widget).gridColumnEnd) - 
                                 parseInt(window.getComputedStyle(widget).gridColumnStart)
                const size = (widthSpan > 1 || newHeight > 1) ? 'large' : 'medium'
                setWidgets(prev => prev.map(w => 
                  w.id === widgetId ? {...w, size} : w
                ))
              }
            }
          }
          
          const onMouseUp = () => {
            document.body.style.cursor = ''
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
          }
          
          document.addEventListener('mousemove', onMouseMove)
          document.addEventListener('mouseup', onMouseUp)
        })
      }

      if (handleSE) {
        handleSE.addEventListener('mousedown', (e) => {
          e.preventDefault()
          document.body.style.cursor = 'nwse-resize'
          
          const startX = e.clientX
          const startY = e.clientY
          const startWidth = parseInt(window.getComputedStyle(widget).gridColumnEnd) - 
                            parseInt(window.getComputedStyle(widget).gridColumnStart)
          const startHeight = parseInt(window.getComputedStyle(widget).gridRowEnd) - 
                             parseInt(window.getComputedStyle(widget).gridRowStart)
          
          const onMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + Math.round((e.clientX - startX) / (grid.clientWidth / 3))
            const newHeight = startHeight + Math.round((e.clientY - startY) / 100)
            
            if (newWidth >= 1 && newWidth <= 3) {
              (widget as HTMLElement).style.gridColumn = `span ${newWidth} / span ${newWidth}`
            }
            
            if (newHeight >= 1 && newHeight <= 2) {
              (widget as HTMLElement).style.gridRow = `span ${newHeight} / span ${newHeight}`
            }
            
            // Atualizar tamanho do widget no estado
            const widgetId = widget.getAttribute('data-widget-id')
            if (widgetId) {
              const size = (newWidth > 1 || newHeight > 1) ? 'large' : 'medium'
              setWidgets(prev => prev.map(w => 
                w.id === widgetId ? {...w, size} : w
              ))
            }
          }
          
          const onMouseUp = () => {
            document.body.style.cursor = ''
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
          }
          
          document.addEventListener('mousemove', onMouseMove)
          document.addEventListener('mouseup', onMouseUp)
        })
      }
    })

    // Função de limpeza
    return () => {
      widgets.forEach(widget => {
        const handleE = widget.querySelector('.resize-handle-e')
        const handleS = widget.querySelector('.resize-handle-s')
        const handleSE = widget.querySelector('.resize-handle-se')
        
        if (handleE) handleE.removeEventListener('mousedown', () => {})
        if (handleS) handleS.removeEventListener('mousedown', () => {})
        if (handleSE) handleSE.removeEventListener('mousedown', () => {})
      })
    }
  }, [widgets, setWidgets])

  return (
    <div className="space-y-4">
      <div ref={gridRef} className="grid grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            data-widget-id={widget.id}
            className="transition-all duration-200 resizable-widget"
            style={{
              gridColumn: widget.size === "large" ? "span 2 / span 2" : "span 1 / span 1",
              gridRow: widget.size === "large" ? "span 2 / span 2" : "span 1 / span 1",
            }}
          >
            <Card className="h-full overflow-hidden relative border-2 border-dashed border-muted group hover:border-primary/20">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="absolute bottom-0 right-0 p-1 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-background/80"
                    onClick={() => {
                      const newSize = widget.size === "medium" 
                        ? "large" 
                        : widget.size === "large" 
                          ? "small" 
                          : "medium";
                      updateWidget({...widget, size: newSize});
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-background/80"
                    onClick={() => removeWidget(widget.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{widget.title}</CardTitle>
                  {widget.description && (
                    <CardDescription>{widget.description}</CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {renderChart(widget)}
              </CardContent>
              
              {/* Alças de redimensionamento */}
              <div className="resize-handle resize-handle-e" title="Arraste para redimensionar horizontalmente" />
              <div className="resize-handle resize-handle-s" title="Arraste para redimensionar verticalmente" />
              <div className="resize-handle resize-handle-se" title="Arraste para redimensionar" />
            </Card>
          </div>
        ))}
      </div>
      
      {/* Estilos necessários para o redimensionamento */}
      <style jsx global>{`
        .resizable-widget {
          position: relative;
        }
        
        .resize-handle {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.05);
          transition: background-color 0.2s;
          z-index: 10;
        }
        
        .resize-handle:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .resize-handle-e {
          cursor: col-resize;
          width: 10px;
          height: 100%;
          right: 0;
          top: 0;
        }
        
        .resize-handle-s {
          cursor: row-resize;
          height: 10px;
          width: 100%;
          bottom: 0;
          left: 0;
        }
        
        .resize-handle-se {
          cursor: nwse-resize;
          width: 15px;
          height: 15px;
          right: 0;
          bottom: 0;
          border-radius: 0 0 4px 0;
        }
      `}</style>
    </div>
  )
} 