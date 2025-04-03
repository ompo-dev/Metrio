import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import React from "react"

interface MetricCardData {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

export interface ChartDataPoint {
  month: string
  cadastros: number
  logins: number
  compras: number
}

export interface EventData {
  id: string
  type: string
  source: string
  timestamp: string
  status: "success" | "pending" | "error"
}

// Função que simula a obtenção de dados do servidor
// Em produção, esta função faria uma chamada real à API ou banco de dados
export async function getMetricsCardsData(): Promise<MetricCardData[]> {
  // Simulando um pequeno atraso de rede - remover em produção
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return [
    {
      title: "Total de Eventos",
      value: "45,231",
      change: "20.1% em relação ao mês anterior",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Usuários Ativos",
      value: "2,350",
      change: "10.5% em relação ao mês anterior",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Receita Total",
      value: "R$ 12,234",
      change: "15.2% em relação ao mês anterior",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Integrações Ativas",
      value: "42",
      change: "5 novas integrações este mês",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />
    }
  ]
}

export async function getChartData(): Promise<ChartDataPoint[]> {
  // Simulando um pequeno atraso de rede - remover em produção
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
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
}

export async function getTableEvents(): Promise<EventData[]> {
  // Simulando um pequeno atraso de rede - remover em produção
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return [
    {
      id: "1",
      type: "Cadastro",
      source: "Website",
      timestamp: "2023-10-15 14:32:45",
      status: "success",
    },
    {
      id: "2",
      type: "Login",
      source: "App Mobile",
      timestamp: "2023-10-15 14:30:12",
      status: "success",
    },
    {
      id: "3",
      type: "Compra",
      source: "Website",
      timestamp: "2023-10-15 14:28:30",
      status: "success",
    },
    {
      id: "4",
      type: "Visualização",
      source: "App Mobile",
      timestamp: "2023-10-15 14:25:18",
      status: "pending",
    },
    {
      id: "5",
      type: "Webhook",
      source: "API",
      timestamp: "2023-10-15 14:22:05",
      status: "error",
    },
  ]
} 