"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChartComponent, PieChartComponent } from "@/components/charts"
import { Smartphone, Laptop, Tablet } from "lucide-react"

export function DeviceMetricsCard() {
  // Dados fictícios para os dispositivos
  const deviceData = {
    lastMonth: [
      { device: "Smartphone", value: 58 },
      { device: "Desktop", value: 32 },
      { device: "Tablet", value: 10 },
    ],
    byBrand: [
      { device: "Apple", value: 42 },
      { device: "Samsung", value: 28 },
      { device: "Xiaomi", value: 12 },
      { device: "Outros", value: 18 },
    ],
    byOS: [
      { device: "Android", value: 52 },
      { device: "iOS", value: 38 },
      { device: "Windows", value: 8 },
      { device: "Outros", value: 2 },
    ],
    trend: [
      { month: "Jan", smartphone: 48, desktop: 40, tablet: 12 },
      { month: "Fev", smartphone: 50, desktop: 38, tablet: 12 },
      { month: "Mar", smartphone: 52, desktop: 36, tablet: 12 },
      { month: "Abr", smartphone: 54, desktop: 34, tablet: 12 },
      { month: "Mai", smartphone: 55, desktop: 34, tablet: 11 },
      { month: "Jun", smartphone: 58, desktop: 32, tablet: 10 },
    ]
  }

  // Configurações dos gráficos
  const pieChartConfig = {
    Smartphone: {
      label: "Smartphone",
      color: "hsl(var(--chart-1))",
    },
    Desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-2))",
    },
    Tablet: {
      label: "Tablet",
      color: "hsl(var(--chart-3))",
    },
    Apple: {
      label: "Apple",
      color: "hsl(var(--chart-1))",
    },
    Samsung: {
      label: "Samsung",
      color: "hsl(var(--chart-2))",
    },
    Xiaomi: {
      label: "Xiaomi",
      color: "hsl(var(--chart-3))",
    },
    Outros: {
      label: "Outros",
      color: "hsl(var(--chart-5))",
    },
    Android: {
      label: "Android",
      color: "hsl(var(--chart-4))",
    },
    iOS: {
      label: "iOS",
      color: "hsl(var(--chart-1))",
    },
    Windows: {
      label: "Windows",
      color: "hsl(var(--chart-2))",
    },
  }

  const barChartConfig = {
    smartphone: {
      label: "Smartphone",
      color: "hsl(var(--chart-1))",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-2))",
    },
    tablet: {
      label: "Tablet",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card className="h-full border border-none shadow-none">
      <CardHeader className="pb-2 pt-4">
        <CardTitle>Métricas por Dispositivo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-1">
              <Smartphone className="h-4 w-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="brands">
              <span>Por Marca</span>
            </TabsTrigger>
            <TabsTrigger value="os">
              <span>Por Sistema</span>
            </TabsTrigger>
            <TabsTrigger value="trend">
              <span>Tendência</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-2 h-[220px]">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="col-span-1 grid content-center">
                <div className="space-y-6">
                  {deviceData.lastMonth.map((item) => (
                    <div key={item.device} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {item.device === "Smartphone" && <Smartphone className="h-4 w-4 mr-2" />}
                          {item.device === "Desktop" && <Laptop className="h-4 w-4 mr-2" />}
                          {item.device === "Tablet" && <Tablet className="h-4 w-4 mr-2" />}
                          <span className="text-sm font-medium">{item.device}</span>
                        </div>
                        <span className="text-sm font-bold">{item.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${item.value}%`,
                            backgroundColor: item.device === "Smartphone" 
                              ? "hsl(var(--chart-1))" 
                              : item.device === "Desktop" 
                                ? "hsl(var(--chart-2))" 
                                : "hsl(var(--chart-3))" 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 h-full">
                <PieChartComponent
                  data={deviceData.lastMonth}
                  valueKey="value"
                  nameKey="device"
                  totalLabel="acessos"
                  chartConfig={pieChartConfig}
                  height="100%"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="brands" className="mt-2 h-[220px]">
            <PieChartComponent
              data={deviceData.byBrand}
              valueKey="value"
              nameKey="device"
              totalLabel="% total"
              chartConfig={pieChartConfig}
              height="100%"
            />
          </TabsContent>
          
          <TabsContent value="os" className="mt-2 h-[220px]">
            <PieChartComponent
              data={deviceData.byOS}
              valueKey="value"
              nameKey="device"
              totalLabel="% total"
              chartConfig={pieChartConfig}
              height="100%"
            />
          </TabsContent>
          
          <TabsContent value="trend" className="mt-2 h-[220px]">
            <BarChartComponent
              data={deviceData.trend}
              xAxisKey="month"
              dataKeys={["smartphone", "desktop", "tablet"]}
              chartConfig={barChartConfig}
              height="100%"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 