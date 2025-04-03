"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardCopy, Code, Copy, Key, RefreshCw, Send, ShieldAlert, Terminal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type DeliveryRecord = {
  id: string
  timestamp: string
  status: "success" | "failed"
  responseCode?: number
  responseTime: number
  requestPayload: string
  responsePayload?: string
  error?: string
}

type Webhook = {
  id: string
  name: string
  url: string
  status: "active" | "inactive"
  events: string[]
  createdAt: string
  lastTriggered?: string
  secret: string
  description?: string
  deliveryHistory: DeliveryRecord[]
}

export function WebhooksDetails({ webhook }: { webhook: Webhook }) {
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook>(webhook)
  const [testPayload, setTestPayload] = useState<string>('{\n  "type": "user.created",\n  "data": {\n    "id": "usr_123",\n    "name": "Novo Usuário",\n    "email": "usuario@exemplo.com"\n  }\n}')
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const { toast } = useToast()
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: message,
      duration: 3000
    })
  }
  
  const testWebhook = () => {
    setIsLoading(true)
    
    // Simula o envio do webhook
    setTimeout(() => {
      setTestResult({
        success: true,
        statusCode: 200,
        responseTime: 312,
        response: '{"status":"received","message":"Webhook processado com sucesso"}',
        timestamp: new Date().toISOString()
      })
      setIsLoading(false)
      
      toast({
        title: "Webhook enviado com sucesso!",
        description: "O servidor respondeu com status 200 em 312ms",
        duration: 5000
      })
    }, 1500)
  }
  
  const regenerateSecret = () => {
    const newSecret = "whsec_" + Array(32).fill(0).map(() => 
      "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
    ).join("")
    
    setSelectedWebhook({
      ...selectedWebhook,
      secret: newSecret
    })
    
    toast({
      title: "Chave secreta regenerada",
      description: "A nova chave foi gerada com sucesso. Lembre-se de atualizar em seus sistemas.",
      duration: 5000
    })
  }
  
  // Formata a data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca"
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                {selectedWebhook.name}
                {selectedWebhook.status === "active" ? (
                  <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-700 border-gray-200">
                    Inativo
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">{selectedWebhook.description || "Sem descrição"}</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <Separator />
        
        <Tabs defaultValue="overview" className="pb-1">
          <TabsList className="px-6 pt-2 w-full max-w-[630px] justify-evenly m-3 items-center flex">
            <TabsTrigger value="overview" className="w-full">Visão Geral</TabsTrigger>
            <TabsTrigger value="security" className="w-full">Segurança</TabsTrigger>
            <TabsTrigger value="history" className="w-full">Histórico</TabsTrigger>
            <TabsTrigger value="testing" className="w-full">Testar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-6 pt-4">
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium text-sm mb-1">URL do Endpoint</h3>
                <div className="flex gap-2 items-center">
                  <code className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                    {selectedWebhook.url}
                  </code>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedWebhook.url, "URL copiada para a área de transferência")}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-1">Eventos Monitorados</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedWebhook.events.map(event => (
                    <Badge key={event} variant="secondary">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Informações</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{selectedWebhook.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Criado em:</span>
                      <span>{formatDate(selectedWebhook.createdAt)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Última execução:</span>
                      <span>{formatDate(selectedWebhook.lastTriggered)}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-1">Configurações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="webhook-status">Status</Label>
                        <div className="text-xs text-muted-foreground">Ativar ou desativar esse webhook</div>
                      </div>
                      <Switch 
                        id="webhook-status" 
                        checked={selectedWebhook.status === "active"} 
                        onCheckedChange={(checked) => 
                          setSelectedWebhook({
                            ...selectedWebhook, 
                            status: checked ? "active" : "inactive"
                          })
                        } 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="p-6 pt-4">
            <div className="grid gap-4">
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Mantenha este segredo em segurança</AlertTitle>
                <AlertDescription>
                  Esta chave secreta é usada para verificar a autenticidade dos webhooks. 
                  Nunca compartilhe ou exponha esta chave em seu código cliente ou repositórios públicos.
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="font-medium text-sm mb-1">Chave Secreta de Webhook</h3>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <Input 
                      value={selectedWebhook.secret} 
                      readOnly 
                      type="password"
                      className="pr-10 font-mono"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute right-0 top-0 h-full"
                      onClick={() => copyToClipboard(selectedWebhook.secret, "Chave secreta copiada para a área de transferência")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={regenerateSecret}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use essa chave para verificar as assinaturas HMAC enviadas nos cabeçalhos HTTP.
                </p>
              </div>
              
              <div className="mt-4 max-w-[610px]">
                <h3 className="font-medium text-sm mb-3">Como verificar a assinatura</h3>
                <Tabs defaultValue="node">
                  <TabsList className="mb-4">
                    <TabsTrigger value="node">Node.js</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="node">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`const crypto = require('crypto');

function verificarAssinatura(payload, assinatura, chaveSecreta) {
  const hmac = crypto.createHmac('sha256', chaveSecreta);
  const assinaturaCalculada = hmac
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(assinaturaCalculada, 'hex'),
    Buffer.from(assinatura, 'hex')
  );
}

// Uso em Express.js
app.post('/webhook', (req, res) => {
  const payload = req.rawBody; // requer configuração prévia
  const assinatura = req.header('X-Webhook-Signature');
  
  if (!verificarAssinatura(payload, assinatura, "${selectedWebhook.secret}")) {
    return res.status(401).send('Assinatura inválida');
  }
  
  // Continuar processamento do webhook...
});`}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="php">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`<?php
function verificarAssinatura($payload, $assinatura, $chaveSecreta) {
  $assinaturaCalculada = hash_hmac('sha256', $payload, $chaveSecreta);
  
  return hash_equals($assinaturaCalculada, $assinatura);
}

// Uso em um controlador
$payload = file_get_contents('php://input');
$assinatura = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';

if (!verificarAssinatura($payload, $assinatura, "${selectedWebhook.secret}")) {
  http_response_code(401);
  echo 'Assinatura inválida';
  exit;
}

// Continuar processamento do webhook...
?>`}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="python">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`import hmac
import hashlib

def verificar_assinatura(payload, assinatura, chave_secreta):
    assinatura_calculada = hmac.new(
        key=chave_secreta.encode(),
        msg=payload.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(assinatura_calculada, assinatura)

# Uso em Flask
@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.data.decode('utf-8')
    assinatura = request.headers.get('X-Webhook-Signature', '')
    
    if not verificar_assinatura(payload, assinatura, "${selectedWebhook.secret}"):
        return 'Assinatura inválida', 401
    
    # Continuar processamento do webhook...`}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-6 pt-4">
            <div className="grid gap-4">
              <h3 className="font-medium">Histórico de Entregas</h3>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="py-2 px-4 text-left font-medium">Data e Hora</th>
                        <th className="py-2 px-4 text-left font-medium">Evento</th>
                        <th className="py-2 px-4 text-left font-medium">Status</th>
                        <th className="py-2 px-4 text-left font-medium">Código</th>
                        <th className="py-2 px-4 text-left font-medium">Tempo</th>
                        <th className="py-2 px-4 text-left font-medium">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedWebhook.deliveryHistory.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-muted/50">
                          <td className="py-2 px-4">
                            {new Date(delivery.timestamp).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-2 px-4">
                            {JSON.parse(delivery.requestPayload).type}
                          </td>
                          <td className="py-2 px-4">
                            {delivery.status === "success" ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Sucesso
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Falha
                              </Badge>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {delivery.responseCode || "-"}
                          </td>
                          <td className="py-2 px-4">
                            {delivery.responseTime}ms
                          </td>
                          <td className="py-2 px-4">
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {selectedWebhook.deliveryHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum evento de entrega registrado para este webhook.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="p-6 pt-4">
            <div className="grid gap-6">
              <div>
                <h3 className="font-medium mb-2">Testar Webhook</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Envie um payload de teste para o endpoint deste webhook para verificar se está funcionando corretamente.
                </p>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="test-payload" className="text-sm mb-1 block">Payload (JSON)</Label>
                    <Textarea
                      id="test-payload"
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      className="font-mono text-xs min-h-[200px]"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={testWebhook} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Teste
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {testResult && (
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Resultado do Teste
                  </h4>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <div className="w-28 text-xs text-muted-foreground">Status:</div>
                      {testResult.success ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Sucesso ({testResult.statusCode})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Falha ({testResult.statusCode})
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex">
                      <div className="w-28 text-xs text-muted-foreground">Tempo:</div>
                      <div className="text-xs">{testResult.responseTime}ms</div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-28 text-xs text-muted-foreground">Data/Hora:</div>
                      <div className="text-xs">{new Date(testResult.timestamp).toLocaleString('pt-BR')}</div>
                    </div>
                    
                    <div>
                      <div className="w-28 text-xs text-muted-foreground mb-1">Resposta:</div>
                      <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                        {testResult.response}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              
              <Alert>
                <Code className="h-4 w-4" />
                <AlertTitle>Dica para Testar</AlertTitle>
                <AlertDescription>
                  Se você estiver desenvolvendo localmente, considere usar ferramentas como ngrok 
                  ou localtunnel para expor seu servidor local à internet.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default WebhooksDetails 