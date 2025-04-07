"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartComponent, examplePieChartData, exampleChartConfig } from "@/components/charts"

export function PieCard() {
  // Dados sobre uso de navegadores
  const browserData = [
    { name: "Chrome", value: 42.3 },
    { name: "Safari", value: 28.7 },
    { name: "Firefox", value: 15.2 },
    { name: "Edge", value: 10.5 },
    { name: "Outros", value: 3.3 },
  ]

  // Configuração do gráfico
  const chartConfig = {
    Chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    Safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    Firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    Edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    Outros: {
      label: "Outros",
      color: "hsl(var(--chart-5))",
    }
  }

  return (
    <Card className="h-full border border-none shadow-none">
      <CardHeader className="pb-2 pt-4">
        <CardTitle>Distribuição de Navegadores</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] min-h-[200px]">
        <PieChartComponent
          data={browserData}
          valueKey="value"
          nameKey="name"
          totalLabel="% total"
          chartConfig={chartConfig}
          height="100%"
        />
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {browserData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2" 
                style={{ backgroundColor: `var(--color-${item.name})` }}
              />
              <span>{item.name}: <strong>{item.value}%</strong></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 