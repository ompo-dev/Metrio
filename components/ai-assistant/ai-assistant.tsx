"use client"

import * as React from "react"
import { Bot, Loader2, Send, Sparkles, X, Maximize2, Minimize2, Download, Share2, MessageSquare, Plus, Brain, BrainCircuit, Zap, Clock, BarChart2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Simulação de uma resposta da IA
const simulateAIResponse = (query: string): Promise<string> => {
  // Lista de possíveis respostas baseadas em palavras-chave
  const responses: Record<string, string> = {
    vendas:
      "Analisando seus dados de vendas do último trimestre, observo um aumento de 12% em comparação com o mesmo período do ano passado. Os produtos da categoria 'Eletrônicos' tiveram o melhor desempenho, com crescimento de 23%. Recomendo focar suas campanhas de marketing nesta categoria para o próximo trimestre.",
    usuários:
      "Seus dados mostram que você tem 15.432 usuários ativos mensais, um aumento de 8% em relação ao mês anterior. A taxa de retenção está em 72%, que é 5% acima da média do setor. Os usuários que acessam via dispositivos móveis têm 2.3x mais chances de se tornarem clientes pagantes.",
    conversão:
      "Sua taxa de conversão atual é de 3.2%, ligeiramente abaixo da meta de 3.5%. Analisando o funil de conversão, identifico que há um abandono significativo (42%) na etapa de pagamento. Sugiro revisar esta etapa do processo e considerar implementar opções adicionais de pagamento.",
    tendência:
      "Baseado nos seus dados históricos, projeto um crescimento de 18-22% para o próximo trimestre. Há uma tendência sazonal clara nos meses de outubro a dezembro, com picos de atividade nas primeiras semanas de cada mês.",
    comparar:
      "Comparando os períodos solicitados, observo que houve um aumento de 15% em receita, mas uma diminuição de 3% em novos usuários. O ticket médio aumentou de R$89 para R$105, o que explica o crescimento da receita apesar da queda em novos usuários.",
    problema:
      "Detectei uma anomalia nos seus dados: houve uma queda abrupta de 32% nas conversões entre os dias 15 e 18 do mês passado. Isso coincide com um problema técnico reportado no gateway de pagamento. Recomendo implementar monitoramento em tempo real para detectar problemas similares mais rapidamente.",
  }

  // Resposta padrão se nenhuma palavra-chave for encontrada
  let responseText =
    "Analisando seus dados, posso ver que suas métricas principais estão evoluindo positivamente. Houve um crescimento de 10% em usuários ativos e 15% em receita no último mês. Recomendo focar em melhorar a taxa de conversão, que está ligeiramente abaixo da meta estabelecida."

  // Verifica se alguma palavra-chave está presente na consulta
  Object.keys(responses).forEach((keyword) => {
    if (query.toLowerCase().includes(keyword)) {
      responseText = responses[keyword]
    }
  })

  // Simula um tempo de resposta da IA
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(responseText)
    }, 1500)
  })
}

// Simulação de funções avançadas
const generateReport = async (topic: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Relatório detalhado sobre ${topic} gerado com sucesso. Você pode baixá-lo ou compartilhar diretamente pelo menu de opções.`)
    }, 2000)
  })
}

const analyzeData = async (period: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Análise completa dos dados do período ${period}. Foram encontradas 3 anomalias e 5 oportunidades de crescimento.`)
    }, 2500)
  })
}

// Tipos para as mensagens
type MessageType = "user" | "assistant" | "system" | "report"

interface Message {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  metadata?: {
    source?: string
    confidence?: number
    tags?: string[]
    actions?: string[]
  }
}

// Sugestões de perguntas pré-definidas
const suggestedQuestions = [
  "Como estão minhas vendas comparadas ao mês passado?",
  "Qual é a tendência de crescimento de usuários?",
  "Identifique problemas nos meus dados de conversão",
  "Compare o desempenho entre Q1 e Q2",
  "Quais métricas estão abaixo da meta?",
]

