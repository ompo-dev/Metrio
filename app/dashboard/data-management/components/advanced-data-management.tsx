"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileDown,
  Database,
  HardDrive,
  Clock,
  Filter,
  Download,
  ArrowUpDown,
  RefreshCw,
  Info,
  BarChart,
  Table,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";
import SelectIcon from "@/components/select-icon";

export function AdvancedDataManagement() {
  const [activeTab, setActiveTab] = useState("etl");

  // Função para obter o ícone ativo com base na aba selecionada
  const getActiveIcon = () => {
    switch (activeTab) {
      case "etl":
        return <ArrowUpDown className="h-4 w-4" />;
      case "storage":
        return <Database className="h-4 w-4" />;
      case "retention":
        return <Clock className="h-4 w-4" />;
      case "export":
        return <FileDown className="h-4 w-4" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  // Renderiza o conteúdo baseado na tab ativa
  const renderContent = () => {
    switch (activeTab) {
      case "etl":
        return <ETLConfigSection />;
      case "storage":
        return <DataStorageSection />;
      case "retention":
        return <RetentionPoliciesSection />;
      case "export":
        return <DataExportSection />;
      default:
        return <ETLConfigSection />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Gestão Avançada de Dados</h2>
          <div className="ml-2">
            <SelectIcon
              defaultValue={activeTab}
              options={[
                {
                  value: "etl",
                  label: "Transformação de Dados",
                  icon: <ArrowUpDown className="h-4 w-4" />,
                },
                {
                  value: "storage",
                  label: "Armazenamento",
                  icon: <Database className="h-4 w-4" />,
                },
                {
                  value: "retention",
                  label: "Políticas de Retenção",
                  icon: <Clock className="h-4 w-4" />,
                },
                {
                  value: "export",
                  label: "Exportação",
                  icon: <FileDown className="h-4 w-4" />,
                },
              ]}
              onChange={(value) => {
                setActiveTab(value);
              }}
            />
          </div>
        </div>
        <p className="text-muted-foreground">
          Configure transformações, armazenamento e exportação dos seus dados
        </p>
      </div>

      <div className="flex justify-end gap-2 md:hidden">
        <Button
          variant={activeTab === "etl" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("etl")}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Transformação
        </Button>
        <Button
          variant={activeTab === "storage" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("storage")}
        >
          <Database className="h-4 w-4 mr-2" />
          Armazenamento
        </Button>
        <Button
          variant={activeTab === "retention" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("retention")}
        >
          <Clock className="h-4 w-4 mr-2" />
          Retenção
        </Button>
        <Button
          variant={activeTab === "export" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("export")}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Exportação
        </Button>
      </div>

      {renderContent()}
    </div>
  );
}

// Seção de configuração ETL
function ETLConfigSection() {
  const [dataTransforms, setDataTransforms] = useState([
    {
      id: "transform_1",
      name: "Formatação de Nomes",
      description: "Padroniza nomes de usuários (primeira letra maiúscula)",
      enabled: true,
      source: "user_data",
      target: "user_data.name",
      transformType: "normalize",
      fields: ["first_name", "last_name"],
      script:
        "function normalize(name) {\n  return name.trim().charAt(0).toUpperCase() + name.slice(1).toLowerCase();\n}",
    },
    {
      id: "transform_2",
      name: "Cálculo de LTV",
      description: "Calcula valor vitalício do cliente com base nas compras",
      enabled: true,
      source: "orders",
      target: "metrics.customer_ltv",
      transformType: "aggregate",
      script:
        "function calculateLTV(orders) {\n  return orders.reduce((sum, order) => sum + order.total, 0);\n}",
    },
    {
      id: "transform_3",
      name: "Enriquecimento de Localização",
      description: "Adiciona dados geográficos com base no CEP",
      enabled: false,
      source: "user_addresses",
      target: "user_addresses",
      transformType: "enrich",
      dependencies: ["external_api:geolocation"],
      script:
        "async function enrichLocation(address) {\n  const geoData = await fetchGeoData(address.postal_code);\n  return { ...address, ...geoData };\n}",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Transformação de Dados (ETL)</h3>
          <p className="text-sm text-muted-foreground">
            Configure transformações para limpar e padronizar seus dados antes
            da visualização
          </p>
        </div>
        <Button>
          <Filter className="h-4 w-4 mr-2" />
          Nova Transformação
        </Button>
      </div>

      <div className="grid gap-4">
        {dataTransforms.map((transform) => (
          <Card key={transform.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-base">
                    {transform.name}
                    <Badge
                      variant={transform.enabled ? "default" : "outline"}
                      className="ml-2"
                    >
                      {transform.enabled ? "Ativo" : "Inativo"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{transform.description}</CardDescription>
                </div>
                <Switch checked={transform.enabled} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Fonte de Dados
                  </Label>
                  <div className="flex items-center mt-1">
                    <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{transform.source}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Destino
                  </Label>
                  <div className="flex items-center mt-1">
                    <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{transform.target}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">
                    Script de Transformação
                  </Label>
                  <pre className="mt-1 text-xs bg-muted p-2 rounded-md overflow-x-auto">
                    {transform.script}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">
                  Testar
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Seção de Armazenamento
function DataStorageSection() {
  const [storageUsage, setStorageUsage] = useState({
    total: 500, // GB
    used: 328, // GB
    tables: [
      { name: "events", size: 150, rows: 28500000 },
      { name: "users", size: 45, rows: 1250000 },
      { name: "orders", size: 80, rows: 4200000 },
      { name: "products", size: 30, rows: 120000 },
      { name: "page_views", size: 23, rows: 48000000 },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Configurações de Armazenamento
          </h3>
          <p className="text-sm text-muted-foreground">
            Gerencie como seus dados são armazenados e otimizados
          </p>
        </div>
        <Button variant="outline">
          <HardDrive className="h-4 w-4 mr-2" />
          Adicionar Armazenamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uso do Armazenamento</CardTitle>
          <CardDescription>
            {storageUsage.used} GB de {storageUsage.total} GB utilizados (
            {Math.round((storageUsage.used / storageUsage.total) * 100)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(storageUsage.used / storageUsage.total) * 100}
            className="h-2"
          />

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">
              Distribuição por Tabela
            </h4>
            <div className="space-y-1">
              {storageUsage.tables.map((table) => (
                <div
                  key={table.name}
                  className="grid grid-cols-12 items-center gap-2 text-sm"
                >
                  <div className="col-span-3 font-medium">{table.name}</div>
                  <div className="col-span-5">
                    <Progress
                      value={(table.size / storageUsage.used) * 100}
                      className={`h-2 ${
                        table.name === "events"
                          ? "bg-blue-500"
                          : table.name === "users"
                          ? "bg-green-500"
                          : table.name === "orders"
                          ? "bg-purple-500"
                          : table.name === "products"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                  </div>
                  <div className="col-span-2 text-right">{table.size} GB</div>
                  <div className="col-span-2 text-right text-muted-foreground">
                    {(table.rows / 1000000).toFixed(1)}M linhas
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Otimizações</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="compressão">Compressão de Dados</Label>
                  </div>
                  <Switch id="compressão" checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="particionamento">
                      Particionamento por Data
                    </Label>
                  </div>
                  <Switch id="particionamento" checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="indexação">Indexação Automática</Label>
                  </div>
                  <Switch id="indexação" checked={false} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Data Warehouse</h4>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Cluster Standard</span>
                    </div>
                    <Badge>Ativo</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Região:</span>
                      <span>South America (São Paulo)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>Otimizado para Leitura</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Versão:</span>
                      <span>v4.2.1</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    Gerenciar Data Warehouse
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Seção de Políticas de Retenção
function RetentionPoliciesSection() {
  const [retentionPolicies, setRetentionPolicies] = useState([
    {
      id: "policy_1",
      dataType: "Eventos de Página",
      description: "Dados de visualização e interação com páginas",
      retention: 90, // dias
      enabled: true,
      archiveEnabled: false,
    },
    {
      id: "policy_2",
      dataType: "Transações",
      description: "Compras e movimentações financeiras",
      retention: 730, // 2 anos
      enabled: true,
      archiveEnabled: true,
      archiveAfter: 365, // 1 ano
    },
    {
      id: "policy_3",
      dataType: "Dados de Usuário",
      description: "Informações pessoais e perfis",
      retention: 1825, // 5 anos
      enabled: true,
      archiveEnabled: false,
    },
    {
      id: "policy_4",
      dataType: "Logs de Acesso",
      description: "Registros de login e atividade",
      retention: 180,
      enabled: true,
      archiveEnabled: true,
      archiveAfter: 30,
    },
    {
      id: "policy_5",
      dataType: "Dados de Marketing",
      description: "Campanhas e analytics de marketing",
      retention: 365,
      enabled: true,
      archiveEnabled: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Políticas de Retenção</h3>
          <p className="text-sm text-muted-foreground">
            Configure por quanto tempo diferentes tipos de dados são mantidos
          </p>
        </div>
        <Button>
          <Clock className="h-4 w-4 mr-2" />
          Nova Política
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Retenção por Tipo de Dado</CardTitle>
          <CardDescription>
            Defina períodos de retenção e regras de arquivamento para diferentes
            categorias de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {retentionPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="p-4 border rounded-lg transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{policy.dataType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                    </div>
                    <Switch checked={policy.enabled} />
                  </div>

                  <div className="grid gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Período de Retenção
                        </Label>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {policy.retention} dias
                            {policy.retention >= 365 &&
                              ` (${Math.round(policy.retention / 365)} ${
                                Math.round(policy.retention / 365) === 1
                                  ? "ano"
                                  : "anos"
                              })`}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Arquivamento
                        </Label>
                        <div className="flex items-center mt-1">
                          {policy.archiveEnabled ? (
                            <>
                              <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Após {policy.archiveAfter} dias</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              Não configurado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {policy.enabled && (
                        <Button variant="outline" size="sm">
                          Executar Agora
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Agendamento de Limpeza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cleanup-frequency">Frequência</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="cleanup-frequency">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diária</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cleanup-time">Horário</Label>
              <Select defaultValue="01:00">
                <SelectTrigger id="cleanup-time">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="00:00">00:00</SelectItem>
                  <SelectItem value="01:00">01:00</SelectItem>
                  <SelectItem value="02:00">02:00</SelectItem>
                  <SelectItem value="03:00">03:00</SelectItem>
                  <SelectItem value="04:00">04:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                  <SelectItem value="23:00">23:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">Salvar Configurações</Button>
            </div>
          </div>

          <div className="flex items-center p-2 bg-muted rounded-md mt-4">
            <Info className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              A próxima limpeza agendada ocorrerá em 21/07/2023 às 01:00
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Seção de Exportação de Dados
function DataExportSection() {
  const [exportHistory, setExportHistory] = useState([
    {
      id: "export_1",
      name: "Relatório Mensal - Junho 2023",
      date: "2023-07-01T10:30:00Z",
      status: "completed",
      format: "excel",
      size: "5.2 MB",
      rows: 125000,
    },
    {
      id: "export_2",
      name: "Dados de Usuários Ativos",
      date: "2023-06-25T14:15:00Z",
      status: "completed",
      format: "csv",
      size: "2.8 MB",
      rows: 45000,
    },
    {
      id: "export_3",
      name: "Transações Q2 2023",
      date: "2023-06-20T08:45:00Z",
      status: "completed",
      format: "json",
      size: "8.7 MB",
      rows: 210000,
    },
    {
      id: "export_4",
      name: "Integração BigQuery - Dataset Completo",
      date: "2023-06-15T23:00:00Z",
      status: "completed",
      format: "bigquery",
      size: "52 GB",
      rows: 8500000,
    },
    {
      id: "export_5",
      name: "Exportação Semanal - KPIs",
      date: "2023-07-03T06:00:00Z",
      status: "in_progress",
      format: "excel",
      size: "pendente",
      rows: "estimado 15000",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Exportação de Dados</h3>
          <p className="text-sm text-muted-foreground">
            Exporte seus dados em diferentes formatos ou integre com plataformas
            externas
          </p>
        </div>
        <Button>
          <FileDown className="h-4 w-4 mr-2" />
          Nova Exportação
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exportação Manual</CardTitle>
            <CardDescription>
              Exporte dados específicos em formatos comuns para análise local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="export-dataset">Conjunto de Dados</Label>
                <Select defaultValue="all_events">
                  <SelectTrigger id="export-dataset">
                    <SelectValue placeholder="Selecione o conjunto de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_events">Todos os Eventos</SelectItem>
                    <SelectItem value="users">Dados de Usuários</SelectItem>
                    <SelectItem value="transactions">Transações</SelectItem>
                    <SelectItem value="page_views">
                      Visualizações de Página
                    </SelectItem>
                    <SelectItem value="custom_metrics">
                      Métricas Personalizadas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="export-timeframe">Período</Label>
                <Select defaultValue="last_30_days">
                  <SelectTrigger id="export-timeframe">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                    <SelectItem value="last_30_days">
                      Últimos 30 dias
                    </SelectItem>
                    <SelectItem value="this_month">Este mês</SelectItem>
                    <SelectItem value="last_month">Mês passado</SelectItem>
                    <SelectItem value="custom">
                      Período personalizado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="export-format">Formato de Exportação</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Button variant="outline" className="flex-col h-20 space-y-1">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <span className="text-xs">Excel</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-20 space-y-1">
                    <Table className="h-8 w-8 text-blue-600" />
                    <span className="text-xs">CSV</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-20 space-y-1">
                    <FileJson className="h-8 w-8 text-amber-600" />
                    <span className="text-xs">JSON</span>
                  </Button>
                </div>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrações com Data Warehouses</CardTitle>
            <CardDescription>
              Sincronize seus dados com plataformas de análise avançada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-100 mr-3">
                    <span className="text-blue-800 font-bold">BQ</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Google BigQuery</h4>
                    <p className="text-xs text-muted-foreground">
                      Sincronização diária ativa
                    </p>
                  </div>
                </div>
                <Switch checked={true} />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-red-100 mr-3">
                    <span className="text-red-800 font-bold">RS</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Amazon Redshift</h4>
                    <p className="text-xs text-muted-foreground">
                      Não configurado
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-100 mr-3">
                    <span className="text-blue-800 font-bold">SF</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Snowflake</h4>
                    <p className="text-xs text-muted-foreground">
                      Não configurado
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Agendamento de Sincronização</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Salvar Configurações</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Exportações</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {exportHistory.map((export_) => (
                <div
                  key={export_.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center">
                    {export_.format === "excel" && (
                      <FileSpreadsheet className="h-5 w-5 mr-3 text-green-600" />
                    )}
                    {export_.format === "csv" && (
                      <Table className="h-5 w-5 mr-3 text-blue-600" />
                    )}
                    {export_.format === "json" && (
                      <FileJson className="h-5 w-5 mr-3 text-amber-600" />
                    )}
                    {export_.format === "bigquery" && (
                      <Database className="h-5 w-5 mr-3 text-blue-700" />
                    )}

                    <div>
                      <h4 className="font-medium">{export_.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(export_.date).toLocaleString()} •{" "}
                        {export_.size} • {export_.rows} registros
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {export_.status === "completed" ? (
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Badge>Em progresso</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
