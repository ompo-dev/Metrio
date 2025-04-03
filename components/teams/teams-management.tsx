"use client"

import * as React from "react"
import { Users, UserPlus, Settings, PieChart, MoreHorizontal } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Dados de exemplo para equipes
const teamsData = [
  {
    id: "1",
    name: "Métricas SaaS",
    members: 12,
    plan: "Enterprise",
    lastActive: "Hoje",
  },
  {
    id: "2",
    name: "Acme Corp.",
    members: 8,
    plan: "Startup",
    lastActive: "Ontem",
  },
  {
    id: "3",
    name: "Tech Solutions",
    members: 5,
    plan: "Free",
    lastActive: "3 dias atrás",
  },
]

export function TeamsManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Equipes</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Nova Equipe
        </Button>
      </div>
      
      <Tabs defaultValue="todas" className="w-full">
        <TabsList>
          <TabsTrigger value="todas">Todas as Equipes</TabsTrigger>
          <TabsTrigger value="ativas">Equipes Ativas</TabsTrigger>
          <TabsTrigger value="inativas">Equipes Inativas</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipes</CardTitle>
              <CardDescription>
                Gerencie todas as equipes da sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamsData.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.members}</TableCell>
                      <TableCell>{team.plan}</TableCell>
                      <TableCell>{team.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Exportar Dados</Button>
              <Button>Ver Todas</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="ativas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipes Ativas</CardTitle>
              <CardDescription>
                Equipes com atividade nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo de equipes ativas será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inativas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipes Inativas</CardTitle>
              <CardDescription>
                Equipes sem atividade nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo de equipes inativas será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

