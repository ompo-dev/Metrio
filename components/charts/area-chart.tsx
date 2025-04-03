"use client"

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"

// Tipos para as props
interface AreaChartProps {
  data: any[]
  xAxisKey?: string
  dataKeys?: string[]
  chartConfig?: any
  className?: string
  height?: number | string
}

export function AreaChartComponent({
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
}: AreaChartProps) {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
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
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`var(--color-${key})`}
                fillOpacity={0.4}
                stroke={`var(--color-${key})`}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
} 