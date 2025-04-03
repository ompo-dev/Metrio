"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Tipos para as props
interface InteractiveBarChartProps {
  data: any[]
  title?: string
  description?: string
  dateRange?: string
  xAxisKey?: string
  dataKeys?: string[]
  chartConfig?: any
  className?: string
  dateFormatter?: (date: string) => string
  showHeader?: boolean
}

export function InteractiveBarChartComponent({
  data,
  title = "Gráfico de Barras Interativo",
  description = "Análise detalhada por período",
  dateRange = "últimos 3 meses",
  xAxisKey = "date",
  dataKeys = ["desktop", "mobile"],
  chartConfig = {
    views: {
      label: "Visualizações de Página",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  },
  className,
  dateFormatter = (value) => {
    const date = new Date(value)
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
    })
  },
  showHeader = true,
}: InteractiveBarChartProps) {
  const [activeDataKey, setActiveDataKey] = React.useState<string>(dataKeys[0])

  const totals = React.useMemo(
    () => {
      const result: Record<string, number> = {}
      
      dataKeys.forEach(key => {
        result[key] = data.reduce((acc, curr) => acc + (curr[key] || 0), 0)
      })
      
      return result
    },
    [data, dataKeys]
  )

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row mb-4">
          <div className="flex flex-1 flex-col justify-center gap-1 px-1 py-2">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {(description || dateRange) && (
              <p className="text-sm text-muted-foreground">
                {description} {dateRange && `(${dateRange})`}
              </p>
            )}
          </div>
          <div className="flex">
            {dataKeys.map((key) => (
              <button
                key={key}
                data-active={activeDataKey === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-3"
                onClick={() => setActiveDataKey(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key]?.label || key}
                </span>
                <span className="text-lg font-bold leading-none">
                  {totals[key]?.toLocaleString() || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={dateFormatter}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  if (typeof value === 'string' && value.includes('-')) {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  return value
                }}
              />
            }
          />
          <Bar 
            dataKey={activeDataKey} 
            fill={`var(--color-${activeDataKey})`} 
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
} 