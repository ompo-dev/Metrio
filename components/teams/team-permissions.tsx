"use client"

import * as React from "react"
import { Shield, Check, X, Info } from "lucide-react"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Dados de exemplo para permissões
const rolePermissions = [
  {
    id: "1",
    role: "Admin",
    description: "Acesso completo a todas as funcionalidades",
    permissions: {
      dashboard: true,
      webhooks: true,
      ai: true,
      dataManagement: true,
      security: true,
      documentation: true,
      settings: true,
      teams: true,
      billing: true,
    },
  },
  {
    id: "2",
    role: "Gerente",
    description: "Pode gerenciar equipes e visualizar dados",
    permissions: {
      dashboard: true,
      webhooks: true,
      ai: true,
      dataManagement: true,
      security: false,
      documentation: true,
      settings: false,
      teams: true,
      billing: false,
    },
  },
  {
    id: "3",
    role: "Desenvolvedor",
    description: "Acesso a webhooks e desenvolvimento",
    permissions: {
      dashboard: true,
      webhooks: true,
      ai: true,
      dataManagement: false,
      security: false,
      documentation: true,
      settings: false,
      teams: false,
      billing: false,
    },
  },
  {
    id: "4",
    role: "Analista",
    description: "Pode visualizar e analisar dados",
    permissions: {
      dashboard: true,
      webhooks: false,
      ai: true,
      dataManagement: true,
      security: false,
      documentation: true,
      settings: false,
      teams: false,
      billing: false,
    },
  },
  {
    id: "5",
    role: "Visualizador",
    description: "Acesso somente leitura",
    permissions: {
      dashboard: true,
      webhooks: false,
      ai: false,
      dataManagement: false,
      security: false,
      documentation: true,
      settings: false,
      teams: false,
      billing: false,
    },
  },
]

export function TeamPermissions() {
  const [roles, setRoles] = React.useState(rolePermissions)

  const togglePermission = (roleId: string, permKey: string) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permKey]: !role.permissions[permKey as keyof typeof role.permissions],
            },
          }
        }
        return role
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Permissões de Equipe</h2>
        <Button className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Nova Função
        </Button>
      </div>
      
      <Tabs defaultValue="funcoes" className="w-full">
        <TabsList>
          <TabsTrigger value="funcoes">Funções e Permissões</TabsTrigger>
          <TabsTrigger value="politicas">Políticas de Acesso</TabsTrigger>
        </TabsList>
        <TabsContent value="funcoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Funções</CardTitle>
              <CardDescription>
                Configure as permissões para cada função na sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Função</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Dashboard</TableHead>
                    <TableHead>Webhooks</TableHead>
                    <TableHead>IA & Insights</TableHead>
                    <TableHead>Dados</TableHead>
                    <TableHead>Equipes</TableHead>
                    <TableHead>Segurança</TableHead>
                    <TableHead>Configurações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.role}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{role.description}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.dashboard} 
                            onCheckedChange={() => togglePermission(role.id, 'dashboard')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.webhooks} 
                            onCheckedChange={() => togglePermission(role.id, 'webhooks')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.ai} 
                            onCheckedChange={() => togglePermission(role.id, 'ai')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.dataManagement} 
                            onCheckedChange={() => togglePermission(role.id, 'dataManagement')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.teams} 
                            onCheckedChange={() => togglePermission(role.id, 'teams')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.security} 
                            onCheckedChange={() => togglePermission(role.id, 'security')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={role.permissions.settings} 
                            onCheckedChange={() => togglePermission(role.id, 'settings')}
                            disabled={role.role === "Admin"}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Info className="mr-1 h-4 w-4" />
                      Funções pré-definidas não podem ser excluídas
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Algumas funções são padrão do sistema e não podem ser modificadas completamente.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="politicas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Acesso</CardTitle>
              <CardDescription>
                Configure políticas avançadas de acesso para sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Políticas de acesso serão exibidas aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 