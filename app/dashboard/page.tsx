"use client";

import { useState, useEffect } from "react";
import { Download, Filter, Share2, Settings, RefreshCw } from "lucide-react";

import {
  ChartDashboard,
  ChartSkeleton,
} from "@/components/data-visualization/chart-dashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ChartData {
  title: string;
  data: Array<Record<string, string | number | boolean>>;
}

export default function Dashboard() {
  // Estado para armazenar os dados carregados
  const [webhookData, setWebhookData] = useState<ChartData | null>(null);
  const [deviceData, setDeviceData] = useState<ChartData | null>(null);
  const [salesData, setSalesData] = useState<ChartData | null>(null);
  const [loginLogsData, setLoginLogsData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeView, setActiveView] = useState("all");
  const [currentDashboard, setCurrentDashboard] = useState("webhooks");

  // Carrega os dados na montagem do componente
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Carrega os dados de webhooks (usando error-logs.json por enquanto)
        const webhooksResponse = await fetch("/data/error-logs.json");
        if (!webhooksResponse.ok) {
          throw new Error(
            `Falha ao carregar dados de webhooks: ${webhooksResponse.status}`
          );
        }
        const webhooksData = await webhooksResponse.json();
        setWebhookData({
          title: "Métricas de Webhooks",
          data: webhooksData.data,
        });

        // Carrega os dados de dispositivos (usando regional-data.json por enquanto)
        const deviceResponse = await fetch("/data/regional-data.json");
        if (!deviceResponse.ok) {
          throw new Error(
            `Falha ao carregar dados de dispositivos: ${deviceResponse.status}`
          );
        }
        const deviceData = await deviceResponse.json();
        setDeviceData({
          title: "Métricas de Dispositivos",
          data: deviceData.data,
        });

        // Carrega os dados de vendas
        const salesResponse = await fetch("/data/sales-data.json");
        if (!salesResponse.ok) {
          throw new Error(
            `Falha ao carregar dados de vendas: ${salesResponse.status}`
          );
        }
        const salesData = await salesResponse.json();
        setSalesData(salesData);

        // Carrega os dados de logs de login
        const loginLogsResponse = await fetch("/data/login-logs.json");
        if (!loginLogsResponse.ok) {
          throw new Error(
            `Falha ao carregar dados de logs de login: ${loginLogsResponse.status}`
          );
        }
        const loginLogsData = await loginLogsResponse.json();
        setLoginLogsData(loginLogsData);

        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulando uma atualização de dados
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard atualizado",
        description: "Os dados foram atualizados com sucesso.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard de Visualização
              </h1>
              <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 h-7">
                Personalizado
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Última atualização:{" "}
                {new Date().toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Dashboard analítico para visualização de dados de webhooks e
              métricas do sistema.
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
                <DropdownMenuLabel>Filtros de Visualização</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Últimas 24 horas</DropdownMenuItem>
                <DropdownMenuItem>Últimos 7 dias</DropdownMenuItem>
                <DropdownMenuItem>Últimos 30 dias</DropdownMenuItem>
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
                    <p>Exportar dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Exportar Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
                <DropdownMenuItem>Exportar como Imagem</DropdownMenuItem>
                <DropdownMenuItem>Exportar Dados (CSV)</DropdownMenuItem>
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
                <DropdownMenuLabel>Compartilhar Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Gerar link compartilhável</DropdownMenuItem>
                <DropdownMenuItem>Enviar por e-mail</DropdownMenuItem>
                <DropdownMenuItem>Agendar relatório</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

            <Button disabled={isLoading} onClick={handleRefresh}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Webhooks</span>
              <span className="text-2xl font-semibold">5</span>
            </div>
            <div className="h-full w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Dispositivos
              </span>
              <span className="text-2xl font-semibold">3</span>
            </div>
            <div className="h-full w-px bg-border"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Taxa de Sucesso
              </span>
              <span className="text-2xl font-semibold">93.2%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tabs defaultValue={activeView} onValueChange={setActiveView}>
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs px-3">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="webhooks" className="text-xs px-3">
                  Webhooks
                </TabsTrigger>
                <TabsTrigger value="device" className="text-xs px-3">
                  Dispositivos
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select
              value={currentDashboard}
              onValueChange={setCurrentDashboard}
            >
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Selecione um dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webhooks">Métricas de Webhooks</SelectItem>
                <SelectItem value="device">Métricas de Dispositivos</SelectItem>
                <SelectItem value="sales">Dados de Vendas</SelectItem>
                <SelectItem value="login">Logs de Login</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="mb-12 space-y-8">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {activeView === "all" || activeView === "webhooks"
              ? webhookData && (
                  <div className="mx-auto max-w-6xl">
                    <ChartDashboard
                      title={webhookData.title}
                      data={webhookData.data}
                    />
                  </div>
                )
              : null}

            {activeView === "all" || activeView === "device"
              ? deviceData && (
                  <div className="mx-auto max-w-6xl">
                    <ChartDashboard
                      title={deviceData.title}
                      data={deviceData.data}
                    />
                  </div>
                )
              : null}

            {currentDashboard === "sales" && salesData && (
              <div className="mx-auto max-w-6xl">
                <ChartDashboard title={salesData.title} data={salesData.data} />
              </div>
            )}

            {currentDashboard === "login" && loginLogsData && (
              <div className="mx-auto max-w-6xl">
                <ChartDashboard
                  title={loginLogsData.title}
                  data={loginLogsData.data}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
