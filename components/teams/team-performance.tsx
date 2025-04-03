"use client"

import * as React from "react"
import { PieChart, BarChart, Activity, Users, Calendar, ArrowUp, ArrowDown, ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Componente gráfico fictício (no projeto real, usaria uma lib como recharts ou chart.js)
const TeamPerformanceChart = () => {
  return (
    <div className="rounded-md border p-4 h-[300px] flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-2">
        <BarChart className="h-16 w-16 mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">Gráfico de desempenho da equipe</p>
      </div>
    </div>
  )
}

const ProductivityChart = () => {
  return (
    <div className="rounded-md border p-4 h-[300px] flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-2">
        <Activity className="h-16 w-16 mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">Gráfico de produtividade</p>
      </div>
    </div>
  )
}

// Dados de desempenho de exemplo
const performanceData = [
  {
    metric: "Tickets resolvidos",
    value: 284,
    change: 12,
    trend: "up",
  },
  {
    metric: "Tempo médio de resposta",
    value: "2.4h",
    change: -8,
    trend: "down",
  },
  {
    metric: "Satisfação do cliente",
    value: "94%",
    change: 3,
    trend: "up",
  },
  {
    metric: "Taxa de sucesso",
    value: "98.2%",
    change: 0.5,
    trend: "up",
  },
]

const teamsPerformance = [
  {
    id: "1",
    name: "Métricas SaaS",
    members: 12,
    completedTasks: 156,
    pendingTasks: 23,
    productivity: 92,
    trend: "up",
  },
  {
    id: "2",
    name: "Acme Corp.",
    members: 8,
    completedTasks: 89,
    pendingTasks: 17,
    productivity: 84,
    trend: "up",
  },
  {
    id: "3",
    name: "Tech Solutions",
    members: 5,
    completedTasks: 52,
    pendingTasks: 19,
    productivity: 76,
    trend: "down",
  },
]

export function TeamPerformance() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Desempenho de Equipes</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button>Exportar Relatório</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceData.map((item) => (
          <Card key={item.metric}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.metric}
              </CardTitle>
              {item.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : item.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowRight className="h-4 w-4 text-gray-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.change > 0 ? "+" : ""}{item.change}% em comparação ao período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="teams">Comparação de Equipes</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtividade da Equipe</CardTitle>
                <CardDescription>
                  Desempenho da equipe nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamPerformanceChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Produtividade</CardTitle>
                <CardDescription>
                  Análise da produtividade por dia da semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductivityChart />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Equipes</CardTitle>
              <CardDescription>
                Comparação do desempenho entre equipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {teamsPerformance.map((team) => (
                  <div key={team.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{team.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({team.members} membros)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{team.productivity}%</span>
                        {team.trend === "up" ? (
                          <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: `${team.productivity}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Tarefas concluídas: {team.completedTasks}</span>
                      <span>Tarefas pendentes: {team.pendingTasks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Agendar Revisão
              </Button>
              <Button>Ver Relatório Completo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Equipes</CardTitle>
              <CardDescription>
                Análise comparativa detalhada entre equipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de comparação entre equipes será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Desempenho</CardTitle>
              <CardDescription>
                Análise de tendências ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gráficos e análises de tendências serão exibidos aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 