"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, Info, LineChart, Lock, Server, Terminal } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function ApiConfigDetails() {
  const { toast } = useToast()
  const [selectedApi] = useState({
    id: "api-1",
    name: "API de Cadastros",
    endpoint: "/api/v1/cadastros",
    status: "active",
    events: ["cadastro", "atualização", "exclusão"],
    createdAt: "10/10/2023",
    requests: 12543,
    secretKey: "sk_metricas_1234567890abcdef",
    description: "Esta API coleta dados de cadastros de usuários no sistema, incluindo criação, atualização e exclusão."
  })

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: message,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{selectedApi.name}</CardTitle>
            <CardDescription>Detalhes e documentação da API</CardDescription>
          </div>
          <Badge variant={selectedApi.status === "active" ? "default" : "secondary"}>
            {selectedApi.status === "active" ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="credentials">Credenciais</TabsTrigger>
            <TabsTrigger value="usage">Uso</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Descrição</h4>
                <p className="text-sm text-muted-foreground">{selectedApi.description}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Server className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Endpoint</h4>
                <div className="flex items-center mt-1">
                  <code className="text-xs bg-muted px-2 py-1 rounded">{selectedApi.endpoint}</code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1" 
                    onClick={() => copyToClipboard(selectedApi.endpoint, "Endpoint copiado para a área de transferência")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <LineChart className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Eventos</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedApi.events.map((event) => (
                    <Badge key={event} variant="outline">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="credentials" className="space-y-4 pt-4">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Chave de API</h4>
                <div className="flex items-center mt-1">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {selectedApi.secretKey.substring(0, 8)}•••••••••••••••
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1" 
                    onClick={() => copyToClipboard(selectedApi.secretKey, "Chave de API copiada para a área de transferência")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mantenha esta chave segura. Você só pode vê-la uma vez.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="regenerate-warning" />
              <Label htmlFor="regenerate-warning" className="text-sm">
                Estou ciente que regenerar a chave invalidará todas as chaves antigas.
              </Label>
            </div>
            
            <Button variant="outline" size="sm">
              Regenerar Chave de API
            </Button>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Total de requisições</h4>
                <span className="font-medium">{selectedApi.requests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Último mês</span>
                <span>5.280</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Esta semana</span>
                <span>1.243</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Hoje</span>
                <span>187</span>
              </div>
            </div>
            
            <div className="h-[120px] bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Gráfico de uso em breve</span>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4 pt-4">
            <div className="flex items-start gap-2">
              <Terminal className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">cURL</h4>
                <div className="relative mt-2">
                  <pre className="bg-muted p-2 rounded-lg text-xs overflow-x-auto">
                    {`curl -X POST ${selectedApi.endpoint} \\
  -H "Authorization: Bearer ${selectedApi.secretKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "cadastro", "data": {"userId": "123", "name": "João Silva"}}'`}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1" 
                    onClick={() => copyToClipboard(
                      `curl -X POST ${selectedApi.endpoint} \\
  -H "Authorization: Bearer ${selectedApi.secretKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "cadastro", "data": {"userId": "123", "name": "João Silva"}}'`, 
                      "Comando cURL copiado"
                    )}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Code className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">JavaScript</h4>
                <div className="relative mt-2">
                  <pre className="bg-muted p-2 rounded-lg text-xs overflow-x-auto">
                    {`fetch('${selectedApi.endpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${selectedApi.secretKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: 'cadastro',
    data: {
      userId: '123',
      name: 'João Silva'
    }
  })
})`}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1" 
                    onClick={() => copyToClipboard(
                      `fetch('${selectedApi.endpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${selectedApi.secretKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: 'cadastro',
    data: {
      userId: '123',
      name: 'João Silva'
    }
  })
})`,
                      "Código JavaScript copiado"
                    )}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline">Editar API</Button>
        <Button variant="destructive">Desativar API</Button>
      </CardFooter>
    </Card>
  )
}

// Exportação padrão adicionada para resolver problemas de importação
export default ApiConfigDetails 