// Templates de análise
const analysisTemplates = [
  {
    id: "market-analysis",
    title: "Análise de Mercado",
    description: "Análise do seu posicionamento no mercado e oportunidades",
    icon: <BarChart2 className="h-4 w-4 text-blue-500" />
  },
  {
    id: "customer-insights",
    title: "Insights de Clientes",
    description: "Comportamento dos clientes e segmentação",
    icon: <Brain className="h-4 w-4 text-purple-500" />
  },
  {
    id: "performance",
    title: "Desempenho",
    description: "Análise de KPIs e métricas de desempenho",
    icon: <Zap className="h-4 w-4 text-amber-500" />
  },
  {
    id: "trend-forecast",
    title: "Previsão de Tendências",
    description: "Projeções e tendências futuras",
    icon: <Clock className="h-4 w-4 text-green-500" />
  }
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("chat")
  const [modelType, setModelType] = React.useState("balanced")
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Olá! Sou seu assistente de análise de dados. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Função para adicionar uma nova mensagem
  const addMessage = async (content: string, type: MessageType, metadata?: Message['metadata']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    }

    setMessages((prev) => [...prev, newMessage])

    // Se for uma mensagem do usuário, gera uma resposta do assistente
    if (type === "user") {
      setIsLoading(true)
      try {
        let response = "";
        
        // Verifica se é uma solicitação de análise especial
        if (content.toLowerCase().includes("gerar relatório") || content.toLowerCase().includes("relatório sobre")) {
          const topic = content.replace(/.*(?:relatório sobre|gerar relatório|relatório de|relatório para)/i, "").trim();
          response = await generateReport(topic || "desempenho geral");
          
          // Adiciona mensagem de sistema
          const systemMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "system",
            content: "Relatório sendo gerado, por favor aguarde...",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, systemMessage]);
          
          // Adiciona um delay para simular processamento
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const assistantMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "report",
            content: response,
            timestamp: new Date(),
            metadata: {
              source: "Relatório Automático",
              confidence: 95,
              tags: ["relatório", "análise completa", "dados processados"],
              actions: ["download", "share", "save"]
            }
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } 
        else if (content.toLowerCase().includes("analisar dados") || content.toLowerCase().includes("análise de período")) {
          const period = content.includes("período") 
            ? content.replace(/.*período (de )?/i, "").trim()
            : "últimos 30 dias";
            
          response = await analyzeData(period);
          
          const assistantMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "assistant",
            content: response,
            timestamp: new Date(),
            metadata: {
              source: "Análise de Dados",
              confidence: 92,
              tags: ["análise", "período", "insights"]
            }
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
        else {
          // Resposta padrão
          response = await simulateAIResponse(content);
          
          const assistantMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "assistant",
            content: response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (error) {
        console.error("Erro ao gerar resposta:", error);
        // Adiciona mensagem de erro
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "system",
          content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  // Função para lidar com o envio de mensagens
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === "") return

    addMessage(inputValue, "user")
    setInputValue("")
  }

  // Função para lidar com o clique em uma sugestão
  const handleSuggestionClick = (question: string) => {
    addMessage(question, "user")
  }
  
  // Função para aplicar um template de análise
  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = analysisTemplates.find(t => t.id === templateId);
    if (template) {
      addMessage(`Por favor, realize uma ${template.title.toLowerCase()} completa dos meus dados.`, "user");
    }
  }

  // Rola para a mensagem mais recente quando as mensagens são atualizadas
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      {/* Botão flutuante para abrir o assistente */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
              size="icon"
            >
              <BrainCircuit className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Assistente de Análise</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Janela do assistente */}
      {isOpen && (
        <div 
          className={cn(
            "fixed z-50 transition-all duration-200 ease-in-out",
            isExpanded 
              ? "top-4 right-4 left-4 bottom-4" 
              : "bottom-6 right-6 w-full max-w-md"
          )}
        >
          <Card className="flex h-full flex-col shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Assistente de Análise</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-5 text-xs">
                        Modelo: {modelType === "balanced" ? "Balanceado" : modelType === "precise" ? "Preciso" : "Criativo"}
                      </Badge>
                      <Badge variant="outline" className="h-5 text-xs">v2.0</Badge>
                    </div>
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isExpanded ? "Minimizar" : "Expandir"}</TooltipContent>
                </Tooltip>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-4 border-b">
                <TabsList className="w-full justify-start h-10 bg-transparent mb-0 pl-0">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-muted rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-muted rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-muted rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    <Zap className="h-4 w-4 mr-2" />
                    Configurações
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="flex-1 flex flex-col data-[state=active]:flex pt-0 px-0 pb-0 m-0">
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex w-max max-w-[90%] flex-col gap-2 rounded-lg p-3",
                          message.type === "user" 
                            ? "ml-auto bg-primary text-primary-foreground" 
                            : message.type === "system"
                            ? "mx-auto bg-muted/80 text-center text-sm italic"
                            : message.type === "report"
                            ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                            : "bg-muted",
                          message.type === "report" && "max-w-[95%]"
                        )}
                      >
                        {message.type === "report" && (
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                                Relatório
                              </Badge>
                              {message.metadata?.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  Confiança: {message.metadata.confidence}%
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm">{message.content}</div>
                        
                        {message.metadata?.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {message.metadata.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs px-1 py-0">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs opacity-70 flex justify-between items-center">
                          <span>
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.metadata?.source && (
                            <span className="text-xs italic">
                              Fonte: {message.metadata.source}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted p-3">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Analisando dados...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                <div className="border-t p-3">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => handleSuggestionClick(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger className="absolute left-2 bottom-3 w-[100px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanceado</SelectItem>
                        <SelectItem value="precise">Preciso</SelectItem>
                        <SelectItem value="creative">Criativo</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                      <Textarea
                        placeholder="Faça uma pergunta ou peça análise..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="min-h-[60px] pl-[110px] flex-1 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ""}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    <p>Digite "analisar dados" ou "gerar relatório" para análises avançadas</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="templates" className="flex-1 overflow-auto p-4 data-[state=active]:flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Templates de Análise</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione um modelo de análise para começar rapidamente
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary",
                        selectedTemplate === template.id && "border-primary bg-primary/5"
                      )}
                      onClick={() => applyTemplate(template.id)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {template.icon}
                          {template.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground">
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Análises Favoritas</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start h-auto py-2">
                      <BarChart2 className="h-4 w-4 mr-2 text-amber-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Análise de Conversão Mensal</p>
                        <p className="text-xs text-muted-foreground">Comparação de taxas de conversão por canal</p>
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start h-auto py-2">
                      <Brain className="h-4 w-4 mr-2 text-blue-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Segmentação de Clientes</p>
                        <p className="text-xs text-muted-foreground">Análise de segmentos de clientes por valor</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="p-4 data-[state=active]:flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Configurações do Assistente</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Modelo de IA</h4>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanceado</SelectItem>
                        <SelectItem value="precise">Preciso</SelectItem>
                        <SelectItem value="creative">Criativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      O modelo Balanceado oferece um equilíbrio entre precisão e criatividade nas respostas.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Fontes de Dados</h4>
                    <div className="flex items-center justify-between">
                      <label className="text-sm flex items-center">
                        <input type="checkbox" className="mr-2" checked readOnly />
                        Métricas de Vendas
                      </label>
                      <Badge variant="outline">Conectado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm flex items-center">
                        <input type="checkbox" className="mr-2" checked readOnly />
                        Dados de Usuários
                      </label>
                      <Badge variant="outline">Conectado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm flex items-center">
                        <input type="checkbox" className="mr-2" checked readOnly />
                        Análise de Conversão
                      </label>
                      <Badge variant="outline">Conectado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Google Analytics
                      </label>
                      <Badge variant="outline" className="text-muted-foreground">Não conectado</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar fonte de dados
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Preferências</h4>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Salvar histórico de conversas</label>
                      <input type="checkbox" checked readOnly />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Mostrar sugestões de perguntas</label>
                      <input type="checkbox" checked readOnly />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Notificações de insights</label>
                      <input type="checkbox" checked readOnly />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </>
  )
}

