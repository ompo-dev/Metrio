"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InteractiveBarChartComponent } from "@/components/charts"

export function InteractiveBarCard() {
  // Dados fictícios para logs de erros nos últimos 10 dias
  const errorData = [
    { date: "2023-06-01", frontend: 12, backend: 8, network: 3 },
    { date: "2023-06-02", frontend: 15, backend: 10, network: 5 },
    { date: "2023-06-03", frontend: 8, backend: 12, network: 4 },
    { date: "2023-06-04", frontend: 10, backend: 7, network: 2 },
    { date: "2023-06-05", frontend: 14, backend: 9, network: 6 },
    { date: "2023-06-06", frontend: 7, backend: 5, network: 3 },
    { date: "2023-06-07", frontend: 9, backend: 8, network: 2 },
    { date: "2023-06-08", frontend: 11, backend: 14, network: 5 },
    { date: "2023-06-09", frontend: 6, backend: 9, network: 1 },
    { date: "2023-06-10", frontend: 8, backend: 6, network: 3 },
  ]

  // Configuração do gráfico
  const chartConfig = {
    frontend: {
      label: "Frontend",
      color: "hsl(var(--chart-1))",
    },
    backend: {
      label: "Backend",
      color: "hsl(var(--chart-2))",
    },
    network: {
      label: "Rede",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card className="h-full border border-none shadow-none">
      <CardHeader className="pb-2 pt-4">
        <CardTitle>Monitoramento de Erros</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] min-h-[300px]">
        <InteractiveBarChartComponent
          data={errorData}
          title="Logs de Erros"
          description="Análise de erros por categoria"
          dateRange="últimos 10 dias"
          xAxisKey="date"
          dataKeys={["frontend", "backend", "network"]}
          chartConfig={chartConfig}
          className="h-full"
          dateFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })
          }}
        />
      </CardContent>
    </Card>
  )
} 