"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BreadcrumbSelect } from "@/components/breadcrumb-select/breadcrumb-select";
import {
  Shield,
  Key,
  User,
  UserCheck,
  Lock,
  LogIn,
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
  Settings2,
  Filter,
  Smartphone,
  BarChart,
} from "lucide-react";

export function EnterpriseSecurity() {
  const [activeTab, setActiveTab] = useState<"2fa" | "audit" | "permissions">(
    "2fa"
  );

  // Função para obter o ícone ativo com base na aba selecionada
  const getActiveIcon = () => {
    switch (activeTab) {
      case "2fa":
        return <Shield className="h-4 w-4" />;
      case "audit":
        return <FileText className="h-4 w-4" />;
      case "permissions":
        return <Key className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  // Renderiza o conteúdo com base na seleção ativa
  const renderContent = () => {
    switch (activeTab) {
      case "2fa":
        return <TwoFactorSection />;
      case "audit":
        return <AuditLogSection />;
      case "permissions":
        return <PermissionsSection />;
      default:
        return <TwoFactorSection />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Segurança Empresarial</h2>
          <div className="ml-2">
            <BreadcrumbSelect
              items={[
                {
                  icon: getActiveIcon(),
                  isSelect: true,
                  label: "Visualização",
                  selectProps: {
                    defaultValue: activeTab,
                    options: [
                      { value: "2fa", label: "Autenticação em 2 Fatores" },
                      { value: "audit", label: "Logs de Auditoria" },
                      { value: "permissions", label: "Permissões" },
                    ],
                    onChange: (value) => {
                      setActiveTab(value as "2fa" | "audit" | "permissions");
                    },
                  },
                },
              ]}
            />
          </div>
        </div>
        <p className="text-muted-foreground">
          Configure métodos de autenticação, políticas de segurança e controle
          de acesso
        </p>
      </div>

      <div className="flex justify-end gap-2 md:hidden">
        <Button
          variant={activeTab === "2fa" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("2fa")}
        >
          <Shield className="h-4 w-4 mr-2" />
          Autenticação em 2 Fatores
        </Button>
        <Button
          variant={activeTab === "audit" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("audit")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Logs de Auditoria
        </Button>
        <Button
          variant={activeTab === "permissions" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("permissions")}
        >
          <Key className="h-4 w-4 mr-2" />
          Permissões
        </Button>
      </div>

      <div className="space-y-4">{renderContent()}</div>
    </div>
  );
}

// Seção de Autenticação em 2 Fatores
function TwoFactorSection() {
  const [globalSettings, setGlobalSettings] = useState({
    twoFactorEnabled: true,
    requiredForAll: false,
    requiredForAdmin: true,
    rememberDevice: true,
    rememberPeriod: 30, // dias
  });

  const [methods, setMethods] = useState([
    {
      id: "authenticator",
      name: "Aplicativo Autenticador",
      description: "Google Authenticator, Microsoft Authenticator, Authy",
      enabled: true,
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      id: "sms",
      name: "SMS",
      description: "Código enviado por mensagem de texto",
      enabled: true,
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      id: "email",
      name: "Email",
      description: "Código enviado para email secundário",
      enabled: false,
      icon: <FileText className="h-5 w-5" />,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Autenticação em Dois Fatores (2FA)
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure camadas adicionais de segurança para o login
          </p>
        </div>
        <Switch id="2fa-master" checked={globalSettings.twoFactorEnabled} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="required-all" className="font-medium">
                  Requerer 2FA para todos os usuários
                </Label>
                <p className="text-sm text-muted-foreground">
                  Todos os usuários serão forçados a configurar 2FA
                </p>
              </div>
              <Switch
                id="required-all"
                checked={globalSettings.requiredForAll}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="required-admin" className="font-medium">
                  Requerer 2FA para administradores
                </Label>
                <p className="text-sm text-muted-foreground">
                  Usuários com permissões administrativas precisarão usar 2FA
                </p>
              </div>
              <Switch
                id="required-admin"
                checked={globalSettings.requiredForAdmin}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="remember-device" className="font-medium">
                  Lembrar dispositivos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Não pedir 2FA novamente em dispositivos confiáveis
                </p>
              </div>
              <Switch
                id="remember-device"
                checked={globalSettings.rememberDevice}
              />
            </div>

            {globalSettings.rememberDevice && (
              <div className="ml-6 pt-2">
                <Label htmlFor="remember-period">
                  Período para lembrar dispositivos
                </Label>
                <Select defaultValue={globalSettings.rememberPeriod.toString()}>
                  <SelectTrigger
                    id="remember-period"
                    className="w-full max-w-[180px] mt-1"
                  >
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métodos de Autenticação</CardTitle>
          <CardDescription>
            Configure quais métodos de 2FA estarão disponíveis para os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
                <Switch checked={method.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button>Salvar Configurações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Seção de Logs de Auditoria
function AuditLogSection() {
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "log_1",
      timestamp: "2023-07-20T14:23:45Z",
      user: "admin@empresa.com.br",
      action: "user.permission.update",
      details: "Alterou permissões do usuário maria@empresa.com.br",
      ip: "200.178.45.10",
      userAgent: "Chrome/115.0.0.0 Windows NT 10.0",
    },
    {
      id: "log_2",
      timestamp: "2023-07-20T12:15:23Z",
      user: "admin@empresa.com.br",
      action: "webhook.create",
      details: "Criou novo webhook: Notificações de Pedido",
      ip: "200.178.45.10",
      userAgent: "Chrome/115.0.0.0 Windows NT 10.0",
    },
    {
      id: "log_3",
      timestamp: "2023-07-20T10:45:12Z",
      user: "pedro@empresa.com.br",
      action: "user.login",
      details: "Login bem-sucedido",
      ip: "189.54.220.35",
      userAgent: "Safari/605.1.15 macOS 10.15.7",
    },
    {
      id: "log_4",
      timestamp: "2023-07-20T09:12:05Z",
      user: "maria@empresa.com.br",
      action: "dashboard.share",
      details: "Compartilhou dashboard 'Vendas Mensais' com time de marketing",
      ip: "186.220.199.42",
      userAgent: "Chrome/115.0.0.0 macOS 13.4.1",
    },
    {
      id: "log_5",
      timestamp: "2023-07-19T18:05:33Z",
      user: "joão@empresa.com.br",
      action: "user.login.failed",
      details: "Tentativa de login falhou - senha incorreta",
      ip: "201.82.45.123",
      userAgent: "Firefox/115.0 Windows NT 10.0",
    },
    {
      id: "log_6",
      timestamp: "2023-07-19T16:42:19Z",
      user: "admin@empresa.com.br",
      action: "settings.update",
      details: "Atualizou configurações de segurança - Ativou 2FA obrigatório",
      ip: "200.178.45.10",
      userAgent: "Chrome/115.0.0.0 Windows NT 10.0",
    },
    {
      id: "log_7",
      timestamp: "2023-07-19T15:20:11Z",
      user: "joão@empresa.com.br",
      action: "report.export",
      details: "Exportou relatório 'Análise de Usuários Q2 2023'",
      ip: "201.82.45.123",
      userAgent: "Firefox/115.0 Windows NT 10.0",
    },
  ]);

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <LogIn className="h-4 w-4" />;
    if (action.includes("user")) return <User className="h-4 w-4" />;
    if (action.includes("webhook")) return <Settings2 className="h-4 w-4" />;
    if (action.includes("dashboard")) return <BarChart className="h-4 w-4" />;
    if (action.includes("settings")) return <Settings2 className="h-4 w-4" />;
    if (action.includes("report")) return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes("failed")) return "text-red-500";
    if (action.includes("login")) return "text-green-500";
    if (action.includes("create")) return "text-blue-500";
    if (action.includes("update")) return "text-amber-500";
    if (action.includes("delete")) return "text-red-500";
    return "text-slate-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Logs de Auditoria</h3>
          <p className="text-sm text-muted-foreground">
            Visualize o histórico de ações e eventos de segurança
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Atividade Recente</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar logs" className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead className="w-full">Detalhes</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1.5 ${getActionColor(
                          log.action
                        )}`}
                      >
                        {getActionIcon(log.action)}
                        <span className="text-xs font-medium">
                          {log.action.split(".").pop()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.details}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {log.ip}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Mostrando os últimos 7 dias de atividade
          </div>
          <Button variant="outline" size="sm">
            Carregar Mais
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="audit-enabled" className="font-medium">
                  Ativar Logs de Auditoria
                </Label>
                <p className="text-sm text-muted-foreground">
                  Registrar todas as ações dos usuários no sistema
                </p>
              </div>
              <Switch id="audit-enabled" checked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="retention-period" className="font-medium">
                  Período de Retenção
                </Label>
                <p className="text-sm text-muted-foreground">
                  Por quanto tempo os logs são mantidos
                </p>
              </div>
              <Select defaultValue="90">
                <SelectTrigger id="retention-period" className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="180">180 dias</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="export-enabled" className="font-medium">
                  Exportação Automática
                </Label>
                <p className="text-sm text-muted-foreground">
                  Exportar logs automaticamente para armazenamento externo
                </p>
              </div>
              <Switch id="export-enabled" checked={false} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Seção de Níveis de Permissão
function PermissionsSection() {
  const [roles, setRoles] = useState([
    {
      id: "admin",
      name: "Administrador",
      description: "Acesso completo a todas as funcionalidades",
      users: 2,
      permissions: ["all"],
    },
    {
      id: "manager",
      name: "Gerente",
      description: "Pode gerenciar usuários e visualizar todos os dados",
      users: 5,
      permissions: [
        "users.view",
        "users.create",
        "users.edit",
        "webhooks.view",
        "webhooks.create",
        "webhooks.edit",
        "data.view",
        "reports.view",
        "reports.create",
        "reports.share",
      ],
    },
    {
      id: "analyst",
      name: "Analista",
      description: "Pode criar relatórios e analisar dados",
      users: 12,
      permissions: [
        "data.view",
        "reports.view",
        "reports.create",
        "reports.edit",
      ],
    },
    {
      id: "viewer",
      name: "Visualizador",
      description: "Apenas visualização de dashboards e relatórios",
      users: 28,
      permissions: ["data.view", "reports.view"],
    },
  ]);

  const [selectedRole, setSelectedRole] = useState(roles[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Níveis de Permissão</h3>
          <p className="text-sm text-muted-foreground">
            Configure papéis e permissões para controle de acesso granular
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Papel
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-5 lg:col-span-4">
          <CardHeader>
            <CardTitle>Papéis</CardTitle>
            <CardDescription>
              Selecione um papel para editar suas permissões
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`flex items-center justify-between p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedRole.id === role.id ? "bg-slate-50" : ""
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div>
                    <h4 className="font-medium">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  <Badge variant="outline">{role.users} usuários</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-7 lg:col-span-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Permissões: {selectedRole.name}</CardTitle>
                <CardDescription>{selectedRole.description}</CardDescription>
              </div>
              {selectedRole.id !== "admin" && (
                <Button variant="outline" size="sm">
                  Editar Papel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedRole.id === "admin" ? (
              <div className="text-center p-4">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="text-base font-medium mb-1">
                  Acesso Administrativo Total
                </h4>
                <p className="text-sm text-muted-foreground">
                  Administradores têm acesso irrestrito a todas as
                  funcionalidades do sistema
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Gerenciamento de Usuários
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="user-view"
                        checked={selectedRole.permissions.includes(
                          "users.view"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="user-view">Visualizar usuários</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="user-create"
                        checked={selectedRole.permissions.includes(
                          "users.create"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="user-create">Criar usuários</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="user-edit"
                        checked={selectedRole.permissions.includes(
                          "users.edit"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="user-edit">Editar usuários</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="user-delete"
                        checked={selectedRole.permissions.includes(
                          "users.delete"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="user-delete">Excluir usuários</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Webhooks e Integrações
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="webhook-view"
                        checked={selectedRole.permissions.includes(
                          "webhooks.view"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="webhook-view">Visualizar webhooks</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="webhook-create"
                        checked={selectedRole.permissions.includes(
                          "webhooks.create"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="webhook-create">Criar webhooks</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="webhook-edit"
                        checked={selectedRole.permissions.includes(
                          "webhooks.edit"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="webhook-edit">Editar webhooks</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="webhook-delete"
                        checked={selectedRole.permissions.includes(
                          "webhooks.delete"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="webhook-delete">Excluir webhooks</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Dados e Análises</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="data-view"
                        checked={selectedRole.permissions.includes("data.view")}
                        className="mr-2"
                      />
                      <Label htmlFor="data-view">Visualizar dados</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="data-export"
                        checked={selectedRole.permissions.includes(
                          "data.export"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="data-export">Exportar dados</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="reports-create"
                        checked={selectedRole.permissions.includes(
                          "reports.create"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="reports-create">Criar relatórios</Label>
                    </div>
                    <div className="flex items-center p-2 rounded border">
                      <Switch
                        id="reports-share"
                        checked={selectedRole.permissions.includes(
                          "reports.share"
                        )}
                        className="mr-2"
                      />
                      <Label htmlFor="reports-share">
                        Compartilhar relatórios
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
