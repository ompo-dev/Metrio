"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, Activity } from "lucide-react"

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Eventos
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45.231</div>
          <p className="text-xs text-muted-foreground">
            +20.1% em relação ao mês passado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Visitantes Únicos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.350</div>
          <p className="text-xs text-muted-foreground">
            +10.1% em relação à semana passada
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receita Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$45.231,89</div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              +20.1% <TrendingUp className="h-3 w-3 ml-1" />
            </Badge>
            <span className="text-xs text-muted-foreground">vs. mês anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.8%</div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              +0.5% <TrendingUp className="h-3 w-3 ml-1" />
            </Badge>
            <span className="text-xs text-muted-foreground">vs. semana anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

