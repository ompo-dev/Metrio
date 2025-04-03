"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Code, Copy, Plus, Server, Trash, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

const eventTemplates = [
  { category: "E-commerce", events: ["visualização_produto", "adição_carrinho", "checkout_iniciado", "compra_finalizada", "avaliação_produto"] },
  { category: "SaaS", events: ["cadastro", "login", "upgrade_plano", "downgrade_plano", "cancelamento", "uso_feature"] },
  { category: "Marketing", events: ["visualização_página", "clique_cta", "download_material", "inscrição_newsletter", "compartilhamento"] },
  { category: "App Mobile", events: ["instalação", "primeiro_uso", "uso_diário", "compartilhamento", "uso_feature", "desinstalação"] },
]

export function ApiConfigCreate() {
  const [events, setEvents] = useState<string[]>([])
  const [newEvent, setNewEvent] = useState("")
  const [apiName, setApiName] = useState("")
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiDescription, setApiDescription] = useState("")
  const [openEventTemplates, setOpenEventTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const addEvent = () => {
    if (newEvent && !events.includes(newEvent)) {
      setEvents([...events, newEvent])
      setNewEvent("")
    }
  }

  const removeEvent = (event: string) => {
    setEvents(events.filter((e) => e !== event))
  }
  
  const selectEventTemplate = (category: string) => {
    setSelectedTemplate(category)
    const template = eventTemplates.find((t) => t.category === category)
    if (template) {
      // Adicionar apenas eventos que ainda não existem na lista
      const newEvents = template.events.filter((e) => !events.includes(e))
      setEvents([...events, ...newEvents])
    }
  }
  
  const generateExampleCode = () => {
    if (!apiEndpoint) return '// Defina um endpoint para ver o código de exemplo'
    
    return `// Enviar evento para a API
fetch('https://api.metricassaas.com/v1/${apiEndpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_metricas_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: '${events[0] || "nome_do_evento"}',
    data: {
      // Propriedades do evento
    },
    timestamp: new Date().toISOString()
  })
})`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Criar Nova API</CardTitle>
        <CardDescription>Configure uma nova API para coletar dados específicos do seu negócio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-name">Nome da API</Label>
              <Input 
                id="api-name" 
                placeholder="Ex: API de Usuários" 
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">Endpoint</Label>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">/api/v1/</div>
                <Input 
                  id="api-endpoint" 
                  placeholder="usuarios" 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                O endpoint completo será: https://api.metricassaas.com/v1/{apiEndpoint || "[seu-endpoint]"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-description">Descrição</Label>
              <Textarea 
                id="api-description" 
                placeholder="Descreva o propósito desta API e os tipos de dados que será coletado" 
                rows={3}
                value={apiDescription}
                onChange={(e) => setApiDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Autenticação</Label>
                <Select defaultValue="bearer">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de autenticação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="api-key">API Key</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Formato de Resposta</Label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato de resposta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="api-active" defaultChecked />
              <Label htmlFor="api-active">API ativa após a criação</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Eventos</Label>
              
              <Popover open={openEventTemplates} onOpenChange={setOpenEventTemplates}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Usar Template <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Buscar templates..." />
                    <CommandList>
                      <CommandEmpty>Nenhum template encontrado.</CommandEmpty>
                      <CommandGroup>
                        {eventTemplates.map((template) => (
                          <CommandItem 
                            key={template.category}
                            onSelect={() => {
                              selectEventTemplate(template.category)
                              setOpenEventTemplates(false)
                            }}
                            className="flex items-center justify-between"
                          >
                            <span>{template.category}</span>
                            {selectedTemplate === template.category && <Check className="h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Nome do evento (ex: visualização_produto, compra)"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addEvent()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addEvent}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {events.length === 0 ? (
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Server className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-medium">Nenhum evento definido</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Adicione eventos que sua API irá monitorar ou use um template pré-definido.
                </p>
                <Button variant="outline" size="sm" onClick={() => setOpenEventTemplates(true)}>
                  Usar Template
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Eventos Definidos ({events.length})</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEvents([])}
                    className="h-8 text-xs"
                  >
                    <Trash className="h-3 w-3 mr-1" /> Limpar Todos
                  </Button>
                </div>
                <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-2">
                  {events.map((event) => (
                    <div key={event} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <Badge variant="outline" className="font-mono">{event}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeEvent(event)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Alert className="bg-muted border-muted-foreground/20">
              <AlertDescription className="text-xs text-muted-foreground">
                Eventos podem ser adicionados, removidos ou editados a qualquer momento após a criação da API.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm">Detalhes da API</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Nome:</p>
                    <p className="text-muted-foreground">{apiName || "Não definido"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Endpoint:</p>
                    <div className="flex items-center">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {apiEndpoint ? `/api/v1/${apiEndpoint}` : "Não definido"}
                      </code>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">Descrição:</p>
                    <p className="text-muted-foreground">{apiDescription || "Não definido"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="font-medium text-sm mb-2">Eventos:</p>
                  <div className="flex flex-wrap gap-1">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <Badge key={event} variant="outline">
                          {event}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Nenhum evento definido</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm">Exemplo de Código</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-muted/50">
                <pre className="text-xs overflow-x-auto">{generateExampleCode()}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Criar API</Button>
      </CardFooter>
    </Card>
  )
}

