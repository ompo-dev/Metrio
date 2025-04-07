"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartComponent } from "@/components/charts"
import { Badge } from "@/components/ui/badge"

export function ABTestCard() {
  // Dados de testes A/B para diferentes variantes
  const abTestData = [
    { 
      name: "Conversão", 
      varianteA: 4.2, 
      varianteB: 5.8, 
      winner: "B",
      improvement: "+38.1%"
    },
    { 
      name: "Engajamento", 
      varianteA: 2.9, 
      varianteB: 3.2, 
      winner: "B",
      improvement: "+10.3%"
    },
    { 
      name: "Tempo Médio", 
      varianteA: 3.7, 
      varianteB: 2.8, 
      winner: "B",
      improvement: "-24.3%"
    }
  ]

  // Dados para o gráfico de barras (variantes comparadas)
  const chartData = [
    { metric: "Conversão (%)", varianteA: 4.2, varianteB: 5.8 },
    { metric: "Engajamento", varianteA: 2.9, varianteB: 3.2 },
    { metric: "Tempo (min)", varianteA: 3.7, varianteB: 2.8 },
  ]

  // Configuração do gráfico
  const chartConfig = {
    varianteA: {
      label: "Variante A (Controle)",
      color: "hsl(var(--chart-1))",
    },
    varianteB: {
      label: "Variante B (Teste)",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <Card className="h-full border border-none shadow-none">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle>Teste A/B: Botão CTA</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Concluído
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] mb-4">
          <BarChartComponent
            data={chartData}
            xAxisKey="metric"
            dataKeys={["varianteA", "varianteB"]}
            chartConfig={chartConfig}
            height="100%"
          />
        </div>
        
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium">Resultados:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {abTestData.map((item) => (
              <div key={item.name} className="border rounded-md p-2">
                <div className="font-medium mb-1">{item.name}</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>A: <span className="font-medium">{item.varianteA}</span></div>
                  <div>B: <span className="font-medium">{item.varianteB}</span></div>
                </div>
                <div className="mt-1 text-xs flex items-center">
                  <span className={`font-medium ${item.improvement.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                    {item.improvement}
                  </span>
                  <Badge className="ml-1 h-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {item.winner}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 