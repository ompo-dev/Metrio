"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BookOpen, Code, FileText, HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiConfigDocumentation() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Documentação de APIs
          </CardTitle>
          <CardDescription>
            Guia completo para implementação e uso das APIs da plataforma Métricas SaaS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="introduction">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="introduction">Introdução</TabsTrigger>
              <TabsTrigger value="authentication">Autenticação</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="examples">Exemplos</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="introduction" className="space-y-4">
              <h3 className="text-lg font-medium">Bem-vindo às APIs Métricas SaaS</h3>
              <p className="text-muted-foreground">
                Nossas APIs permitem que você capture, analise e visualize métricas importantes do seu
                negócio de forma simples e eficiente. Esta documentação fornece todas as informações
                necessárias para começar a enviar dados para nossa plataforma.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Conceitos Básicos</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <span className="font-medium">APIs:</span> Endpoints personalizados para receber dados
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">Eventos:</span> Ações ou ocorrências que você deseja monitorar
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">Propriedades:</span> Atributos ou características de um evento
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Primeiros Passos</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Para começar a usar nossas APIs:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Crie uma nova API na seção "Criar Nova API"</li>
                      <li>Configure os eventos que deseja monitorar</li>
                      <li>Obtenha sua chave de API</li>
                      <li>Implemente a chamada à API no seu código</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="authentication" className="space-y-4">
              <h3 className="text-lg font-medium">Autenticação</h3>
              <p className="text-muted-foreground">
                Todas as APIs do Métricas SaaS usam autenticação baseada em tokens. Você precisará incluir
                sua chave de API em todas as solicitações.
              </p>
              
              <div className="my-4">
                <h4 className="font-medium mb-2">Cabeçalho de Autorização</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  {`Authorization: Bearer sk_metricas_your_api_key`}
                </pre>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Segurança Importante</AlertTitle>
                <AlertDescription>
                  Nunca compartilhe suas chaves de API ou inclua-as em código-fonte público. Sempre use
                  variáveis de ambiente ou outros métodos seguros para armazenar suas chaves.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <h3 className="text-lg font-medium">Eventos</h3>
              <p className="text-muted-foreground">
                Eventos representam ações ou ocorrências em seu sistema que você deseja monitorar.
                Cada evento pode conter dados personalizados relevantes para o contexto.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-medium mb-2">Estrutura de um Evento</h4>
                  <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                    {`{
  "event": "nome_do_evento",
  "data": {
    // Dados personalizados
    "propriedade1": "valor1",
    "propriedade2": "valor2"
  },
  "timestamp": "2023-12-01T12:34:56Z" // Opcional
}`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tipos de Eventos Comuns</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-medium">Usuários:</span> cadastro, login, atualização, exclusão
                    </li>
                    <li>
                      <span className="font-medium">Produtos:</span> visualização, adição ao carrinho, compra
                    </li>
                    <li>
                      <span className="font-medium">Conteúdo:</span> visualização, tempo de leitura, compartilhamento
                    </li>
                    <li>
                      <span className="font-medium">Financeiro:</span> pagamento, reembolso, assinatura
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-4">
              <h3 className="text-lg font-medium">Exemplos de Implementação</h3>
              
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4" />
                    JavaScript/Node.js
                  </h4>
                  <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                    {`// Usando fetch (browser) ou node-fetch (Node.js)
async function trackEvent(eventName, eventData) {
  try {
    const response = await fetch('https://api.metricassaas.com/v1/seu-endpoint', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk_metricas_your_api_key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Falha ao registrar evento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Exemplo de uso
trackEvent('cadastro', {
  userId: '12345',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  plan: 'premium'
});`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4" />
                    PHP
                  </h4>
                  <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                    {`<?php
function trackEvent($eventName, $eventData) {
  $url = 'https://api.metricassaas.com/v1/seu-endpoint';
  $apiKey = 'sk_metricas_your_api_key';
  
  $payload = array(
    'event' => $eventName,
    'data' => $eventData,
    'timestamp' => date('c')
  );
  
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
  ));
  
  $response = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  
  if ($httpCode >= 200 && $httpCode < 300) {
    return json_decode($response, true);
  } else {
    error_log('Erro ao registrar evento: ' . $response);
    return false;
  }
}

// Exemplo de uso
trackEvent('compra', array(
  'orderId' => '987654',
  'customer' => 'Maria Oliveira',
  'total' => 199.90,
  'items' => array('produto1', 'produto2')
));
?>`}
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-4">
              <h3 className="text-lg font-medium">Perguntas Frequentes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Quantos eventos posso enviar por mês?
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    O limite de eventos depende do seu plano. O plano básico inclui até 100.000 eventos por mês,
                    o plano profissional inclui 1.000.000 e o plano empresarial oferece eventos ilimitados.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Posso personalizar completamente os eventos e suas propriedades?
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    Sim, você tem total liberdade para definir os nomes dos eventos e as propriedades que deseja
                    monitorar. Nossa plataforma é altamente flexível e se adapta ao seu negócio.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Como posso garantir que não estou perdendo eventos?
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    Recomendamos implementar uma lógica de novas tentativas em sua aplicação para casos de falha
                    de rede. Além disso, nossa plataforma possui um sistema de detecção de duplicatas para evitar
                    registros duplicados caso você envie o mesmo evento mais de uma vez.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Existe uma biblioteca oficial para facilitar a integração?
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    Sim, oferecemos bibliotecas de cliente para JavaScript, Python, PHP, Ruby e Java. Você pode
                    encontrá-las em nossa <a href="#" className="text-primary">página de recursos</a>.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Como posso visualizar os dados coletados?
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    Todos os dados coletados podem ser visualizados no dashboard principal da plataforma.
                    Você também pode criar relatórios personalizados e exportar os dados em formatos CSV ou JSON.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Precisa de ajuda adicional? Consulte nossa documentação completa.</span>
        </div>
        <a href="#" className="text-primary font-medium hover:underline">Ver Documentação Completa</a>
      </div>
    </div>
  )
}

// Exportação padrão para garantir compatibilidade com Next.js
export default ApiConfigDocumentation 