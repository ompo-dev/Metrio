"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  HelpCircle, 
  PlusCircle
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"

export function WebhooksHeader() {
  const [searchTerm, setSearchTerm] = useState("")
  const [totalActiveWebhooks, setTotalActiveWebhooks] = useState(3)
  const [totalWebhooks, setTotalWebhooks] = useState(5)
  
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
            <Badge variant="outline" className="ml-2 px-2 py-1">
              {totalActiveWebhooks} ativos / {totalWebhooks} total
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Configure webhooks para receber notificações em tempo real quando eventos importantes ocorrerem.
          </p>
        </div>
        <div className="flex items-center space-x-2 self-end">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar webhooks..." 
              className="w-[200px] pl-8 md:w-[240px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
                  <p>Filtrar webhooks</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
              <DropdownMenuItem>Todos os webhooks</DropdownMenuItem>
              <DropdownMenuItem>Ativos</DropdownMenuItem>
              <DropdownMenuItem>Inativos</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filtrar por evento</DropdownMenuLabel>
              <DropdownMenuItem>Usuários</DropdownMenuItem>
              <DropdownMenuItem>Pagamentos</DropdownMenuItem>
              <DropdownMenuItem>Produtos</DropdownMenuItem>
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
              <DropdownMenuItem>
                Exportar webhooks para JSON
              </DropdownMenuItem>
              <DropdownMenuItem>
                Exportar logs para CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                Exportar métricas para Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atualizar dados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild>
                  <Link href="/dashboard/webhooks/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Novo Webhook
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Criar uma nova configuração de webhook</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="bg-muted/40 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="px-1.5">Dica</Badge>
          <span>
            Use webhooks para integrar em tempo real com seus sistemas e automatizar processos.
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Importar webhooks
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
            Ver documentação
          </Button>
        </div>
      </div>
    </div>
  )
}

