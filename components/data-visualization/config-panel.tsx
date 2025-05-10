"use client"

import * as React from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { BarChart2, LineChart, AreaChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChartType, SortDirection, SeriesConfig, AggregationType, DEFAULT_COLORS } from "./types"
import { ConfigIcons } from "./config-icons"

interface ConfigPanelProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  chartType: ChartType
  setChartType: (type: ChartType) => void
  xAxisField: string
  setXAxisField: (field: string) => void
  groupBy: string
  setGroupBy: (field: string) => void
  sortDirection: SortDirection
  setSortDirection: (direction: SortDirection) => void
  showGridLines: boolean
  setShowGridLines: (show: boolean) => void
  showDots: boolean
  setShowDots: (show: boolean) => void
  showLegend: boolean
  setShowLegend: (show: boolean) => void
  showTooltip: boolean
  setShowTooltip: (show: boolean) => void
  series: SeriesConfig[]
  setSeries: (series: SeriesConfig[]) => void
  availableFields: string[]
  isAddingSeries: boolean
  setIsAddingSeries: (isAdding: boolean) => void
  data: any[]
  title: string
  configPanelExpanded: boolean
  setConfigPanelExpanded: (expanded: boolean) => void
  addSeries: (newSeries: SeriesConfig) => void
  removeSeries: (seriesKey: string) => void
  updateSeries: (seriesKey: string, updates: Partial<SeriesConfig>) => void
}

const chartTypes = [
  { label: "Linha", value: "line" },
  { label: "Barra", value: "bar" },
  { label: "Área", value: "area" },
  { label: "Pizza", value: "pie" },
]

export function ConfigPanel({
  activeTab,
  setActiveTab,
  chartType,
  setChartType,
  xAxisField,
  setXAxisField,
  groupBy,
  setGroupBy,
  sortDirection,
  setSortDirection,
  showGridLines,
  setShowGridLines,
  showDots,
  setShowDots,
  showLegend,
  setShowLegend,
  showTooltip,
  setShowTooltip,
  series,
  setSeries,
  availableFields,
  isAddingSeries,
  setIsAddingSeries,
  data,
  title,
  configPanelExpanded,
  setConfigPanelExpanded,
  addSeries,
  removeSeries,
  updateSeries,
}: ConfigPanelProps) {
  if (!configPanelExpanded) {
    return (
      <ConfigIcons 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        setConfigPanelExpanded={setConfigPanelExpanded} 
      />
    )
  }
  
  return (
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
                {chartType === "line" && <LineChart className="h-5 w-5 text-gray-500" />}
                {chartType === "bar" && <BarChart2 className="h-5 w-5 text-gray-500" />}
                {chartType === "area" && <AreaChart className="h-5 w-5 text-gray-500" />}
                <span>{typeof chartType === 'string' ? chartType.charAt(0).toUpperCase() + chartType.slice(1) : chartType}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
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
  )
} 