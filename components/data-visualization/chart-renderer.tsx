"use client"

import * as React from "react"
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
import { ChartType, DataPoint, SeriesConfig } from "./types"
import { cn } from "@/lib/utils"

interface ChartRendererProps {
  chartType: ChartType
  data: DataPoint[]
  xAxisField: string
  activeSeries: string[]
  series: SeriesConfig[]
  showGridLines: boolean
  showDots: boolean
  showLegend: boolean
  showTooltip: boolean
  yAxisTicks: number[]
  maxValue: number
}

export function ChartRenderer({
  chartType,
  data,
  xAxisField,
  activeSeries,
  series,
  showGridLines,
  showDots,
  showLegend,
  showTooltip,
  yAxisTicks,
  maxValue,
}: ChartRendererProps) {
  const commonProps = {
    data,
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
      return null;
    })
  }

  const renderXAxis = () => (
    <XAxis
      dataKey={xAxisField}
      axisLine={{ stroke: "#e2e8f0" }}
      tickLine={false}
      tick={{ fontSize: 12, fill: "#94a3b8" }}
    />
  )

  const renderYAxis = () => (
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
  )

  const renderTooltip = () => showTooltip && (
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
  )

  const renderLegend = () => showLegend && (
    <Legend
      verticalAlign="top"
      height={36}
      iconType="circle"
      iconSize={8}
      wrapperStyle={{ fontSize: "12px" }}
    />
  )

  const renderGrid = () => showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </LineChart>
      )
    } else if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </AreaChart>
      )
    } else if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </BarChart>
      )
    }
    
    // Retorno padrão
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <p className="text-gray-400">Nenhum gráfico selecionado</p>
      </div>
    )
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  )
} 