"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Filter, MessageSquare, RotateCcw} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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

// Utilitários
import { 
  applyFilters, 
  sortData, 
  calculateMaxValue, 
  generateYAxisTicks, 
  extractAvailableFields,
  initializeSeries,
  addSeries as addSeriesUtil,
  removeSeries as removeSeriesUtil,
  updateSeries as updateSeriesUtil,
  toggleSeriesVisibility
} from "./data-utils"

// Gerador de respostas de IA
import { generateAiResponse } from "./ai-response-generator"

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
  const availableFields = React.useMemo(() => 
    extractAvailableFields(data), [data]
  )

  // Initialize series based on data
  const [series, setSeries] = React.useState<SeriesConfig[]>(() => 
    initializeSeries(data, availableFields, xAxisField, DEFAULT_COLORS)
  )

  const [activeSeries, setActiveSeries] = React.useState<string[]>(series.map((s) => s.key))

  // Apply filters to data
  const filteredData = React.useMemo(() => 
    applyFilters(data, filters), 
    [data, filters]
  )

  // Sort data
  const sortedData = React.useMemo(() => 
    sortData(filteredData, xAxisField, sortDirection), 
    [filteredData, xAxisField, sortDirection]
  )

  // Toggle series visibility
  const toggleSeries = (seriesKey: string) => {
    setActiveSeries(prev => toggleSeriesVisibility(prev, seriesKey))
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
    setSeries(prev => addSeriesUtil(prev, newSeries))
    setActiveSeries((prev) => [...prev, newSeries.key])
    setIsAddingSeries(false)
  }

  // Remove a series
  const removeSeries = (seriesKey: string) => {
    setSeries(prev => removeSeriesUtil(prev, seriesKey))
    setActiveSeries((prev) => prev.filter((key) => key !== seriesKey))
  }

  // Update series configuration
  const updateSeries = (seriesKey: string, updates: Partial<SeriesConfig>) => {
    setSeries(prev => updateSeriesUtil(prev, seriesKey, updates))
  }

  // Get max value for Y axis
  const maxValue = React.useMemo(() => 
    calculateMaxValue(sortedData, activeSeries),
    [sortedData, activeSeries]
  )

  // Generate Y axis ticks
  const yAxisTicks = React.useMemo(() => 
    generateYAxisTicks(maxValue),
    [maxValue]
  )

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
      const aiResponse = generateAiResponse(currentMessage, sortedData, activeSeries, series, xAxisField)
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

  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <RotateCcw className="h-3 w-3 text-gray-500" />
          </div>
          <h2 className="text-base font-medium text-gray-700">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex flex-col lg:flex-row">
        {/* Left Panel - Configuration */}
        <div 
          className={cn(
            "border-r transition-all duration-300 ease-in-out",
            configPanelExpanded ? "w-full lg:w-80" : "w-16",
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
          <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full">
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

      {/* AI Chat Section */}
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

export function ChartSkeleton() {
  return (
    <Card className="mx-auto max-w-6xl overflow-hidden p-0">
      <div className="mb-4 flex items-center justify-between border-b px-4 py-3">
        <Skeleton className="h-6 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="border-r w-16 md:w-80">
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </Card>
  )
}
