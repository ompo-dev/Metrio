"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"

// Tipos para as props
interface BarChartProps {
  data: any[]
  xAxisKey?: string
  dataKeys?: string[]
  chartConfig?: any
  className?: string
  height?: number | string
}

export function BarChartComponent({
  data,
  xAxisKey = "month",
  dataKeys = ["desktop", "mobile"],
  chartConfig = {
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
  height = 300
}: BarChartProps) {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart 
            accessibilityLayer 
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 8
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {dataKeys.map((key) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={`var(--color-${key})`} 
                radius={4} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
} 