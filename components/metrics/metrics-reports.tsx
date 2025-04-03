"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Share2 } from "lucide-react"

export function MetricsReports() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Desempenho</CardTitle>
          <CardDescription>Análise completa de todas as métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">performance_report_oct2023.pdf</p>
              <p className="text-xs text-muted-foreground">Gerado em: 15/10/2023</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button size="sm" variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Conversão</CardTitle>
          <CardDescription>Análise de funil de conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">conversion_report_oct2023.pdf</p>
              <p className="text-xs text-muted-foreground">Gerado em: 14/10/2023</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button size="sm" variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Relatório de API</CardTitle>
          <CardDescription>Análise de uso e desempenho da API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">api_report_oct2023.pdf</p>
              <p className="text-xs text-muted-foreground">Gerado em: 13/10/2023</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button size="sm" variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

