"use client"

import * as React from "react"
import { Label, Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"

// Tipos para as props
interface PieChartProps {
  data: any[]
  valueKey?: string
  nameKey?: string
  totalLabel?: string
  innerRadius?: number
  outerRadius?: number
  chartConfig?: any
  className?: string
  height?: number | string
}

// Cores para os gráficos
const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))'
];

export function PieChartComponent({
  data,
  valueKey = "value",
  nameKey = "name",
  totalLabel = "Total",
  innerRadius = 60,
  outerRadius,
  chartConfig,
  className,
  height = 300
}: PieChartProps) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr[valueKey], 0)
  }, [data, valueKey])

  return (
    <div className={className}>
      <ChartContainer config={chartConfig || {}}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={5}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill || COLORS[index % COLORS.length]} 
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {totalLabel}
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
} 