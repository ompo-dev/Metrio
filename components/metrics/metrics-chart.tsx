"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Esta parte precisa ficar no cliente devido ao componente de chart que usa interatividade
const chartConfig = {
  cadastros: {
    label: "Cadastros",
    color: "hsl(var(--chart-1))",
  },
  logins: {
    label: "Logins",
    color: "hsl(var(--chart-2))",
  },
  compras: {
    label: "Compras",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

// Dados mockados para evitar problema de carregamento
const mockChartData = [
  { month: "Jan", cadastros: 165, logins: 180, compras: 65 },
  { month: "Fev", cadastros: 190, logins: 220, compras: 78 },
  { month: "Mar", cadastros: 210, logins: 250, compras: 85 },
  { month: "Abr", cadastros: 180, logins: 230, compras: 70 },
  { month: "Mai", cadastros: 220, logins: 270, compras: 90 },
  { month: "Jun", cadastros: 250, logins: 300, compras: 110 },
  { month: "Jul", cadastros: 280, logins: 320, compras: 120 },
  { month: "Ago", cadastros: 260, logins: 290, compras: 100 },
  { month: "Set", cadastros: 290, logins: 350, compras: 130 },
  { month: "Out", cadastros: 320, logins: 380, compras: 140 },
  { month: "Nov", cadastros: 300, logins: 360, compras: 135 },
  { month: "Dez", cadastros: 340, logins: 400, compras: 150 },
]

export function MetricsChart() {
  const [data, setData] = useState(mockChartData)
  
  return (
    <ChartContainer config={chartConfig} className="h-[250px]">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="compras"
          type="monotone"
          fill="var(--color-compras)"
          fillOpacity={0.4}
          stroke="var(--color-compras)"
          stackId="a"
        />
        <Area
          dataKey="cadastros"
          type="monotone"
          fill="var(--color-cadastros)"
          fillOpacity={0.4}
          stroke="var(--color-cadastros)"
          stackId="a"
        />
        <Area
          dataKey="logins"
          type="monotone"
          fill="var(--color-logins)"
          fillOpacity={0.4}
          stroke="var(--color-logins)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}

