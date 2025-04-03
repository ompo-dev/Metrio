"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveBarChartComponent, PieChartComponent } from "@/components/charts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Lightbulb, Sparkles } from "lucide-react"

// Dados Mock para gráficos
const dailyAnalyticsData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 30 + i + 1);
  return {
    date: date.toISOString().split('T')[0],
    pageviews: Math.floor(Math.random() * 500) + 500,
    visitors: Math.floor(Math.random() * 300) + 200,
  };
});

const browserData = [
  { browser: "Chrome", visitors: 12568, value: 58, fill: "var(--color-chrome)" },
  { browser: "Safari", visitors: 6254, value: 28, fill: "var(--color-safari)" },
  { browser: "Firefox", visitors: 1854, value: 8, fill: "var(--color-firefox)" },
  { browser: "Edge", visitors: 983, value: 4, fill: "var(--color-edge)" },
  { browser: "Outros", visitors: 421, value: 2, fill: "var(--color-outros)" },
];

const deviceData = [
  { device: "Desktop", visitors: 14325, value: 65, fill: "var(--color-desktop)" },
  { device: "Mobile", visitors: 6894, value: 31, fill: "var(--color-mobile)" },
  { device: "Tablet", visitors: 861, value: 4, fill: "var(--color-tablet)" },
];

const pageViewsConfig = {
  views: {
    label: "Visualizações",
  },
  pageviews: {
    label: "Page Views",
    color: "hsl(var(--chart-1))",
  },
  visitors: {
    label: "Visitantes Únicos",
    color: "hsl(var(--chart-2))",
  },
};

const browserConfig = {
  visitors: {
    label: "Visitantes",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  outros: {
    label: "Outros",
    color: "hsl(var(--chart-5))",
  },
};

const deviceConfig = {
  visitors: {
    label: "Visitantes",
  },
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
};

export function MetricsAnalytics() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="browsers">Navegadores</TabsTrigger>
        <TabsTrigger value="devices">Dispositivos</TabsTrigger>
        <TabsTrigger value="sources">Origens</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Visualizações de Página</CardTitle>
              <CardDescription>
                Últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <InteractiveBarChartComponent 
                data={dailyAnalyticsData}
                title="Análise de Tráfego"
                description="Visualizações de página e visitantes únicos"
                dateRange="últimos 30 dias"
                xAxisKey="date"
                dataKeys={["pageviews", "visitors"]}
                chartConfig={pageViewsConfig}
                className="border-0 shadow-none"
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Distribuição por Navegador</CardTitle>
              <CardDescription>
                Porcentagem total de visitantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartComponent 
                data={browserData}
                valueKey="value"
                nameKey="browser"
                totalLabel="Visitantes"
                chartConfig={browserConfig}
                innerRadius={60}
                className="border-0 shadow-none"
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="browsers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Navegadores</CardTitle>
            <CardDescription>
              Distribuição de tráfego por navegador
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="grid gap-4 md:grid-cols-2">
              <PieChartComponent 
                data={browserData}
                valueKey="value"
                nameKey="browser"
                totalLabel="Visitantes"
                chartConfig={browserConfig}
                innerRadius={60}
                className="border-0 shadow-none"
              />
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Chrome</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.568</div>
                    <p className="text-xs text-muted-foreground">58% do total de visitantes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Safari</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6.254</div>
                    <p className="text-xs text-muted-foreground">28% do total de visitantes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Firefox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.854</div>
                    <p className="text-xs text-muted-foreground">8% do total de visitantes</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="devices" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Dispositivos</CardTitle>
            <CardDescription>
              Distribuição de tráfego por tipo de dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="grid gap-4 md:grid-cols-2">
              <PieChartComponent 
                data={deviceData}
                valueKey="value"
                nameKey="device"
                totalLabel="Visitantes"
                chartConfig={deviceConfig}
                innerRadius={60}
                className="border-0 shadow-none"
              />
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Desktop</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">14.325</div>
                    <p className="text-xs text-muted-foreground">65% do total de visitantes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Mobile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6.894</div>
                    <p className="text-xs text-muted-foreground">31% do total de visitantes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tablet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">861</div>
                    <p className="text-xs text-muted-foreground">4% do total de visitantes</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sources" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Fontes de Tráfego</CardTitle>
            <CardDescription>Principais origens de visitantes</CardDescription>
          </CardHeader>
          <CardContent className="h-[450px]">
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Dados em breve disponíveis</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

