"use client"

import * as React from "react"
import { UserPlus, Mail, Shield, MoreHorizontal } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para membros
const membersData = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@metricas.com",
    role: "Admin",
    status: "Ativo",
    lastActive: "Agora",
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos@metricas.com",
    role: "Desenvolvedor",
    status: "Ativo",
    lastActive: "Há 2 horas",
  },
  {
    id: "3",
    name: "Juliana Mendes",
    email: "juliana@metricas.com",
    role: "Analista",
    status: "Ativo",
    lastActive: "Ontem",
  },
  {
    id: "4",
    name: "Roberto Santos",
    email: "roberto@metricas.com",
    role: "Gestor",
    status: "Inativo",
    lastActive: "2 semanas atrás",
  },
]

export function TeamMembers() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Membros da Equipe</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Membros</CardTitle>
          <CardDescription>
            Adicione, remova ou edite os membros da sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center pb-4">
            <Input
              placeholder="Buscar por nome ou email..."
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersData.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === "Admin" ? "default" : "outline"}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === "Ativo" ? "default" : "secondary"} className={member.status === "Ativo" ? "bg-green-100 text-green-800" : ""}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Enviar mensagem</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Editar permissões</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remover membro
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Exportar Lista</Button>
          <div className="space-x-2">
            <Button variant="outline">Anterior</Button>
            <Button variant="outline">Próximo</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
