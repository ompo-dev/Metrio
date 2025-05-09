"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Filter, MessageSquare, Plus, RotateCcw, Send, X } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { BarChart2, LineChart as LucideLineChart, AreaChart as LucideAreaChart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

export interface DataPoint {
  [key: string]: string | number
}

export type ChartType = "line" | "bar" | "area"
export type AggregationType = "sum" | "average" | "min" | "max" | "count"
export type SortDirection = "ascending" | "descending" | "none"

export interface SeriesConfig {
  key: string
  label: string
  color: string
  aggregation: AggregationType
  groupBy?: string
}

export interface FilterConfig {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains"
  value: string | number
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChartDashboardProps {
  title: string
  data: DataPoint[]
  className?: string
}

const DEFAULT_COLORS = [
  "#4263eb", // books - blue
  "#40c057", // clothing - green
  "#fcc419", // electronics - yellow
  "#fa5252", // tools - red
  "#15aabf", // widgets - light blue
  "#7950f2", // purple
  "#fd7e14", // orange
  "#e64980", // pink
  "#1098ad", // teal
  "#495057", // gray
]

export function ChartDashboard({ title, data, className }: ChartDashboardProps) {
  const [activeTab, setActiveTab] = React.useState("general")
  const [chartType, setChartType] = React.useState<ChartType>("line")
  const [xAxisField, setXAxisField] = React.useState<string>(Object.keys(data[0])[0])
  const [groupBy, setGroupBy] = React.useState<string>("none")
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("ascending")
  const [filters, setFilters] = React.useState<FilterConfig[]>([])
  const [showGridLines, setShowGridLines] = React.useState(true)
  const [showDots, setShowDots] = React.useState(true)
  const [showLegend, setShowLegend] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [isAddingFilter, setIsAddingFilter] = React.useState(false)
  const [isAddingSeries, setIsAddingSeries] = React.useState(false)
  const [showAiChat, setShowAiChat] = React.useState(false)
  const [configPanelExpanded, setConfigPanelExpanded] = React.useState(true)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou seu assistente de análise de dados. Como posso ajudar você a entender melhor seus dados hoje?",
      timestamp: new Date(),
    },
  ])
  const [currentMessage, setCurrentMessage] = React.useState("")
  const [isAiThinking, setIsAiThinking] = React.useState(false)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  // Get all available fields from data
  const availableFields = React.useMemo(() => {
    const fields = new Set<string>()
    data.forEach((item) => {
      Object.keys(item).forEach((key) => fields.add(key))
    })
    return Array.from(fields)
  }, [data])

  // Initialize series based on data
  const [series, setSeries] = React.useState<SeriesConfig[]>(() => {
    const numericFields = availableFields.filter((field) => field !== xAxisField && typeof data[0][field] === "number")
    return numericFields.slice(0, 5).map((field, index) => ({
      key: field,
      label: field.charAt(0).toUpperCase() + field.slice(1),
      color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      aggregation: "sum",
    }))
  })

  const [activeSeries, setActiveSeries] = React.useState<string[]>(series.map((s) => s.key))

  // Apply filters to data
  const filteredData = React.useMemo(() => {
    if (filters.length === 0) return data

    return data.filter((item) => {
      return filters.every((filter) => {
        const value = item[filter.field]
        switch (filter.operator) {
          case "equals":
            return value === filter.value
          case "not_equals":
            return value !== filter.value
          case "greater_than":
            return Number(value) > Number(filter.value)
          case "less_than":
            return Number(value) < Number(filter.value)
          case "contains":
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
          default:
            return true
        }
      })
    })
  }, [data, filters])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (sortDirection === "none") return filteredData

    return [...filteredData].sort((a, b) => {
      if (sortDirection === "ascending") {
        return a[xAxisField] > b[xAxisField] ? 1 : -1
      } else {
        return a[xAxisField] < b[xAxisField] ? 1 : -1
      }
    })
  }, [filteredData, xAxisField, sortDirection])

  // Toggle series visibility
  const toggleSeries = (seriesKey: string) => {
    setActiveSeries((prev) =>
      prev.includes(seriesKey) ? prev.filter((key) => key !== seriesKey) : [...prev, seriesKey],
    )
  }

  // Add a new filter
  const addFilter = (filter: FilterConfig) => {
    setFilters((prev) => [...prev, filter])
    setIsAddingFilter(false)
  }

  // Remove a filter
  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index))
  }

  // Add a new series
  const addSeries = (newSeries: SeriesConfig) => {
    setSeries((prev) => [...prev, newSeries])
    setActiveSeries((prev) => [...prev, newSeries.key])
    setIsAddingSeries(false)
  }

  // Remove a series
  const removeSeries = (seriesKey: string) => {
    setSeries((prev) => prev.filter((s) => s.key !== seriesKey))
    setActiveSeries((prev) => prev.filter((key) => key !== seriesKey))
  }

  // Update series configuration
  const updateSeries = (seriesKey: string, updates: Partial<SeriesConfig>) => {
    setSeries((prev) => prev.map((s) => (s.key === seriesKey ? { ...s, ...updates } : s)))
  }

  // Get max value for Y axis
  const maxValue = React.useMemo(() => {
    let max = 0
    sortedData.forEach((item) => {
      activeSeries.forEach((seriesKey) => {
        const value = Number(item[seriesKey]) || 0
        if (value > max) max = value
      })
    })
    // Round up to nearest thousand
    return Math.ceil(max / 1000) * 1000
  }, [sortedData, activeSeries])

  // Generate Y axis ticks
  const yAxisTicks = React.useMemo(() => {
    const tickCount = 5
    const step = maxValue / tickCount
    return Array.from({ length: tickCount + 1 }, (_, i) => i * step)
  }, [maxValue])

  // Handle sending a message to the AI
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setCurrentMessage("")
    setIsAiThinking(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAiResponse(currentMessage, sortedData)
      const newAiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newAiMessage])
      setIsAiThinking(false)
    }, 1500)
  }

  // Simulate AI response based on user query
  const generateAiResponse = (query: string, data: DataPoint[]): string => {
    // This is a simplified simulation - in a real app, you would use the AI SDK [^4]
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("tendência") || lowerQuery.includes("tendencia") || lowerQuery.includes("trend")) {
      const lastMonths = data.slice(-3)
      const firstMonths = data.slice(0, 3)

      let trend = "estável"
      let avgRecent = 0
      let avgEarly = 0

      activeSeries.forEach((series) => {
        avgRecent += lastMonths.reduce((sum, item) => sum + (Number(item[series]) || 0), 0) / lastMonths.length
        avgEarly += firstMonths.reduce((sum, item) => sum + (Number(item[series]) || 0), 0) / firstMonths.length
      })

      const percentChange = ((avgRecent - avgEarly) / avgEarly) * 100

      if (percentChange > 10) trend = "de alta significativa"
      else if (percentChange > 0) trend = "de leve alta"
      else if (percentChange < -10) trend = "de queda significativa"
      else if (percentChange < 0) trend = "de leve queda"

      return `Analisando os dados, observo uma tendência ${trend} nas categorias selecionadas. Comparando os primeiros meses com os últimos, houve uma variação de aproximadamente ${Math.abs(percentChange).toFixed(1)}%.`
    }

    if (lowerQuery.includes("melhor") || lowerQuery.includes("maior") || lowerQuery.includes("top")) {
      const seriesPerformance: { [key: string]: number } = {}

      series.forEach((s) => {
        seriesPerformance[s.key] = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0)
      })

      const topSeries = Object.entries(seriesPerformance)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

      return `As categorias com melhor desempenho são:
1. ${topSeries[0][0]} com total de $${topSeries[0][1].toLocaleString()}
2. ${topSeries[1][0]} com total de $${topSeries[1][1].toLocaleString()}
3. ${topSeries[2][0]} com total de $${topSeries[2][1].toLocaleString()}`
    }

    if (lowerQuery.includes("pior") || lowerQuery.includes("menor")) {
      const seriesPerformance: { [key: string]: number } = {}

      series.forEach((s) => {
        seriesPerformance[s.key] = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0)
      })

      const worstSeries = Object.entries(seriesPerformance)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)

      return `As categorias com pior desempenho são:
1. ${worstSeries[0][0]} com total de $${worstSeries[0][1].toLocaleString()}
2. ${worstSeries[1][0]} com total de $${worstSeries[1][1].toLocaleString()}
3. ${worstSeries[2][0]} com total de $${worstSeries[2][1].toLocaleString()}`
    }

    if (lowerQuery.includes("resumo") || lowerQuery.includes("resumir") || lowerQuery.includes("summary")) {
      const totalsByCategory: { [key: string]: number } = {}
      let grandTotal = 0

      series.forEach((s) => {
        const total = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0)
        totalsByCategory[s.key] = total
        grandTotal += total
      })

      return `Resumo dos dados:
- Total geral: $${grandTotal.toLocaleString()}
- Período analisado: ${data[0][xAxisField]} a ${data[data.length - 1][xAxisField]}
- Número de categorias: ${series.length}
- Categoria com maior valor: ${Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1])[0][0]}
- Categoria com menor valor: ${Object.entries(totalsByCategory).sort((a, b) => a[1] - b[1])[0][0]}`
    }

    if (lowerQuery.includes("comparar") || lowerQuery.includes("comparação") || lowerQuery.includes("compare")) {
      if (activeSeries.length < 2) {
        return "Para fazer uma comparação, selecione pelo menos duas categorias no gráfico."
      }

      const totals = activeSeries.map((series) => {
        const total = data.reduce((sum, item) => sum + (Number(item[series]) || 0), 0)
        return { series, total }
      })

      const sorted = totals.sort((a, b) => b.total - a.total)
      const highest = sorted[0]
      const lowest = sorted[sorted.length - 1]
      const ratio = highest.total / lowest.total

      return `Comparando as categorias selecionadas:
- ${highest.series} tem o maior total com $${highest.total.toLocaleString()}
- ${lowest.series} tem o menor total com $${lowest.total.toLocaleString()}
- ${highest.series} é aproximadamente ${ratio.toFixed(1)}x maior que ${lowest.series}
- A diferença entre eles é de $${(highest.total - lowest.total).toLocaleString()}`
    }

    if (lowerQuery.includes("sazonalidade") || lowerQuery.includes("seasonal") || lowerQuery.includes("padrão")) {
      return `Analisando os padrões sazonais nos dados:
      
1. Observo picos de vendas nos meses de Fevereiro, Abril e Junho.
2. Os meses com menor desempenho tendem a ser Outubro e Novembro.
3. A categoria "clothing" mostra forte sazonalidade, com pico em Fevereiro.
4. "Electronics" tem desempenho mais estável ao longo do ano.
5. Recomendo planejar promoções e estoque considerando estes padrões sazonais.`
    }

    // Default response
    return `Baseado nos dados apresentados no gráfico, posso ver que temos informações de vendas por categoria ao longo do tempo. Para análises mais específicas, você pode me perguntar sobre:

1. Tendências gerais ou por categoria
2. Comparações entre categorias
3. Períodos de melhor/pior desempenho
4. Padrões sazonais
5. Resumo geral dos dados

Qual aspecto específico você gostaria de explorar?`
  }

  // Scroll to bottom of chat when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    const commonProps = {
      data: sortedData,
      margin: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20,
      },
    }

    const renderLines = () => {
      return activeSeries.map((seriesKey) => {
        const seriesConfig = series.find((s) => s.key === seriesKey)
        if (!seriesConfig) return null

        if (chartType === "line") {
          return (
            <Line
              key={seriesKey}
              type="monotone"
              dataKey={seriesKey}
              name={seriesConfig.label}
              stroke={seriesConfig.color}
              strokeWidth={2}
              dot={showDots ? { r: 4, strokeWidth: 2 } : false}
              activeDot={{ r: 6 }}
            />
          )
        } else if (chartType === "area") {
          return (
            <Area
              key={seriesKey}
              type="monotone"
              dataKey={seriesKey}
              name={seriesConfig.label}
              stroke={seriesConfig.color}
              fill={seriesConfig.color}
              fillOpacity={0.2}
              strokeWidth={2}
              dot={showDots ? { r: 4, strokeWidth: 2 } : false}
              activeDot={{ r: 6 }}
            />
          )
        } else if (chartType === "bar") {
          return (
            <Bar
              key={seriesKey}
              dataKey={seriesKey}
              name={seriesConfig.label}
              fill={seriesConfig.color}
              radius={[4, 4, 0, 0]}
            />
          )
        }
        return null; // Add a default return
      })
    }

    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          <XAxis
            dataKey={xAxisField}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            domain={[0, maxValue]}
            ticks={yAxisTicks}
            tickFormatter={(value) => value.toString()}
            label={{
              value: "Sales ($)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 12 },
            }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [`$${value}`, name]}
              labelFormatter={(label) => `${xAxisField}: ${label}`}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          )}
          {renderLines()}
        </LineChart>
      )
    } else if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          <XAxis
            dataKey={xAxisField}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            domain={[0, maxValue]}
            ticks={yAxisTicks}
            tickFormatter={(value) => value.toString()}
            label={{
              value: "Sales ($)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 12 },
            }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [`$${value}`, name]}
              labelFormatter={(label) => `${xAxisField}: ${label}`}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          )}
          {renderLines()}
        </AreaChart>
      )
    } else if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          <XAxis
            dataKey={xAxisField}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            domain={[0, maxValue]}
            ticks={yAxisTicks}
            tickFormatter={(value) => value.toString()}
            label={{
              value: "Sales ($)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 12 },
            }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [`$${value}`, name]}
              labelFormatter={(label) => `${xAxisField}: ${label}`}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          )}
          {renderLines()}
        </BarChart>
      )
    }
    
    // Retorno padrão para garantir que sempre há um ReactNode
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <p className="text-gray-400">Nenhum gráfico selecionado</p>
      </div>
    )
  }

  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <RotateCcw className="h-3 w-3 text-gray-500" />
          </div>
          <h2 className="text-base font-medium text-gray-700">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiChat(!showAiChat)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors",
              showAiChat ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "",
            )}
          >
            <MessageSquare className={cn("h-4 w-4", showAiChat ? "text-emerald-500" : "text-gray-400")} />
            <span className="text-sm">{showAiChat ? "Fechar IA" : "Perguntar à IA"}</span>
          </button>

          <Dialog open={isAddingFilter} onOpenChange={setIsAddingFilter}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border px-3 py-1.5">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Add filter</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Filter</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="filter-field">Field</Label>
                  <Select
                    onValueChange={(value) => {
                      const newFilter: FilterConfig = {
                        field: value,
                        operator: "equals",
                        value: "",
                      }
                      addFilter(newFilter)
                    }}
                  >
                    <SelectTrigger id="filter-field">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border px-3 py-1.5">
                <span className="text-sm text-gray-500">monthly_category_sales</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>monthly_category_sales</DropdownMenuItem>
              <DropdownMenuItem>quarterly_sales</DropdownMenuItem>
              <DropdownMenuItem>yearly_sales</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b bg-gray-50 px-4 py-2">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
              <span className="font-medium">{filter.field}</span>
              <span className="text-gray-500">{filter.operator.replace("_", " ")}</span>
              <span>{filter.value}</span>
              <button onClick={() => removeFilter(index)} className="ml-1 rounded-full p-0.5 hover:bg-gray-100">
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Left Panel - Configuration */}
        <div 
          className={cn(
            "border-r transition-all duration-300 ease-in-out",
            configPanelExpanded ? "w-full md:w-80" : "w-16",
          )}
        >
          {configPanelExpanded ? (
            /* Expanded Configuration Panel */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-white p-0">
                <TabsTrigger
                  value="general"
                  className={cn(
                    "rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-emerald-500 data-[state=active]:bg-white data-[state=active]:shadow-none",
                    activeTab === "general" && "border-emerald-500 font-medium text-emerald-600",
                  )}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="display"
                  className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-emerald-500 data-[state=active]:bg-white data-[state=active]:shadow-none"
                >
                  Display
                </TabsTrigger>
                <TabsTrigger
                  value="x-axis"
                  className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-emerald-500 data-[state=active]:bg-white data-[state=active]:shadow-none"
                >
                  X-Axis
                </TabsTrigger>
                <TabsTrigger
                  value="y-axis"
                  className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-emerald-500 data-[state=active]:bg-white data-[state=active]:shadow-none"
                >
                  Y-Axis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="p-4">
                {/* Chart Type */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Chart Type</label>
                  <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                    <SelectTrigger className="h-10 w-full border bg-white">
                      <div className="flex items-center gap-2">
                        {chartType === "line" && (
                          <LucideLineChart className="h-5 w-5 text-gray-500" />
                        )}
                        {chartType === "bar" && (
                          <BarChart2 className="h-5 w-5 text-gray-500" />
                        )}
                        {chartType === "area" && (
                          <LucideAreaChart className="h-5 w-5 text-gray-500" />
                        )}
                        <span>{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Display Options */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Grid Lines</label>
                    <Switch checked={showGridLines} onCheckedChange={setShowGridLines} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Data Points</label>
                    <Switch checked={showDots} onCheckedChange={setShowDots} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Legend</label>
                    <Switch checked={showLegend} onCheckedChange={setShowLegend} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Show Tooltip</label>
                    <Switch checked={showTooltip} onCheckedChange={setShowTooltip} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="p-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Chart Title</label>
                    <Input defaultValue={title} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Y-Axis Label</label>
                    <Input defaultValue="Sales ($)" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Chart Height</label>
                    <Input type="number" defaultValue="500" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="x-axis" className="p-4">
                {/* X-Axis */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">X-Axis Field</label>
                  <Select value={xAxisField} onValueChange={setXAxisField}>
                    <SelectTrigger className="h-10 w-full border bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Group by */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Group by</label>
                    <Select value={groupBy} onValueChange={setGroupBy}>
                      <SelectTrigger className="w-[120px] border-0 bg-transparent p-0 text-sm text-gray-500 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableFields
                          .filter((field) => field !== xAxisField)
                          .map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Sort</label>
                    <Select value={sortDirection} onValueChange={(value: SortDirection) => setSortDirection(value)}>
                      <SelectTrigger className="w-[120px] border-0 bg-transparent p-0 text-sm text-gray-500 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ascending">Ascending</SelectItem>
                        <SelectItem value="descending">Descending</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="y-axis" className="p-4">
                {/* Y-Axis */}
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Y-Axis</label>
                    <Dialog open={isAddingSeries} onOpenChange={setIsAddingSeries}>
                      <DialogTrigger asChild>
                        <button className="text-xs text-gray-500 hover:text-gray-700">Add Y-Axis</button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Series</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="series-field">Field</Label>
                            <Select
                              onValueChange={(value) => {
                                const newSeries: SeriesConfig = {
                                  key: value,
                                  label: value.charAt(0).toUpperCase() + value.slice(1),
                                  color: DEFAULT_COLORS[series.length % DEFAULT_COLORS.length],
                                  aggregation: "sum",
                                }
                                addSeries(newSeries)
                              }}
                            >
                              <SelectTrigger id="series-field">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFields
                                  .filter(
                                    (field) =>
                                      field !== xAxisField &&
                                      typeof data[0][field] === "number" &&
                                      !series.some((s) => s.key === field),
                                  )
                                  .map((field) => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Series List */}
                <div className="space-y-4">
                  {series.map((seriesConfig, index) => (
                    <div key={seriesConfig.key} className="rounded-md border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: seriesConfig.color }} />
                          <span className="text-sm font-medium">
                            Series {index + 1}: {seriesConfig.label}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSeries(seriesConfig.key)}
                          className="rounded-full p-1 hover:bg-gray-100"
                        >
                          <X className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>

                      <div className="mb-2">
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-400">#</span>
                          </div>
                          <Input className="h-10 pl-10 pr-10" value={seriesConfig.key} readOnly />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-500">Aggregate</label>
                          <Select
                            value={seriesConfig.aggregation}
                            onValueChange={(value: AggregationType) =>
                              updateSeries(seriesConfig.key, { aggregation: value })
                            }
                          >
                            <SelectTrigger className="w-[120px] border-0 bg-transparent p-0 text-sm text-gray-500 shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">Sum</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="min">Min</SelectItem>
                              <SelectItem value="max">Max</SelectItem>
                              <SelectItem value="count">Count</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-500">Group by</label>
                          <Select
                            value={seriesConfig.groupBy || "category_name"}
                            onValueChange={(value) => updateSeries(seriesConfig.key, { groupBy: value })}
                          >
                            <SelectTrigger className="w-[120px] border-0 bg-transparent p-0 text-sm text-gray-500 shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="category_name">category_name</SelectItem>
                              <SelectItem value="region">region</SelectItem>
                              <SelectItem value="channel">channel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Series */}
                  <Button
                    variant="outline"
                    className="w-full justify-start text-gray-500"
                    onClick={() => setIsAddingSeries(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Series
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Collapsed Icons Panel */
            <div className="h-full py-4 flex flex-col items-center">
              <div className="mb-8"></div> {/* Spacer to align with expanded view */}
              <button 
                onClick={() => { setActiveTab("general"); setConfigPanelExpanded(true); }}
                className={cn(
                  "w-10 h-10 mb-4 rounded-full flex items-center justify-center",
                  activeTab === "general" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
                )}
                title="Geral"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => { setActiveTab("display"); setConfigPanelExpanded(true); }}
                className={cn(
                  "w-10 h-10 mb-4 rounded-full flex items-center justify-center",
                  activeTab === "display" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
                )}
                title="Exibição"
              >
                <LucideLineChart className="h-5 w-5" />
              </button>
              <button 
                onClick={() => { setActiveTab("x-axis"); setConfigPanelExpanded(true); }}
                className={cn(
                  "w-10 h-10 mb-4 rounded-full flex items-center justify-center",
                  activeTab === "x-axis" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
                )}
                title="Eixo-X"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
              <button 
                onClick={() => { setActiveTab("y-axis"); setConfigPanelExpanded(true); }}
                className={cn(
                  "w-10 h-10 mb-4 rounded-full flex items-center justify-center",
                  activeTab === "y-axis" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
                )}
                title="Eixo-Y"
              >
                <LucideAreaChart className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Toggle Panel Button */}
        <div className="relative">
          <button 
            onClick={() => setConfigPanelExpanded(!configPanelExpanded)}
            className="absolute -left-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm"
          >
            {configPanelExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Right Panel - Chart */}
        <div className="flex-1 p-4">
          {/* Legend */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            {series.map((seriesConfig) => (
              <button
                key={seriesConfig.key}
                className="flex items-center gap-2"
                onClick={() => toggleSeries(seriesConfig.key)}
                aria-pressed={activeSeries.includes(seriesConfig.key)}
              >
                <div
                  className={cn("h-3 w-3 rounded-full", {
                    "opacity-50": !activeSeries.includes(seriesConfig.key),
                  })}
                  style={{ backgroundColor: seriesConfig.color }}
                />
                <span
                  className={cn("text-sm", {
                    "font-medium": activeSeries.includes(seriesConfig.key),
                    "text-gray-400": !activeSeries.includes(seriesConfig.key),
                  })}
                >
                  {seriesConfig.label}
                </span>
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Chat Section - Below the main content */}
      {showAiChat && (
        <div className="border-t">
          <div className="border-b bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Análise com IA</h3>
                <p className="text-xs text-gray-500">Faça perguntas sobre seus dados</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => setShowAiChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_300px]">
            {/* Chat Messages */}
            <div ref={chatContainerRef} className="h-[300px] overflow-y-auto border-r p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("mb-4 flex", {
                    "justify-end": message.role === "user",
                  })}
                >
                  {message.role === "assistant" && (
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn("max-w-[85%] rounded-lg px-4 py-2", {
                      "bg-white text-gray-700": message.role === "assistant",
                      "bg-emerald-500 text-white": message.role === "user",
                    })}
                  >
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                    <div
                      className={cn("mt-1 text-right text-xs", {
                        "text-gray-400": message.role === "assistant",
                        "text-emerald-200": message.role === "user",
                      })}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="mb-4 flex">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[85%] rounded-lg bg-white px-4 py-3 text-gray-700">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            <div className="p-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700">Perguntas Sugeridas</h4>
              <div className="space-y-2">
                {[
                  "Qual é a tendência geral das vendas?",
                  "Quais são as categorias com melhor desempenho?",
                  "Existe algum padrão sazonal nos dados?",
                  "Pode me dar um resumo dos dados?",
                  "Compare as categorias de produtos",
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left text-sm"
                    onClick={() => {
                      setCurrentMessage(question)
                      setTimeout(() => {
                        handleSendMessage()
                      }, 100)
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Faça uma pergunta sobre os dados..."
                className="min-h-[40px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full bg-emerald-500 hover:bg-emerald-600"
                disabled={!currentMessage.trim() || isAiThinking}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2">
        <div className="text-sm text-gray-500">Agent</div>
      </div>
    </Card>
  )
}
