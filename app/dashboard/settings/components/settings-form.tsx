"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Save,
  Check,
  CreditCard,
  Plus,
  Camera,
  Trash2,
  Bell,
  Calendar,
  Globe,
  ShieldCheck,
  User,
  BuildingIcon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface SettingsFormProps {
  activeTab: "profile" | "notifications" | "billing" | "team";
  setActiveTab: Dispatch<
    SetStateAction<"profile" | "notifications" | "billing" | "team">
  >;
}

export function SettingsForm({ activeTab, setActiveTab }: SettingsFormProps) {
  const [formState, setFormState] = useState({
    firstName: "João",
    lastName: "Silva",
    email: "joao.silva@exemplo.com",
    company: "Acme Inc",
    bio: "",
    notifications: {
      emailAlerts: true,
      emailReports: true,
      emailMarketing: false,
      appAlerts: true,
      appSounds: false,
    },
  });

  const [photoHover, setPhotoHover] = useState(false);
  const [saving, setSaving] = useState({
    profile: false,
    notifications: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormState({
      ...formState,
      notifications: {
        ...formState.notifications,
        [field]: value,
      },
    });
  };

  const handleSave = (section: "profile" | "notifications") => {
    setSaving({
      ...saving,
      [section]: true,
    });

    // Simulação de salvamento
    setTimeout(() => {
      setSaving({
        ...saving,
        [section]: false,
      });
    }, 1000);
  };

  // Renderiza o conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <Card className="overflow-hidden border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Informações do Perfil
                </CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div
                    className="relative"
                    onMouseEnter={() => setPhotoHover(true)}
                    onMouseLeave={() => setPhotoHover(false)}
                  >
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                      <AvatarFallback className="text-xl">JS</AvatarFallback>
                    </Avatar>
                    {photoHover && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center animate-in fade-in zoom-in">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-sm transition-all hover:border-primary/50"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-sm text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover Foto
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Nome</Label>
                    <Input
                      id="first-name"
                      value={formState.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="transition-all focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Sobrenome</Label>
                    <Input
                      id="last-name"
                      value={formState.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="transition-all focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formState.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="transition-all focus:border-primary pr-10"
                      />
                      <ShieldCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este email será usado para notificações e login
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formState.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      className="transition-all focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bio">Biografia</Label>
                      <span className="text-xs text-muted-foreground">
                        Máximo 200 caracteres
                      </span>
                    </div>
                    <Textarea
                      id="bio"
                      placeholder="Conte um pouco sobre você ou sua empresa"
                      rows={4}
                      value={formState.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="resize-none transition-all focus:border-primary"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Última atualização: 20/05/2023
                </div>
                <Button
                  onClick={() => handleSave("profile")}
                  disabled={saving.profile}
                  className={cn(
                    "transition-all duration-200 hover:scale-105",
                    saving.profile && "opacity-80"
                  )}
                >
                  <Save
                    className={cn(
                      "mr-2 h-4 w-4",
                      saving.profile && "animate-spin"
                    )}
                  />
                  {saving.profile ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  Preferências Regionais
                </CardTitle>
                <CardDescription>
                  Defina suas preferências de idioma e região
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <select
                      id="language"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <select
                      id="timezone"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="America/Sao_Paulo">
                        Brasília (GMT-3)
                      </option>
                      <option value="America/New_York">New York (GMT-4)</option>
                      <option value="Europe/London">London (GMT+1)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-destructive/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <LogOut className="h-5 w-5 mr-2" />
                  Ações de Conta
                </CardTitle>
                <CardDescription>
                  Ações que afetam sua conta de forma permanente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                  >
                    Desativar Conta Temporariamente
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                  >
                    Excluir Conta Permanentemente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        );
      case "notifications":
        return (
          <Card className="overflow-hidden border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-base font-medium flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-primary/10 text-primary border-primary/20"
                    >
                      Email
                    </Badge>
                    Notificações por Email
                  </h3>
                </div>

                <div className="space-y-4 pl-2 border-l-2 border-primary/10">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-alerts" className="font-medium">
                        Alertas de Métricas
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas quando métricas importantes mudarem
                      </p>
                    </div>
                    <Switch
                      id="email-alerts"
                      checked={formState.notifications.emailAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailAlerts", checked)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-reports" className="font-medium">
                        Relatórios Semanais
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba um resumo semanal das suas métricas
                      </p>
                    </div>
                    <Switch
                      id="email-reports"
                      checked={formState.notifications.emailReports}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailReports", checked)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing" className="font-medium">
                        Novidades e Atualizações
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba informações sobre novos recursos e atualizações
                      </p>
                    </div>
                    <Switch
                      id="email-marketing"
                      checked={formState.notifications.emailMarketing}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailMarketing", checked)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-base font-medium flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-primary/10 text-primary border-primary/20"
                    >
                      App
                    </Badge>
                    Notificações no Aplicativo
                  </h3>
                </div>

                <div className="space-y-4 pl-2 border-l-2 border-primary/10">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-alerts" className="font-medium">
                        Alertas em Tempo Real
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas no aplicativo em tempo real
                      </p>
                    </div>
                    <Switch
                      id="app-alerts"
                      checked={formState.notifications.appAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("appAlerts", checked)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-sounds" className="font-medium">
                        Sons de Notificação
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Ative sons para notificações importantes
                      </p>
                    </div>
                    <Switch
                      id="app-sounds"
                      checked={formState.notifications.appSounds}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("appSounds", checked)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Bell className="h-4 w-4 mr-2" />
                As configurações de notificação são sincronizadas em todos os
                dispositivos
              </div>
              <Button
                onClick={() => handleSave("notifications")}
                disabled={saving.notifications}
                className={cn(
                  "transition-all duration-200 hover:scale-105",
                  saving.notifications && "opacity-80"
                )}
              >
                <Save
                  className={cn(
                    "mr-2 h-4 w-4",
                    saving.notifications && "animate-spin"
                  )}
                />
                {saving.notifications ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </CardFooter>
          </Card>
        );
      case "billing":
        return (
          <Card className="overflow-hidden border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Informações de Faturamento
              </CardTitle>
              <CardDescription>
                Gerencie seu plano e informações de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Plano Atual: Enterprise</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ 499,00/mês - Renovação em 15/11/2023
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    Ativo
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm group hover:bg-primary/5 p-2 rounded-md transition-all">
                    <span>APIs Ilimitadas</span>
                    <Check className="h-4 w-4 text-primary group-hover:scale-110 transition-all" />
                  </div>
                  <div className="flex items-center justify-between text-sm group hover:bg-primary/5 p-2 rounded-md transition-all">
                    <span>Webhooks Ilimitados</span>
                    <Check className="h-4 w-4 text-primary group-hover:scale-110 transition-all" />
                  </div>
                  <div className="flex items-center justify-between text-sm group hover:bg-primary/5 p-2 rounded-md transition-all">
                    <span>Análise de IA Avançada</span>
                    <Check className="h-4 w-4 text-primary group-hover:scale-110 transition-all" />
                  </div>
                  <div className="flex items-center justify-between text-sm group hover:bg-primary/5 p-2 rounded-md transition-all">
                    <span>Suporte Prioritário</span>
                    <Check className="h-4 w-4 text-primary group-hover:scale-110 transition-all" />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    className="transition-all hover:border-primary/50"
                  >
                    Alterar Plano
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                  >
                    Cancelar Assinatura
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Método de Pagamento</h3>
                <div className="rounded-lg border p-4 bg-card transition-all hover:shadow-sm hover:border-primary/20">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-16 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Visa terminando em 4242
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expira em 12/2025
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all hover:border-primary/50"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all hover:border-primary/50"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 transition-all hover:border-primary/50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Método de Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case "team":
        return (
          <Card className="overflow-hidden border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BuildingIcon className="h-5 w-5 mr-2 text-primary" />
                Gerenciamento de Equipe
              </CardTitle>
              <CardDescription>
                Adicione e gerencie membros da sua equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                <div className="flex items-center space-x-4">
                  <Avatar className="border border-primary/20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-muted-foreground">
                      joao.silva@exemplo.com
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/80 hover:bg-primary">
                  Administrador
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                <div className="flex items-center space-x-4">
                  <Avatar className="border border-primary/20">
                    <AvatarImage src="/placeholder-user-2.jpg" alt="Avatar" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Maria Santos</p>
                    <p className="text-sm text-muted-foreground">
                      maria.santos@exemplo.com
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="transition-all hover:bg-primary/10 hover:text-primary"
                >
                  Membro
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all">
                <div className="flex items-center space-x-4">
                  <Avatar className="border border-primary/20">
                    <AvatarImage src="/placeholder-user-3.jpg" alt="Avatar" />
                    <AvatarFallback>PO</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Pedro Oliveira</p>
                    <p className="text-sm text-muted-foreground">
                      pedro.oliveira@exemplo.com
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="transition-all hover:bg-primary/10 hover:text-primary"
                >
                  Membro
                </Badge>
              </div>
              <div className="pt-4">
                <Button className="transition-all duration-200 hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Membro
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
