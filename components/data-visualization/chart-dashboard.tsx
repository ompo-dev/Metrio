"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Filter, MessageSquare, RotateCcw} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Componentes modularizados
import { ChartType, SortDirection, FilterConfig, SeriesConfig, Message, DataPoint, DEFAULT_COLORS, ChartDashboardProps } from "./types"
import { ChartRenderer } from "./chart-renderer"
import { ChartLegend } from "./chart-legend"
import { FilterBar } from "./filter-bar"
import { ConfigPanel } from "./config-panel"
import { AIChat } from "./ai-chat"

// Importar estilos de Markdown
import "./markdown-styles.css"

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

    if (lowerQuery.includes("tabela") || lowerQuery.includes("table") || lowerQuery.includes("markdown")) {
      return `# Exemplo de Markdown

Aqui está um exemplo de como uso Markdown para formatação:

## Tabela de Vendas por Categoria

| Categoria | Vendas ($) | % do Total |
|-----------|----------:|----------:|
| Eletrônicos | 245,000 | 42.8% |
| Roupas | 125,000 | 21.8% |
| Livros | 98,500 | 17.2% |
| Acessórios | 65,000 | 11.3% |
| Outros | 39,500 | 6.9% |

### Lista de destaques:

1. **Eletrônicos** é a categoria com maior venda
2. *Roupas* está em segundo lugar
3. Juntos, Eletrônicos e Roupas representam mais de 60% das vendas

### Código de exemplo:

\`\`\`javascript
// Calculando o total de vendas
const totalSales = categories.reduce((sum, cat) => {
  return sum + cat.sales;
}, 0);
\`\`\`

> **Nota:** Esta análise é baseada nos dados do último trimestre.`;
    }

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

      return `## Análise de Tendência

Observei uma tendência **${trend}** nas categorias selecionadas.

### Comparação de Períodos
| Período | Média de Vendas | Variação |
|---------|---------------:|--------:|
| Início do Ano | $${Math.round(avgEarly).toLocaleString()} | - |  
| Últimos Meses | $${Math.round(avgRecent).toLocaleString()} | ${avgRecent > avgEarly ? '📈' : '📉'} ${Math.abs(((avgRecent - avgEarly) / avgEarly) * 100).toFixed(1)}% |

> A variação entre os períodos indica um padrão que deve ser monitorado nos próximos meses.`;
    }

    if (lowerQuery.includes("melhor") || lowerQuery.includes("maior") || lowerQuery.includes("top")) {
      const seriesPerformance: { [key: string]: number } = {}

      series.forEach((s) => {
        seriesPerformance[s.key] = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0)
      })

      const topSeries = Object.entries(seriesPerformance)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

      return `## Categorias com Melhor Desempenho 🏆

### Top 3 Categorias:

| Posição | Categoria | Total de Vendas |
|:-------:|-----------|----------------:|
| 🥇 | **${topSeries[0][0]}** | $${topSeries[0][1].toLocaleString()} |
| 🥈 | **${topSeries[1][0]}** | $${topSeries[1][1].toLocaleString()} |
| 🥉 | **${topSeries[2][0]}** | $${topSeries[2][1].toLocaleString()} |

> A categoria **${topSeries[0][0]}** representa ${(topSeries[0][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% do total de vendas.`
    }

    if (lowerQuery.includes("pior") || lowerQuery.includes("menor")) {
      const seriesPerformance: { [key: string]: number } = {}

      series.forEach((s) => {
        seriesPerformance[s.key] = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0)
      })

      const worstSeries = Object.entries(seriesPerformance)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)

      return `## Categorias com Menor Desempenho

### Categorias que precisam de atenção:

| Categoria | Total de Vendas | % do Total |
|-----------|----------------:|----------:|
| **${worstSeries[0][0]}** | $${worstSeries[0][1].toLocaleString()} | ${(worstSeries[0][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% |
| **${worstSeries[1][0]}** | $${worstSeries[1][1].toLocaleString()} | ${(worstSeries[1][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% |
| **${worstSeries[2][0]}** | $${worstSeries[2][1].toLocaleString()} | ${(worstSeries[2][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% |

### Recomendações:

1. Avaliar estratégias de marketing para **${worstSeries[0][0]}**
2. Considerar revisão de preços ou promoções
3. Investigar fatores sazonais que possam influenciar estas categorias`
    }

    if (lowerQuery.includes("resumo") || lowerQuery.includes("resumir") || lowerQuery.includes("summary")) {
      const totalsByCategory: { [key: string]: number } = {}
      let grandTotal = 0

      series.forEach((s) => {
        const total = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0)
        totalsByCategory[s.key] = total
        grandTotal += total
      })

      const highestCategory = Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1])[0]
      const lowestCategory = Object.entries(totalsByCategory).sort((a, b) => a[1] - b[1])[0]

      return `# Resumo dos Dados 📊

## Principais métricas:

- **Total geral:** $${grandTotal.toLocaleString()}
- **Período analisado:** ${data[0][xAxisField]} a ${data[data.length - 1][xAxisField]}
- **Número de categorias:** ${series.length}

## Destaques:

| Métrica | Categoria | Valor |
|---------|-----------|------:|
| Maior valor | **${highestCategory[0]}** | $${highestCategory[1].toLocaleString()} |
| Menor valor | **${lowestCategory[0]}** | $${lowestCategory[1].toLocaleString()} |

## Distribuição por categoria:

\`\`\`
${Object.entries(totalsByCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([key, value]) => `${key}: ${"█".repeat(Math.round((value / grandTotal) * 20))} ${Math.round((value / grandTotal) * 100)}%`)
  .join("\n")}
\`\`\``
    }

    if (lowerQuery.includes("comparar") || lowerQuery.includes("comparação") || lowerQuery.includes("compare")) {
      if (activeSeries.length < 2) {
        return "⚠️ **Atenção:** Para fazer uma comparação, selecione pelo menos duas categorias no gráfico."
      }

      const totals = activeSeries.map((series) => {
        const total = data.reduce((sum, item) => sum + (Number(item[series]) || 0), 0)
        return { series, total }
      })

      const sorted = totals.sort((a, b) => b.total - a.total)
      const highest = sorted[0]
      const lowest = sorted[sorted.length - 1]
      const ratio = highest.total / lowest.total

      return `## Comparação entre Categorias

### Análise Comparativa:

| Categoria | Total | % do Total | Comparação |
|-----------|------:|----------:|------------|
| **${highest.series}** | $${highest.total.toLocaleString()} | ${((highest.total / totals.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}% | ${ratio.toFixed(1)}× maior |
| **${lowest.series}** | $${lowest.total.toLocaleString()} | ${((lowest.total / totals.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}% | Referência |

### Diferença entre extremos:

* Diferença absoluta: **$${(highest.total - lowest.total).toLocaleString()}**
* Diferença percentual: **${(((highest.total - lowest.total) / lowest.total) * 100).toFixed(1)}%**

> As categorias selecionadas apresentam variação significativa, com **${highest.series}** dominando o mercado.`
    }

    if (lowerQuery.includes("sazonalidade") || lowerQuery.includes("seasonal") || lowerQuery.includes("padrão")) {
      return `## Análise de Sazonalidade 📅

### Padrões identificados:

1. **Picos de vendas:** 
   * Fevereiro: +15% acima da média
   * Abril: +12% acima da média
   * Junho: +18% acima da média

2. **Períodos de baixa:**
   * Outubro: -8% abaixo da média
   * Novembro: -12% abaixo da média

### Padrões por categoria:

| Categoria | Padrão Sazonal | Mês de pico |
|-----------|----------------|-------------|
| **Clothing** | Alta sazonalidade | Fevereiro |
| **Electronics** | Estável | Distribuição uniforme |
| **Books** | Sazonalidade moderada | Junho |

### Recomendações:

\`\`\`
- Planejar promoções para períodos de baixa
- Aumentar estoque antes dos picos sazonais
- Criar campanhas específicas para categorias sazonais
\`\`\`

> **Insight:** A categoria "clothing" apresenta forte correlação com mudanças de estação.`
    }

    // Default response
    return `## Análise de Dados

Posso ajudar você a entender melhor seus dados usando formatação **Markdown**.

### O que você gostaria de saber?

* Tendências gerais ou por categoria
* Comparações entre categorias
* Períodos de melhor/pior desempenho
* Padrões sazonais
* Resumo geral dos dados

Digite sua pergunta ou experimente digitar "Mostre um exemplo de tabela em markdown" para ver como posso formatar os dados.`;
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
                  <label htmlFor="filter-field">Field</label>
                  <select
                    id="filter-field"
                    onChange={(e) => {
                      const newFilter: FilterConfig = {
                        field: e.target.value,
                        operator: "equals",
                        value: "",
                      }
                      addFilter(newFilter)
                    }}
                    className="rounded-md border p-2"
                  >
                    <option value="">Select field</option>
                    {availableFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
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
      <FilterBar filters={filters} removeFilter={removeFilter} />

      <div className="flex flex-col md:flex-row">
        {/* Left Panel - Configuration */}
        <div 
          className={cn(
            "border-r transition-all duration-300 ease-in-out",
            configPanelExpanded ? "w-full md:w-80" : "w-16",
          )}
        >
          <ConfigPanel 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            chartType={chartType}
            setChartType={setChartType}
            xAxisField={xAxisField}
            setXAxisField={setXAxisField}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            showGridLines={showGridLines}
            setShowGridLines={setShowGridLines}
            showDots={showDots}
            setShowDots={setShowDots}
            showLegend={showLegend}
            setShowLegend={setShowLegend}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
            series={series}
            setSeries={setSeries}
            availableFields={availableFields}
            isAddingSeries={isAddingSeries}
            setIsAddingSeries={setIsAddingSeries}
            data={data}
            title={title}
            configPanelExpanded={configPanelExpanded}
            setConfigPanelExpanded={setConfigPanelExpanded}
            addSeries={addSeries}
            removeSeries={removeSeries}
            updateSeries={updateSeries}
          />
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
          <ChartLegend 
            series={series} 
            activeSeries={activeSeries} 
            toggleSeries={toggleSeries} 
          />

          {/* Chart */}
          <div className="h-[500px] w-full">
            <ChartRenderer
              chartType={chartType}
              data={sortedData}
              xAxisField={xAxisField}
              activeSeries={activeSeries}
              series={series}
              showGridLines={showGridLines}
              showDots={showDots}
              showLegend={showLegend}
              showTooltip={showTooltip}
              yAxisTicks={yAxisTicks}
              maxValue={maxValue}
            />
          </div>
        </div>
      </div>

      {/* AI Chat Section - Below the main content */}
      {showAiChat && (
        <AIChat 
          messages={messages}
          setMessages={setMessages}
          isAiThinking={isAiThinking}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          setShowAiChat={setShowAiChat}
          data={data}
          activeSeries={activeSeries}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2">
        <div className="text-sm text-gray-500">Agent</div>
      </div>
    </Card>
  )
}
