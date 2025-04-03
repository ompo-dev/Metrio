"use client"

import * as React from "react"
import { UsersRound, Settings, HelpCircle, Mail, Building, Calendar, Package, Briefcase, UserPlus, FileText, Edit } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const teamData = {
  id: "1",
  name: "Métricas SaaS",
  plan: "Enterprise",
  status: "Ativo",
  created: "12/01/2023",
  members: 12,
  description: "Equipe principal de desenvolvimento e gestão do Métricas SaaS.",
  company: "Métricas Tecnologia Ltda.",
  contactEmail: "equipe@metricas.com",
  industry: "SaaS / Tecnologia",
  location: "São Paulo, Brasil",
  projects: [
    {
      id: "p1",
      name: "Dashboard v2.0",
      status: "Em andamento",
      progress: 65,
      deadline: "30/06/2023",
    },
    {
      id: "p2",
      name: "API Integrations",
      status: "Concluído",
      progress: 100,
      deadline: "15/03/2023",
    },
    {
      id: "p3",
      name: "Mobile App",
      status: "Planejamento",
      progress: 20,
      deadline: "01/09/2023",
    },
  ],
  recentActivities: [
    {
      id: "a1", 
      type: "member_added",
      description: "Novo membro adicionado: Lucas Silva",
      date: "Ontem, 14:23",
    },
    {
      id: "a2",
      type: "project_updated",
      description: "Projeto 'Dashboard v2.0' atualizado",
      date: "Ontem, 11:45",
    },
    {
      id: "a3",
      type: "permission_changed",
      description: "Permissões atualizadas para: Ana Paula",
      date: "22/05/2023, 09:12",
    },
    {
      id: "a4",
      type: "plan_upgraded",
      description: "Plano atualizado para Enterprise",
      date: "15/05/2023, 16:30",
    },
  ],
  keyMembers: [
    {
      id: "m1",
      name: "Carlos Oliveira",
      role: "Líder de Equipe",
      avatar: "/avatars/carlos.jpg",
      email: "carlos@metricas.com",
    },
    {
      id: "m2",
      name: "Ana Silva",
      role: "Gerente de Projeto",
      avatar: "/avatars/ana.jpg",
      email: "ana@metricas.com",
    },
    {
      id: "m3",
      name: "Roberto Santos",
      role: "Desenvolvedor Sênior",
      avatar: "/avatars/roberto.jpg",
      email: "roberto@metricas.com",
    },
  ],
}

export function TeamDetails({ teamId }: { teamId?: string }) {
  // No mundo real, usaríamos o teamId para buscar dados da API
  // Para este exemplo, estamos usando dados fictícios
  const team = teamData
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{team.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant={team.status === "Ativo" ? "default" : "secondary"} className={team.status === "Ativo" ? "bg-green-100 text-green-800" : ""}>
              {team.status}
            </Badge>
            <span className="text-sm text-muted-foreground">Plano: {team.plan}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{team.members} membros</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Editar Equipe
          </Button>
          <Button className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Informações da Equipe</CardTitle>
            <CardDescription>
              Detalhes e configurações da equipe {team.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="projects">Projetos</TabsTrigger>
                <TabsTrigger value="activity">Atividades</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Sobre esta equipe</h3>
                      <p className="text-sm text-muted-foreground">{team.description}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Informações de Contato</h3>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{team.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{team.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{team.industry}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Criada em: {team.created}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Principais Membros</h3>
                      <div className="grid gap-2">
                        {team.keyMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-2 rounded-md border p-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{member.name}</p>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <HelpCircle className="h-4 w-4" />
                                  <span className="sr-only">Info</span>
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Package className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Plano {team.plan}</h4>
                        <p className="text-xs text-muted-foreground">
                          Acesso completo a todas as funcionalidades
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Mudar Plano
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="projects" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Projeto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            project.status === "Em andamento" ? "default" :
                            project.status === "Concluído" ? "outline" : "secondary"
                          }>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full max-w-24 rounded-full bg-secondary">
                              <div 
                                className="h-2 rounded-full bg-primary" 
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.deadline}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Ver Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="activity" className="pt-4">
                <div className="space-y-4">
                  {team.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-2 rounded-md border p-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                        {activity.type === "member_added" ? (
                          <UserPlus className="h-4 w-4 text-primary" />
                        ) : activity.type === "project_updated" ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : activity.type === "permission_changed" ? (
                          <Settings className="h-4 w-4 text-primary" />
                        ) : (
                          <Package className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="settings" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Configurações da Equipe</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerencie as configurações da equipe {team.name}
                    </p>
                  </div>
                  <p>Conteúdo das configurações será exibido aqui.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resumo da Equipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Membros</h3>
              <div className="flex -space-x-2">
                {team.keyMembers.map((member, index) => (
                  <Avatar key={member.id} className="border-2 border-background">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{team.members - team.keyMembers.length}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Estatísticas Rápidas</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border p-2 text-center">
                  <p className="text-xs text-muted-foreground">Projetos</p>
                  <p className="text-lg font-medium">{team.projects.length}</p>
                </div>
                <div className="rounded-md border p-2 text-center">
                  <p className="text-xs text-muted-foreground">Atividades</p>
                  <p className="text-lg font-medium">{team.recentActivities.length}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UsersRound className="mr-2 h-4 w-4" />
                  Ver Todos os Membros
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações da Equipe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Suporte para Equipes
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver Relatório Completo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 