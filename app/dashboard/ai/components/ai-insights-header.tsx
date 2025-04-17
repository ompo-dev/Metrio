"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import {
  BarChart,
  RefreshCw,
  Download,
  Filter,
  Share2,
  Settings,
  PieChart,
  LineChart,
  Sliders,
  Bell,
  BellOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BreadcrumbSelect } from "@/components/breadcrumb-select/breadcrumb-select";
import { AiInsightsDashboard } from "@/app/dashboard/ai/components/ai-insights-dashboard";
import { AIFeatures } from "@/app/dashboard/ai/components/ai-features";
import { AIAssistant } from "@/app/dashboard/ai/components/ai-assistant";

export function AiInsightsHeader() {
  const [refreshingData, setRefreshingData] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [viewType, setViewType] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleRefresh = () => {
    setRefreshingData(true);
    // Simulando uma atualização de dados
    setTimeout(() => {
      setRefreshingData(false);
    }, 1500);
  };

  // Função para obter o ícone ativo com base na aba selecionada
  const getActiveIcon = () => {
    switch (activeTab) {
      case "dashboard":
        return <BarChart className="h-4 w-4" />;
      case "ai-features":
        return <Settings className="h-4 w-4" />;
      default:
        return <BarChart className="h-4 w-4" />;
    }
  };

  // Renderiza o conteúdo com base na aba selecionada
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AiInsightsDashboard />;
      case "ai-features":
        return <AIFeatures />;
      default:
        return <AiInsightsDashboard />;
    }
  };

  return (
    <div className="flex flex-col space-y-6 relative">
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                IA & Insights
              </h2>
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
                          { value: "dashboard", label: "Dashboard" },
                          { value: "ai-features", label: "Recursos de IA" },
                        ],
                        onChange: (value) => {
                          setActiveTab(value);
                        },
                      },
                    },
                  ]}
                />
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 h-7">
                Powered by AI
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Última atualização: hoje às 12:45
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Análises avançadas e insights gerados por inteligência artificial
              com base nos seus dados.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
            <CalendarDateRangePicker />

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrar dados</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filtros de Dados</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LineChart className="mr-2 h-4 w-4" />
                  Tendências
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PieChart className="mr-2 h-4 w-4" />
                  Distribuições
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart className="mr-2 h-4 w-4" />
                  Comparações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-anomalies"
                      checked={true}
                      onCheckedChange={() => {}}
                    />
                    <Label htmlFor="show-anomalies">Mostrar anomalias</Label>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar dados</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Exportar Dados</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
                <DropdownMenuItem>Exportar como Excel</DropdownMenuItem>
                <DropdownMenuItem>Exportar como CSV</DropdownMenuItem>
                <DropdownMenuItem>Exportar gráficos (PNG)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compartilhar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Compartilhar Insights</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Compartilhar por e-mail</DropdownMenuItem>
                <DropdownMenuItem>Gerar link público</DropdownMenuItem>
                <DropdownMenuItem>Agendar relatório</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
                  >
                    {notificationsEnabled ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {notificationsEnabled
                      ? "Desativar notificações"
                      : "Ativar notificações"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configurações</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button disabled={refreshingData} onClick={handleRefresh}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  refreshingData ? "animate-spin" : ""
                }`}
              />
              {refreshingData ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Insights gerados
              </span>
              <span className="text-2xl font-semibold">237</span>
            </div>
            <div className="h-full w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Anomalias detectadas
              </span>
              <span className="text-2xl font-semibold">14</span>
            </div>
            <div className="h-full w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Previsões</span>
              <span className="text-2xl font-semibold">42</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tabs defaultValue={viewType} onValueChange={setViewType}>
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs px-3">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="critical" className="text-xs px-3">
                  Críticos
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="text-xs px-3">
                  Oportunidades
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="ghost" size="sm" className="h-9">
              <Sliders className="h-4 w-4 mr-2" />
              Personalizar visualização
            </Button>
          </div>
        </div>
      </div>

      {/* Renderiza o conteúdo principal */}
      <div className="flex-1">{renderContent()}</div>

      {/* AIAssistant posicionado no canto inferior direito */}
      <div className="fixed bottom-6 right-6 z-50">
        <AIAssistant />
      </div>
    </div>
  );
}
