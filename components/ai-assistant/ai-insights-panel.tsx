"use client"
import { AlertTriangle, ArrowRight, Brain, Sparkles, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AIInsightsPanel() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Insights de IA</h2>
          <p className="text-muted-foreground">
            Análises e recomendações geradas automaticamente com base nos seus dados
          </p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Gerar Novos Insights
        </Button>
      </div>

      <Tabs defaultValue="insights" className="space-y-8">
        <TabsList>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Oportunidade de Crescimento</CardTitle>
                <CardDescription>Baseado em análise de padrões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      Usuários que acessam via dispositivos móveis têm 2.5x mais chances de finalizar compras quando
                      recebem notificações push.
                    </p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Oportunidade Alta</Badge>
                    <Button variant="link" className="p-0 h-auto">
                      Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Alerta de Conversão</CardTitle>
                <CardDescription>Queda detectada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      A taxa de conversão de visualizações para compras caiu 8% na última semana. Recomendamos revisar a
                      jornada de compra.
                    </p>
                    <Badge variant="destructive">Atenção Necessária</Badge>
                    <Button variant="link" className="p-0 h-auto">
                      Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Comportamento do Usuário</CardTitle>
                <CardDescription>Padrão identificado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Brain className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm">
                      Usuários tendem a abandonar o carrinho após 3 minutos de inatividade. Recomendamos implementar
                      lembretes automáticos.
                    </p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Insight Valioso</Badge>
                    <Button variant="link" className="p-0 h-auto">
                      Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previsões de Crescimento</CardTitle>
              <CardDescription>Projeções baseadas em análise de tendências históricas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Cadastros</Badge>
                    <span className="text-sm font-medium">+15% projetado</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Confiança: 85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Compras</Badge>
                    <span className="text-sm font-medium">+8% projetado</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Confiança: 72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Receita</Badge>
                    <span className="text-sm font-medium">+12% projetado</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Confiança: 78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Anomalias Detectadas</CardTitle>
                <CardDescription>
                  Padrões incomuns identificados nos seus dados que podem requerer atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                        Queda em Conversões
                      </h4>
                      <Badge variant="destructive">Crítico</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Queda abrupta de 32% nas conversões entre 15/10 e 18/10. Coincide com problemas reportados no
                      gateway de pagamento.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      Investigar <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        Pico de Tráfego Incomum
                      </h4>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        Médio
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aumento de 300% no tráfego em 22/10 às 14h. Origem identificada: campanha de marketing não
                      documentada.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      Investigar <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Análise de Impacto</CardTitle>
                <CardDescription>Estimativa do impacto das anomalias detectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Impacto em Receita</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-destructive h-2.5 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Estimativa de perda de receita: R$ 12.500,00</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Impacto em Usuários</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Aproximadamente 850 usuários afetados</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 mt-4">
                    <h4 className="text-sm font-medium mb-1">Recomendação da IA</h4>
                    <p className="text-xs">
                      Implementar monitoramento em tempo real para o gateway de pagamento e criar um plano de
                      contingência para falhas similares no futuro.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

