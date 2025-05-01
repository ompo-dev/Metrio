# Documentação de Webhooks - Metrio

## Visão Geral

O Metrio oferece um sistema de webhooks flexível que permite a integração com serviços externos para receber notificações em tempo real sobre eventos ocorridos na plataforma. Esta documentação fornece detalhes sobre como criar, gerenciar e utilizar webhooks.

## Índice

1. [Conceitos Básicos](#conceitos-básicos)
2. [Endpoints da API](#endpoints-da-api)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Autenticação](#autenticação)
5. [Exemplos de Integração](#exemplos-de-integração)
6. [Melhores Práticas](#melhores-práticas)
7. [Solução de Problemas](#solução-de-problemas)
8. [Diagnóstico de Erros](#diagnóstico-de-erros)

## Conceitos Básicos

Um webhook funciona como um "callback HTTP" que envia dados para um URL específico quando determinados eventos ocorrem na plataforma Metrio. Cada webhook tem:

- **Nome Técnico**: Identificador único usado na URL do webhook
- **URL de Entrega**: URL gerada pelo sistema onde os eventos serão enviados
- **Chave Secreta**: Token usado para autenticar as requisições
- **Eventos**: Lista de eventos que acionam o webhook
- **Esquema de Payload**: Estrutura dos dados enviados quando o evento ocorre

## Endpoints da API

### Listar Webhooks

```
GET /api/webhooks
GET /api/webhooks?projectId=:projectId
```

Retorna todos os webhooks do usuário ou de um projeto específico.

### Obter Webhook Específico

```
GET /api/webhooks/:id
```

Retorna os detalhes de um webhook específico.

### Criar Webhook

```
POST /api/webhooks
```

Cria um novo webhook.

Corpo da requisição:

```json
{
  "name": "Nome do Webhook",
  "technicalName": "nome-tecnico",
  "description": "Descrição opcional",
  "secretToken": "whsec_sua_chave_secreta",
  "events": ["user.created", "user.updated"],
  "isActive": true,
  "payloadSchema": {
    "fields": [
      {
        "name": "userId",
        "type": "number",
        "required": true,
        "description": "ID do usuário"
      },
      {
        "name": "keyHook",
        "type": "string",
        "required": true,
        "description": "Chave de autenticação"
      }
    ],
    "version": "1.0"
  },
  "projectId": "id_do_projeto"
}
```

### Atualizar Webhook (Completo)

```
PUT /api/webhooks/:id
```

Atualiza todos os campos de um webhook existente.

### Atualizar Webhook (Parcial)

```
PATCH /api/webhooks/:id
```

Atualiza parcialmente um webhook existente. Útil para ativar/desativar o webhook:

```json
{
  "isActive": false
}
```

### Excluir Webhook

```
DELETE /api/webhooks/:id
```

Remove permanentemente um webhook.

## Estrutura de Dados

### Modelo Webhook

```typescript
interface Webhook {
  id: string;
  name: string; // Nome amigável
  technicalName: string; // Nome técnico para URL
  description?: string; // Descrição opcional
  isActive: boolean; // Status de ativação
  secretToken: string; // Token secreto
  events: string[]; // Lista de eventos
  headers?: Record<string, string>; // Headers HTTP personalizados
  payloadSchema: WebhookPayloadSchema; // Estrutura do payload
  userId: string; // ID do criador
  projectId: string; // ID do projeto
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de atualização
}
```

### Esquema de Payload

```typescript
interface WebhookPayloadSchema {
  fields: WebhookPayloadField[];
  version: string;
}

interface WebhookPayloadField {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description?: string;
}
```

## Autenticação

Todos os webhooks enviados incluem um campo `keyHook` no payload que contém o token secreto do webhook. Esta chave deve ser validada pelo receptor para garantir a autenticidade da fonte.

Exemplo de verificação em Node.js:

```javascript
app.post("/seu-webhook", (req, res) => {
  const webhookSecret = "whsec_seu_token_secreto";

  // Verificar a autenticação
  if (req.body.keyHook !== webhookSecret) {
    return res.status(401).json({
      error: "Não autorizado",
    });
  }

  // Processar dados do webhook
  console.log("Webhook recebido:", req.body);

  // Responder com sucesso
  res.status(200).json({ received: true });
});
```

## Exemplos de Integração

### Exemplo em Node.js/Express

```javascript
const express = require("express");
const app = express();
app.use(express.json());

app.post("/webhook/user-login", (req, res) => {
  // Verificar autenticação
  const webhookSecret = "whsec_seu_token_secreto";
  if (req.body.keyHook !== webhookSecret) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  // Processar dados
  const { userId, device, timestamp } = req.body;
  console.log(`Usuário ${userId} conectou-se via ${device} em ${timestamp}`);

  // Armazenar em banco de dados ou fazer outras operações

  // Responder com sucesso
  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log("Servidor webhook rodando na porta 3000");
});
```

### Exemplo em PHP

```php
<?php
// Receber dados do webhook
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

// Verificar autenticação
$webhookSecret = 'whsec_seu_token_secreto';
if ($data['keyHook'] !== $webhookSecret) {
  http_response_code(401);
  echo json_encode(['error' => 'Não autorizado']);
  exit;
}

// Processar os dados
$userId = $data['userId'];
$action = $data['action'];

// Logar ou armazenar os dados
file_put_contents(
  'webhook_log.txt',
  date('Y-m-d H:i:s') . " - Usuário: $userId, Ação: $action\n",
  FILE_APPEND
);

// Responder com sucesso
http_response_code(200);
echo json_encode(['success' => true]);
?>
```

## Melhores Práticas

1. **Segurança**:

   - Sempre valide o token de autenticação
   - Use HTTPS para todas as comunicações
   - Nunca exponha sua chave secreta em código público

2. **Confiabilidade**:

   - Implemente retentativas para lidar com falhas temporárias
   - Processe webhooks de forma assíncrona quando possível
   - Responda rapidamente às requisições (200 OK) e processe dados em background

3. **Monitoramento**:

   - Registre todos os webhooks recebidos
   - Implemente alertas para falhas de webhook
   - Monitore volumes e padrões de eventos

4. **Campos obrigatórios**:
   - O campo `keyHook` é sempre obrigatório e usado para autenticação

## Solução de Problemas

### Webhooks não estão sendo recebidos

- Verifique se o webhook está ativo
- Confirme que a URL está acessível publicamente
- Verifique logs do servidor para erros
- Certifique-se de que o evento correto está configurado

### Erros de autenticação

- Verifique se o token secreto está correto
- Confirme que o campo `keyHook` está sendo enviado e validado

### Dados incorretos ou faltando

- Verifique o esquema de payload configurado
- Confirme que todos os campos obrigatórios estão presentes
- Verifique a compatibilidade de tipos para cada campo

## Diagnóstico de Erros

### Problemas na Criação de Webhooks

Se você estiver enfrentando problemas ao criar webhooks, verifique o seguinte:

1. **Console do navegador**: Abra as ferramentas de desenvolvedor do navegador (F12) e verifique o console para erros específicos durante a submissão do formulário.

2. **Dados obrigatórios**:

   - Nome do webhook (campo "name")
   - Nome técnico do webhook (campo "technicalName")
   - Chave secreta (campo "secretToken")
   - Pelo menos um campo "keyHook" no schema

3. **Projeto ativo**: Um projeto deve estar selecionado como ativo. Verifique se você possui um projeto ativo na conta.

4. **Logs do servidor**: Se os passos anteriores estiverem corretos, verifique os logs do servidor para erros relacionados à API.

### Depuração de Requisições

Para diagnosticar problemas com requisições de webhooks:

```javascript
// Adicione isso ao seu código para capturar detalhes da requisição
// antes de enviar para a sua API
async function enviarWebhook(data) {
  console.log("Enviando webhook:", data);

  try {
    const response = await fetch("https://api.metrics-saas.com/seu-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Resposta do webhook:", response.status, responseData);

    if (!response.ok) {
      throw new Error(
        `Erro no webhook: ${response.status} - ${JSON.stringify(responseData)}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Falha no webhook:", error);
    throw error;
  }
}
```

### Códigos de Erro Comuns

| Código | Descrição                                       | Solução                                                                 |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------- |
| 400    | Dados inválidos ou campos obrigatórios ausentes | Verifique se todos os campos obrigatórios estão presentes e são válidos |
| 401    | Não autorizado                                  | Verifique se o token secreto (keyHook) está correto                     |
| 403    | Permissão negada                                | Verifique se o usuário tem acesso ao webhook                            |
| 404    | Webhook não encontrado                          | Confirme se o ID do webhook está correto                                |
| 429    | Muitas requisições                              | Implemente limitação de taxa (rate limiting) na sua aplicação           |
| 500    | Erro interno do servidor                        | Contate o suporte se o problema persistir                               |

### Verificação de Projeto Ativo

Se o erro estiver relacionado ao projeto, execute este código no console do navegador para verificar os dados da sessão:

```javascript
// No console do navegador
function verificarSessao() {
  const sessionElement = document.querySelector("[data-user-session]");
  if (sessionElement) {
    try {
      const sessionData = JSON.parse(
        sessionElement.getAttribute("data-user-session")
      );
      console.log("Sessão do usuário:", sessionData);
      console.log("Projeto ativo:", sessionData?.user?.activeProject);
      return sessionData;
    } catch (e) {
      console.error("Erro ao analisar dados da sessão:", e);
      return null;
    }
  } else {
    console.warn(
      "Elemento de sessão não encontrado. Usuário pode não estar autenticado."
    );
    return null;
  }
}

const sessao = verificarSessao();
```

### Problemas com Eventos

Se os eventos não estiverem sendo enviados ou recebidos:

1. Verifique se o evento específico está registrado no webhook
2. Confirme que o webhook está ativo
3. Verifique se o payload enviado contém o campo `keyHook` com o valor correto
4. Teste a conexão usando uma ferramenta como Postman ou cURL antes de implementar no código

### Contato de Suporte

Se você continuar enfrentando problemas após seguir estas etapas de diagnóstico, entre em contato com o suporte:

- Email: suporte@metrics-saas.com
- Documentação: https://docs.metrics-saas.com/webhooks
- Fórum da comunidade: https://community.metrics-saas.com

## Eventos Disponíveis

| Categoria  | Evento                 | Descrição                           |
| ---------- | ---------------------- | ----------------------------------- |
| Usuários   | user.created           | Usuário criado na plataforma        |
| Usuários   | user.updated           | Informações de usuário atualizadas  |
| Usuários   | user.deleted           | Usuário removido da plataforma      |
| Usuários   | user.login             | Usuário fez login                   |
| Usuários   | user.logout            | Usuário fez logout                  |
| Pagamentos | payment.succeeded      | Pagamento processado com sucesso    |
| Pagamentos | payment.failed         | Falha no processamento do pagamento |
| Pagamentos | payment.refunded       | Pagamento reembolsado               |
| Pagamentos | payment.pending        | Pagamento em análise                |
| Pagamentos | subscription.created   | Nova assinatura criada              |
| Pagamentos | subscription.cancelled | Assinatura cancelada                |
| Produtos   | product.created        | Produto criado na plataforma        |
| Produtos   | product.updated        | Informações de produto atualizadas  |
| Produtos   | product.deleted        | Produto removido da plataforma      |
| Produtos   | product.stock.updated  | Estoque de produto atualizado       |
| Sistema    | system.error           | Erro do sistema                     |
| Sistema    | system.notification    | Notificação do sistema              |
| Sistema    | system.maintenance     | Manutenção agendada ou em andamento |
