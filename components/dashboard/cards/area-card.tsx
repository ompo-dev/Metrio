"use client"

import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChartComponent } from "@/components/charts"

export function AreaCard() {
  // Dados fictícios para estatísticas de login
  const loginData = [
    { date: "2023-06-01", desktop: 126, mobile: 85, tablet: 35 },
    { date: "2023-06-02", desktop: 165, mobile: 108, tablet: 42 },
    { date: "2023-06-03", desktop: 142, mobile: 95, tablet: 38 },
    { date: "2023-06-04", desktop: 173, mobile: 120, tablet: 45 },
    { date: "2023-06-05", desktop: 188, mobile: 132, tablet: 51 },
    { date: "2023-06-06", desktop: 213, mobile: 145, tablet: 55 },
    { date: "2023-06-07", desktop: 237, mobile: 160, tablet: 62 },
  ]

  // Configuração do gráfico
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    tablet: {
      label: "Tablet",
      color: "hsl(var(--chart-3))",
    },
  }

  // Calcular total de logins do dia mais recente
  const latestDay = loginData[loginData.length - 1]
  const todayTotal = latestDay.desktop + latestDay.mobile + latestDay.tablet

  // Calcular crescimento percentual comparado com o primeiro dia
  const firstDay = loginData[0]
  const firstDayTotal = firstDay.desktop + firstDay.mobile + firstDay.tablet
  const growthPercentage = ((todayTotal - firstDayTotal) / firstDayTotal * 100).toFixed(1)

  return (
    <Card className="h-full border border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
        <CardTitle className="text-sm font-medium">Logins por Dispositivo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <div className="text-2xl font-bold">{todayTotal} logins</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <span className={`flex items-center ${Number(growthPercentage) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {growthPercentage}% <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
            <span className="ml-1">nos últimos 7 dias</span>
          </p>
        </div>
        <div className="h-[180px]">
          <AreaChartComponent 
            data={loginData} 
            xAxisKey="date" 
            dataKeys={["desktop", "mobile", "tablet"]} 
            chartConfig={chartConfig}
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  )
} 