import { WebhooksCreate } from "@/components/webhooks/webhooks-create"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Zap, ArrowLeft, Code, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CreateWebhookPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Criar Novo Webhook</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/webhooks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-700 flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          Novo Sistema de UUIDs
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          Nossos webhooks agora utilizam UUIDs únicos para cada endpoint. Use nomes técnicos em seu código para 
          facilitar o uso e a manutenção. As variáveis de ambiente (WEBHOOK_ID_*) são recomendadas para gerenciar os IDs.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="implementation">
            <Code className="h-4 w-4 mr-2" />
            Implementação
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <WebhooksCreate />
        </TabsContent>
        
        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>Implementando seu Webhook</CardTitle>
              <CardDescription>
                Exemplos práticos de como integrar webhooks em seu projeto usando diferentes abordagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Arquivo Helper Webhook.ts</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Crie este arquivo em seu projeto para facilitar o uso dos webhooks com chamadas simples como <code className="bg-muted px-1 py-0.5 rounded">webhook.user.login(123, 'mobile')</code>
                </p>
                <div className="rounded-md overflow-hidden">
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: '0.75rem', borderRadius: '0.375rem' }}
                    showLineNumbers
                  >
{`// webhooks.ts - Um arquivo helper para enviar seus webhooks
import axios from 'axios';

// Configuração central do webhook
const webhookConfig = {
  baseUrl: 'https://api.metrics-saas.com',
  keyHook: 'whsec_B8XiLwDo7bWhe5dXApo1qPw3BGPp1fs0'
};

// Função genérica para enviar webhook
async function sendWebhook(endpoint: string, data: any) {
  try {
    // Adiciona a chave de autenticação automaticamente
    const payload = {
      ...data,
      keyHook: webhookConfig.keyHook
    };

    const response = await axios.post(
      \`\${webhookConfig.baseUrl}/\${endpoint}\`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log(\`Webhook \${endpoint} enviado com sucesso\`);
    return response.data;
  } catch (error) {
    console.error(\`Erro ao enviar webhook \${endpoint}:\`, error);
    throw error;
  }
}

// Namespace para webhooks de usuário
export const webhook = {
  user: {
    // Usuário se logou
    login: (userId: number, device: string, timestamp = new Date()) => {
      return sendWebhook('user-login', {
        userId,
        device,
        timestamp: timestamp.toISOString()
      });
    },
    
    // Usuário se registrou
    register: (userId: number, email: string, plan: string) => {
      return sendWebhook('user-register', {
        userId,
        email,
        plan
      });
    },
    
    // Usuário adicionou item ao carrinho
    addToCart: (userId: number, itemId: number, value: number, currency = 'BRL') => {
      return sendWebhook('user-cart', {
        userId,
        itemId,
        value,
        currency,
        action: 'add'
      });
    },
    
    // Usuário completou compra
    purchase: (userId: number, orderId: string, value: number, items: number[]) => {
      return sendWebhook('user-purchase', {
        userId,
        orderId,
        value,
        items
      });
    }
  },
  
  product: {
    // Produto visualizado
    view: (productId: number, userId?: number) => {
      return sendWebhook('product-view', {
        productId,
        userId,
        timestamp: new Date().toISOString()
      });
    },
    
    // Estoque atualizado
    stockUpdate: (productId: number, quantity: number) => {
      return sendWebhook('product-stock', {
        productId,
        quantity,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  // Seu webhook personalizado atual
  custom: (userId: number, value: string, currency: string, itemId: number) => {
    return sendWebhook('seu-hook', {
      userId,
      value,
      currency,
      itemId,
    });
  }
};

// Exemplo de uso:
/*
// Em qualquer arquivo do seu projeto:
import { webhook } from './webhooks';

// Exemplos de chamadas simples
webhook.user.login(123, 'mobile-ios');
webhook.user.addToCart(123, 456, 99.90);
webhook.product.view(456, 123);

// Chamando o webhook personalizado
webhook.custom(123, "exemplo", "exemplo", 123);
*/`}
                  </SyntaxHighlighter>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Salve este arquivo em <code className="bg-muted px-1 py-0.5 rounded">lib/webhooks.ts</code> ou <code className="bg-muted px-1 py-0.5 rounded">utils/webhooks.ts</code> e importe onde precisar.
                </p>
                <h4 className="text-sm font-medium mt-3 mb-2">Exemplos práticos de uso em seu projeto:</h4>
                <div className="rounded-md overflow-hidden">
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: '0.75rem', borderRadius: '0.375rem' }}
                  >
{`// Em um componente de login (pages/login.tsx ou app/login/page.tsx)
import { webhook } from '@/lib/webhooks';

const handleLogin = async (email, password) => {
  try {
    // Sua lógica de login aqui...
    const user = await authService.login(email, password);
    
    // Enviar webhook após login bem-sucedido
    await webhook.user.login(user.id, navigator.userAgent);
    
    // Continuar com redirecionamento...
    router.push('/dashboard');
  } catch (error) {
    console.error("Erro no login", error);
  }
};

// Em um componente de carrinho de compras
import { webhook } from '@/lib/webhooks';

const addToCart = async (product) => {
  // Adicionar produto ao carrinho local
  setCart([...cart, product]);
  
  // Enviar webhook para análise de comportamento do usuário
  if (session?.user) {
    await webhook.user.addToCart(
      session.user.id, 
      product.id,
      product.price
    );
  }
};

// Em uma página de produto
import { webhook } from '@/lib/webhooks';
import { useEffect } from 'react';

export default function ProductPage({ product, user }) {
  useEffect(() => {
    // Registrar visualização do produto quando a página carrega
    webhook.product.view(product.id, user?.id);
  }, [product.id, user]);
  
  // Resto do componente...
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">SDK com Variáveis de Ambiente</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Abordagem recomendada para projetos em produção, usando variáveis de ambiente para segurança.
                </p>
                <div className="rounded-md overflow-hidden">
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: '0.75rem', borderRadius: '0.375rem' }}
                    showLineNumbers
                  >
{`// webhooks.ts - Helper para enviar webhooks
import axios from 'axios';

// Mapeamento de nomes técnicos para UUIDs dos webhooks
const webhookIds = {
  'user-login': process.env.WEBHOOK_ID_USER_LOGIN,
  'user-register': process.env.WEBHOOK_ID_USER_REGISTER,
  'user-cart': process.env.WEBHOOK_ID_USER_CART,
  'product-view': process.env.WEBHOOK_ID_PRODUCT_VIEW,
  'product-stock': process.env.WEBHOOK_ID_PRODUCT_STOCK,
};

// Carregamento de configurações via variáveis de ambiente (.env)
const webhookConfig = {
  baseUrl: process.env.WEBHOOK_BASE_URL || 'https://api.metrics-saas.com',
  keyHook: process.env.WEBHOOK_SECRET_KEY,
  debug: process.env.NODE_ENV !== 'production',
};

// Verificações de segurança na inicialização
if (!webhookConfig.keyHook) {
  throw new Error('WEBHOOK_SECRET_KEY não configurada! Adicione esta variável ao seu arquivo .env');
}

if (!webhookConfig.baseUrl) {
  console.warn('WEBHOOK_BASE_URL não configurada, usando URL padrão');
}

// Função genérica para enviar webhook
async function sendWebhook(hookName: string, data: any) {
  const webhookId = webhookIds[hookName];
  
  if (!webhookId && webhookConfig.debug) {
    console.warn(\`Webhook ID para "\${hookName}" não configurado no .env\`);
  }
  
  try {
    // Adiciona a chave de autenticação automaticamente
    const payload = {
      ...data,
      keyHook: webhookConfig.keyHook
    };

    const response = await axios.post(
      \`\${webhookConfig.baseUrl}/\${webhookId || hookName}\`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (webhookConfig.debug) {
      console.log(\`Webhook \${hookName} enviado com sucesso\`);
    }
    
    return response.data;
  } catch (error) {
    console.error(\`Erro ao enviar webhook \${hookName}:\`, error);
    throw error;
  }
}`}
                  </SyntaxHighlighter>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Configure suas variáveis de ambiente no arquivo <code className="bg-muted px-1 py-0.5 rounded">.env</code>:
                </p>
                <div className="bg-muted p-2 mt-1 rounded">
                  <pre className="text-xs">
{`# Configuração de Webhooks
WEBHOOK_BASE_URL=https://api.metrics-saas.com
WEBHOOK_SECRET_KEY=whsec_sua_chave_secreta

# IDs dos webhooks (UUIDs gerados pela plataforma)
WEBHOOK_ID_USER_LOGIN=a1b2c3d4-e5f6-7890-abcd-ef1234567890
WEBHOOK_ID_USER_REGISTER=b2c3d4e5-f6g7-8901-abcd-ef1234567891
WEBHOOK_ID_USER_CART=c3d4e5f6-g7h8-9012-abcd-ef1234567892
WEBHOOK_ID_PRODUCT_VIEW=d4e5f6g7-h8i9-0123-abcd-ef1234567893
WEBHOOK_ID_PRODUCT_STOCK=e5f6g7h8-i9j0-1234-abcd-ef1234567894`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">API com Namespaces</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  SDK organizado com namespaces (user, product, etc) para facilitar o uso em diferentes contextos.
                </p>
                <div className="rounded-md overflow-hidden">
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: '0.75rem', borderRadius: '0.375rem' }}
                    showLineNumbers
                  >
{`// Namespace para webhooks de usuário
export const webhook = {
  user: {
    // Usuário se logou
    login: (userId: number, device: string, timestamp = new Date()) => {
      return sendWebhook('user-login', {
        userId,
        device,
        timestamp: timestamp.toISOString()
      });
    },
    
    // Usuário se registrou
    register: (userId: number, email: string, plan: string) => {
      return sendWebhook('user-register', {
        userId,
        email,
        plan
      });
    },
    
    // Usuário adicionou item ao carrinho
    addToCart: (userId: number, itemId: number, value: number, currency = 'BRL') => {
      return sendWebhook('user-cart', {
        userId,
        itemId,
        value,
        currency,
        action: 'add'
      });
    },
  },
  
  product: {
    // Produto visualizado
    view: (productId: number, userId?: number) => {
      return sendWebhook('product-view', {
        productId,
        userId,
        timestamp: new Date().toISOString()
      });
    },
    
    // Estoque atualizado
    stockUpdate: (productId: number, quantity: number) => {
      return sendWebhook('product-stock', {
        productId,
        quantity,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Exemplo de uso:
// webhook.user.login(123, 'mobile-ios');
// webhook.product.view(456, 123);`}
                  </SyntaxHighlighter>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Implementação em React/Next.js</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Exemplo prático de integração em uma página de checkout real.
                </p>
                <div className="rounded-md overflow-hidden">
                  <SyntaxHighlighter 
                    language="tsx" 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, fontSize: '0.75rem', borderRadius: '0.375rem' }}
                    showLineNumbers
                  >
{`// Em um componente React (exemplo: checkout)
import React from 'react';
import { useSession } from 'next-auth/react';
import { webhook } from '@/lib/webhooks';

export default function CheckoutButton({ cartItems, total }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // Processar o checkout na sua API
      const order = await api.createOrder({
        items: cartItems,
        total,
        userId: session?.user?.id
      });
      
      // Enviar webhook de compra finalizada
      await webhook.user.purchase(
        session?.user?.id, 
        order.id,
        total,
        cartItems.map(item => item.id)
      );
      
      // Redirecionar para confirmação
      router.push(\`/order/success/\${order.id}\`);
      
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      // Lidar com o erro
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 rounded-md"
    >
      {loading ? "Processando..." : "Finalizar Compra"}
    </button>
  );
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 