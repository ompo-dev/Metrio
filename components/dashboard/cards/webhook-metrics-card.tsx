"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, Clock, AlertTriangle, Search, ArrowUpDown } from "lucide-react"

// Interface para tipagem dos dados de webhook
interface WebhookData {
  id: string
  name: string
  endpoint: string
  status: "success" | "warning" | "error" | string
  successRate: number
  failureCount: number
  avgResponseTime: number
  lastTriggered: string
}

export function WebhookMetricsCard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof WebhookData>("lastTriggered")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Dados fictícios para métricas de webhooks
  const webhooksData: WebhookData[] = [
    { 
      id: "wh_123456",
      name: "Novo Cadastro",
      endpoint: "https://api.example.com/webhook/signup",
      status: "success",
      successRate: 98.5,
      failureCount: 4,
      avgResponseTime: 237,
      lastTriggered: "2023-06-10T15:32:14Z"
    },
    { 
      id: "wh_234567",
      name: "Pagamento Aprovado",
      endpoint: "https://api.example.com/webhook/payment",
      status: "success",
      successRate: 99.8,
      failureCount: 1,
      avgResponseTime: 145,
      lastTriggered: "2023-06-10T18:45:23Z"
    },
    { 
      id: "wh_345678",
      name: "Atualização de Perfil",
      endpoint: "https://api.example.com/webhook/profile",
      status: "warning",
      successRate: 92.3,
      failureCount: 12,
      avgResponseTime: 563,
      lastTriggered: "2023-06-09T09:12:45Z"
    },
    { 
      id: "wh_456789",
      name: "Login Realizado",
      endpoint: "https://api.example.com/webhook/login",
      status: "error",
      successRate: 76.2,
      failureCount: 43,
      avgResponseTime: 1243,
      lastTriggered: "2023-06-10T14:28:57Z"
    },
    { 
      id: "wh_567890",
      name: "Logout Realizado",
      endpoint: "https://api.example.com/webhook/logout",
      status: "success",
      successRate: 99.1,
      failureCount: 2,
      avgResponseTime: 128,
      lastTriggered: "2023-06-10T20:15:02Z"
    },
  ]

  // Função para ordenar os dados
  const sortData = (data: WebhookData[], field: keyof WebhookData, direction: "asc" | "desc") => {
    return [...data].sort((a, b) => {
      // Para datas (formato string de data ISO)
      if (field === "lastTriggered") {
        const dateA = new Date(a[field] as string).getTime();
        const dateB = new Date(b[field] as string).getTime();
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      // Para números
      if (typeof a[field] === "number" && typeof b[field] === "number") {
        return direction === "asc" 
          ? (a[field] as number) - (b[field] as number) 
          : (b[field] as number) - (a[field] as number);
      }
      
      // Para strings
      const valueA = String(a[field]).toLowerCase();
      const valueB = String(b[field]).toLowerCase();
      
      if (direction === "asc") {
        return valueA.localeCompare(valueB);
      }
      return valueB.localeCompare(valueA);
    });
  }

  // Função para alterar a ordenação
  const handleSort = (field: keyof WebhookData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filtrar e ordenar os dados
  const filteredData = webhooksData
    .filter(webhook => 
      webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
    )
  
  const sortedData = sortData(filteredData, sortField, sortDirection)

  // Renderização dos ícones de status
  const renderStatus = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Check className="h-3 w-3 mr-1" /> Ativo</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" /> Lento</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="h-3 w-3 mr-1" /> Problema</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR")
  }

  return (
    <Card className="h-full border border-none shadow-none">
      <CardHeader className="pb-2 pt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <CardTitle>Métricas de Webhooks</CardTitle>
          <div className="flex items-center mt-2 sm:mt-0">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              className="h-8 w-[200px]" 
              placeholder="Buscar webhook..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[180px] cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Nome
                    {sortField === "name" && (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("successRate")}
                >
                  <div className="flex items-center">
                    Taxa de Sucesso
                    {sortField === "successRate" && (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("avgResponseTime")}
                >
                  <div className="flex items-center">
                    Tempo de Resposta
                    {sortField === "avgResponseTime" && (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("lastTriggered")}
                >
                  <div className="flex items-center">
                    Última Execução
                    {sortField === "lastTriggered" && (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">
                    <div>{webhook.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]">{webhook.endpoint}</div>
                  </TableCell>
                  <TableCell>
                    {renderStatus(webhook.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="h-2 rounded-full w-12 bg-gray-200 mr-2 overflow-hidden"
                      >
                        <div 
                          className={`h-full rounded-full ${
                            webhook.successRate > 95 
                              ? 'bg-green-500' 
                              : webhook.successRate > 85 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${webhook.successRate}%` }}
                        />
                      </div>
                      <span>{webhook.successRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`
                      ${webhook.avgResponseTime < 200 
                        ? 'text-green-600' 
                        : webhook.avgResponseTime < 500 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }
                    `}>
                      {webhook.avgResponseTime}ms
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDate(webhook.lastTriggered)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 