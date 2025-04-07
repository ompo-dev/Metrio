import Link from "next/link"
import {
  ArrowRight,
  SquareGanttChart,
  BarChart3,
  Bot,
  CheckCircle2,
  Code,
  Database,
  Globe,
  LineChart,
  Lock,
  MessageSquare,
  Webhook,
  Zap,
  Activity,
  TrendingUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-center items-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <SquareGanttChart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Metrio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Funcionalidades
            </Link>
            <Link href="#solucoes" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Soluções
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Como Funciona
            </Link>
            <Link href="#planos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Planos
            </Link>
            <Link href="#visao" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Nossa Visão
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Pré-cadastro</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex justify-center items-center relative overflow-hidden w-full py-20 md:py-28 lg:py-32 
                            bg-gradient-to-br from-background via-background to-primary/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center text-center mb-12">
              <Badge className="mb-4 text-sm px-6 py-1.5" variant="outline">
                <span className="bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text font-medium">
                  Em breve - Faça seu pré-cadastro
                </span>
              </Badge>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-5">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-b from-foreground to-foreground/80 text-transparent bg-clip-text">
                    Transforme dados em <span className="text-primary">decisões de negócio</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed mx-auto lg:mx-0">
                    Capture, processe e visualize métricas importantes do seu negócio com webhooks personalizáveis. 
                    Unificando dados para times de marketing, design, desenvolvimento e data science.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center lg:justify-start">
                  <Link href="/register">
                    <Button size="lg" className="gap-2 px-8 h-12 shadow-lg shadow-primary/20">
                      Pré-cadastro
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#como-funciona">
                    <Button size="lg" variant="outline" className="gap-2 px-8 h-12">
                      Como funciona
                      <Zap className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm mt-4">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Acesso antecipado</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Sem cartão de crédito</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Suporte personalizado</span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 py-5 border-t border-b border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">Simples</div>
                    <div className="text-xs text-muted-foreground mt-1">Integração rápida</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">Flexível</div>
                    <div className="text-xs text-muted-foreground mt-1">Para seu negócio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">Intuitivo</div>
                    <div className="text-xs text-muted-foreground mt-1">Fácil de usar</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[600px] h-[460px] overflow-hidden rounded-xl bg-gradient-to-br from-background to-secondary/5 p-1 shadow-2xl">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-lg border border-border/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-40"></div>
                    <img
                      src="/placeholder.svg?height=460&width=600"
                      alt="Dashboard da plataforma"
                      className="h-full w-full object-cover rounded-lg"
                    />
                    {/* Overlay de gráficos decorativos */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/40 px-3 py-1.5 rounded-lg shadow-lg">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">Análise em tempo real</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/40 px-3 py-1.5 rounded-lg shadow-lg">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium">Insights inteligentes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-24 flex flex-col items-center">
              <div className="text-sm text-muted-foreground mb-6">Em desenvolvimento para</div>
              <div className="flex flex-wrap justify-center gap-8 opacity-70">
                {/* Logos de mercados-alvo */}
                <div className="h-6 w-20 bg-gradient-to-r from-foreground/80 to-foreground/60 rounded"></div>
                <div className="h-6 w-24 bg-gradient-to-r from-foreground/80 to-foreground/60 rounded"></div>
                <div className="h-6 w-16 bg-gradient-to-r from-foreground/80 to-foreground/60 rounded"></div>
                <div className="h-6 w-28 bg-gradient-to-r from-foreground/80 to-foreground/60 rounded"></div>
                <div className="h-6 w-22 bg-gradient-to-r from-foreground/80 to-foreground/60 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Problemas que resolvemos */}
        <section className="flex justify-center items-center relative w-full py-12 md:py-24 lg:py-32 border-t" id="solucoes">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full px-3 py-1 bg-primary/10 text-primary text-sm font-medium mb-4">
                Desafios Comuns
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight max-w-[800px] bg-gradient-to-r from-foreground to-foreground/70 text-transparent bg-clip-text">
                Você enfrenta algum destes desafios?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Empresas perdem milhões anualmente por não terem visibilidade sobre seus dados e métricas de negócio.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group border border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-colors duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Dados fragmentados</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Informações espalhadas em diferentes sistemas, dificultando a visão completa do negócio e a tomada de decisões.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-colors duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Decisões sem dados</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Tomada de decisões baseada em intuição em vez de métricas concretas, levando a resultados imprevisíveis e ineficientes.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-colors duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Integrações complexas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Dificuldade para conectar diferentes sistemas e coletar dados de múltiplas fontes, gerando silos de informação.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-colors duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Segurança vulnerável</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Preocupações com a proteção de dados e conformidade com regulamentações como LGPD, expondo a empresa a riscos.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-colors duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Análises superficiais</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Falta de profundidade nas análises e ausência de insights acionáveis baseados em inteligência artificial.
                  </p>
                </CardContent>
              </Card>
              <Card className="group border border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-colors duration-300 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Escalabilidade limitada</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Soluções que não acompanham o crescimento do seu negócio, tornando-se obsoletas e custosas com o tempo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Como resolvemos */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block">Nossa solução</Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Uma plataforma completa para suas métricas
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Métricas SaaS unifica seus dados, fornece insights valiosos e automatiza decisões baseadas em dados.
                </p>
              </div>
            </div>
            <div className="grid gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li className="flex gap-4 items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Webhooks customizáveis</h3>
                      <p className="text-muted-foreground">
                        Colete dados de qualquer fonte com nossos webhooks flexíveis e personalizáveis, sem precisar de
                        conhecimento técnico avançado.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Webhooks em tempo real</h3>
                      <p className="text-muted-foreground">
                        Receba notificações instantâneas quando eventos importantes ocorrerem, permitindo ações
                        imediatas.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Insights de IA avançados</h3>
                      <p className="text-muted-foreground">
                        Nossa inteligência artificial analisa seus dados e fornece recomendações acionáveis para
                        melhorar seu negócio.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Segurança de nível empresarial</h3>
                      <p className="text-muted-foreground">
                        Proteção de dados com criptografia de ponta a ponta, autenticação de dois fatores e conformidade
                        com LGPD.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[500px] overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                  <img
                    src="/placeholder.svg?height=500&width=700"
                    alt="Dashboard com análises"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="flex justify-center items-center relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-primary/5" id="como-funciona">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-full px-3 py-1 bg-primary/10 text-primary text-sm font-medium mb-6">
                Processo Simples
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight max-w-[800px] mb-4">
                Colete, processe e visualize dados em <span className="text-primary">4 etapas simples</span>
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-lg mb-12">
                Nossa plataforma foi desenhada para ser simples de integrar e poderosa nos resultados.
              </p>
            </div>
            
            <div className="relative">
              {/* Linha conectando os passos */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden lg:block"></div>
              
              <div className="mx-auto max-w-4xl space-y-16 lg:space-y-24 relative">
                {/* Passo 1 */}
                <div className="group relative">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="relative mb-8 lg:mb-0">
                      <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold text-xl shadow-lg z-10 lg:left-auto lg:right-0 lg:translate-x-1/2">1</div>
                      <div className="rounded-xl p-6 pb-8 bg-background border border-border shadow-lg relative z-0">
                        <h3 className="text-xl font-bold mb-3">Configure Webhooks</h3>
                        <p className="text-muted-foreground mb-4">
                          Crie webhooks personalizados e defina quais eventos você deseja monitorar em nossa interface intuitiva.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Interface low-code para fácil configuração</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Geração automática de tokens de segurança</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Personalização de quais dados coletar</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
                      <div className="bg-background/90 rounded-lg p-4 h-full">
                        <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-4xl text-primary/20">Ilustração</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passo 2 */}
                <div className="group relative">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="p-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg order-first lg:order-last">
                      <div className="bg-background/90 rounded-lg p-4 h-full">
                        <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-4xl text-primary/20">Ilustração</div>
                        </div>
                      </div>
                    </div>
                    <div className="relative mb-8 lg:mb-0">
                      <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold text-xl shadow-lg z-10 lg:right-auto lg:left-0 lg:-translate-x-1/2">2</div>
                      <div className="rounded-xl p-6 pb-8 bg-background border border-border shadow-lg relative z-0">
                        <h3 className="text-xl font-bold mb-3">Integre com seu Sistema</h3>
                        <p className="text-muted-foreground mb-4">
                          Adicione o código gerado ao seu site ou sistema para começar a capturar eventos importantes.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Código pronto para copiar e colar</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Suporte para diversas linguagens (JS, PHP, Python, etc.)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Exemplos de integrações comuns pré-configurados</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passo 3 */}
                <div className="group relative">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="relative mb-8 lg:mb-0">
                      <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold text-xl shadow-lg z-10 lg:left-auto lg:right-0 lg:translate-x-1/2">3</div>
                      <div className="rounded-xl p-6 pb-8 bg-background border border-border shadow-lg relative z-0">
                        <h3 className="text-xl font-bold mb-3">Processe e Armazene</h3>
                        <p className="text-muted-foreground mb-4">
                          Nosso sistema processa e armazena automaticamente os eventos recebidos para análises detalhadas.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Processamento de dados em tempo real</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Armazenamento seguro com criptografia</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Histórico completo para análises temporais</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
                      <div className="bg-background/90 rounded-lg p-4 h-full">
                        <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-4xl text-primary/20">Ilustração</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passo 4 */}
                <div className="group relative">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="p-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg order-first lg:order-last">
                      <div className="bg-background/90 rounded-lg p-4 h-full">
                        <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-4xl text-primary/20">Ilustração</div>
                        </div>
                      </div>
                    </div>
                    <div className="relative mb-8 lg:mb-0">
                      <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold text-xl shadow-lg z-10 lg:right-auto lg:left-0 lg:-translate-x-1/2">4</div>
                      <div className="rounded-xl p-6 pb-8 bg-background border border-border shadow-lg relative z-0">
                        <h3 className="text-xl font-bold mb-3">Visualize e Analise</h3>
                        <p className="text-muted-foreground mb-4">
                          Acesse dashboards interativos personalizáveis e obtenha insights valiosos para seu negócio.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Dashboards interativos e customizáveis</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Análises de tendências e previsões por IA</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Compartilhamento de relatórios entre times</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 px-8 h-12 shadow-lg shadow-primary/20">
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Casos de Uso */}
        <section className="flex justify-center items-center relative w-full py-16 md:py-24 lg:py-32 border-t">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full px-3 py-1 bg-primary/10 text-primary text-sm font-medium mb-4">
                Aplicações Práticas
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight max-w-[800px] bg-gradient-to-r from-foreground to-foreground/70 text-transparent bg-clip-text">
                Como diferentes times aproveitam nossa plataforma
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transforme dados em ações concretas para todas as áreas do seu negócio.
              </p>
            </div>
            
            <div className="grid gap-10 py-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-10">
                <div className="group relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 border border-border">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary/10 p-8 flex items-center justify-center md:w-1/3">
                      <div className="rounded-full bg-background p-4 shadow-md">
                        <LineChart className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Marketing</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Analise o comportamento dos usuários para criar campanhas mais eficazes. Identifique quais promoções geram mais conversões em diferentes períodos, como datas comemorativas, otimizando o ROI das campanhas.
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Mapeamento de jornada do cliente</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Otimização de campanhas em tempo real</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Análise de sazonalidade de produtos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 border border-border">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary/10 p-8 flex items-center justify-center md:w-1/3">
                      <div className="rounded-full bg-background p-4 shadow-md">
                        <Code className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Desenvolvimento</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Monitore logs de erro em tempo real para identificar e corrigir problemas antes que afetem muitos usuários. Rastreie o desempenho do seu sistema e otimize a experiência do usuário com base em dados reais.
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Monitoramento proativo de erros</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Análise de desempenho em tempo real</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Identificação de gargalos no sistema</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-10">
                <div className="group relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 border border-border">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary/10 p-8 flex items-center justify-center md:w-1/3">
                      <div className="rounded-full bg-background p-4 shadow-md">
                        <Bot className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Data Science</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Identifique padrões de uso e comportamento do cliente para gerar insights valiosos. Descubra correlações entre eventos diferentes e crie modelos preditivos para antecipar tendências de mercado.
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Modelagem preditiva de comportamentos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Segmentação avançada de clientes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Previsão de tendências de mercado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 border border-border">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary/10 p-8 flex items-center justify-center md:w-1/3">
                      <div className="rounded-full bg-background p-4 shadow-md">
                        <BarChart3 className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Design</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Otimize interfaces com base em dados reais de interação. Descubra quais elementos geram mais engajamento (como um botão verde recebendo mais cliques que um roxo) e crie experiências que realmente convertem.
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">A/B testing baseado em dados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Análise de heatmaps de interação</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">Otimização de jornadas de conversão</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center mt-12 pt-8 border-t border-border">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="block w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/70"></span>
                <span>Descubra como cada departamento pode se beneficiar</span>
              </div>
              <Link href="/register" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                Agende uma demonstração personalizada
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center" id="funcionalidades">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block" variant="secondary">
                  Funcionalidades
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Tudo que você precisa em um só lugar
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa plataforma oferece um conjunto completo de ferramentas para transformar seus dados em
                  resultados.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Dashboard Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize suas métricas mais importantes em dashboards interativos, com filtros personalizáveis e histórico temporal detalhado.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-primary" />
                    Webhooks Personalizáveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configure webhooks para capturar qualquer evento do seu sistema: compras, cadastros, logins, interações específicas ou logs de erro.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Integração Simplificada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Utilize nossos webhooks para integração direta nos seus sistemas, com código pronto para implementação e documentação detalhada.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Análise Preditiva com IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa IA identifica tendências, anomalias e oportunidades em seus dados, gerando previsões e recomendações acionáveis.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Segurança Avançada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Proteja seus dados com criptografia, tokens de acesso seguros para webhooks, além de controles de permissão granulares.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Colaboração entre Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Compartilhe insights e métricas com diferentes departamentos, permitindo que marketing, design, desenvolvimento e data science trabalhem juntos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Planos e preços */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center items-center" id="planos">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block">Planos Futuros</Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Planos pensados para o seu negócio
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Quando o Metrio for lançado, ofereceremos planos flexíveis para empresas de todos os tamanhos.
                </p>
              </div>
            </div>
            <div className="grid gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Beta</CardTitle>
                  <CardDescription>Para os primeiros entusiastas</CardDescription>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    Grátis<span className="text-lg font-normal text-muted-foreground">/3 meses</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Acesso antecipado a todas as funcionalidades</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Suporte preferencial da equipe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Influencie o desenvolvimento do produto</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>50% de desconto após o período beta</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full">Fazer pré-cadastro</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col border-primary relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Recomendado
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>Para empresas em crescimento</CardDescription>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    R$249<span className="text-lg font-normal text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>20 webhooks personalizáveis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Tipos de eventos ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>500.000 eventos/mês</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Dashboard avançado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Insights de IA básicos</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full">Reservar acesso</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>Para grandes empresas</CardDescription>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    Sob consulta
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Webhooks ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Tipos de eventos ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Eventos ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Dashboard personalizado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Integrações customizadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>SLA garantido</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/contact" className="w-full">
                    <Button variant="outline" className="w-full">Entre em contato</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Nossa Visão - substituindo Depoimentos */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center" id="visao">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block" variant="secondary">
                  Nossa Visão
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">O que nos inspira</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estamos construindo o Metrio para resolver problemas reais de empresas de todos os tamanhos.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-muted">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Um Futuro Data-Driven</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Acreditamos que decisões baseadas em dados transformam negócios. Nossa missão é tornar isso acessível para todas as empresas, independente do porte."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Simplicidade Técnica</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Queremos eliminar a complexidade técnica das integrações. Mesmo as equipes sem profundo conhecimento técnico merecem ferramentas poderosas de análise."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">IA ao seu Alcance</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Estamos desenvolvendo recursos de inteligência artificial que não apenas mostram dados, mas geram insights acionáveis para transformar seu negócio."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="inline-block">FAQ</Badge>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Perguntas frequentes</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Respostas para as dúvidas mais comuns sobre nossa plataforma.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4 py-12">
              <Card>
                <CardHeader>
                  <CardTitle>O que são webhooks e como eles funcionam na plataforma?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Webhooks são como "ouvintes" que você coloca no seu sistema para capturar eventos específicos. Na nossa plataforma, você configura um webhook, recebe um código para inserir no seu site/aplicação, e sempre que um evento ocorrer (como uma compra ou login), esse código envia automaticamente os dados para nossa plataforma, onde são processados e transformados em métricas.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Preciso ter conhecimento técnico para configurar os webhooks?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Não necessariamente. Nossa plataforma oferece uma interface low-code/no-code para configurar os webhooks, gerando automaticamente o código que você precisará inserir no seu sistema. Para implementações mais complexas, fornecemos documentação detalhada e exemplos para várias linguagens de programação, além de suporte técnico para ajudar na integração.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Como a integração entre times funciona na prática?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa plataforma centraliza dados de diferentes fontes, permitindo que cada equipe visualize as métricas relevantes para seu trabalho. Por exemplo, o time de design pode analisar o comportamento dos usuários em relação a elementos visuais, enquanto o marketing acompanha as taxas de conversão. Todos trabalham com os mesmos dados, mas com visões personalizadas que ajudam a tomar decisões mais eficazes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Como vocês garantem a segurança dos meus dados?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Utilizamos criptografia de ponta a ponta, tokens de autenticação exclusivos para cada webhook, e seguimos as melhores práticas de segurança. Somos compatíveis com LGPD e outras regulamentações de privacidade, e realizamos auditorias de segurança regulares para garantir a proteção dos seus dados.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quanto tempo leva para começar a ver resultados?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A maioria dos clientes começa a obter insights valiosos em menos de uma semana após a implementação. Uma vez que os webhooks estão configurados, os dados começam a fluir imediatamente. Nossa equipe de onboarding ajuda a configurar tudo rapidamente, e nossos dashboards pré-configurados fornecem valor desde o primeiro dia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Seja um dos primeiros a experimentar o Metrio
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estamos desenvolvendo algo especial. Faça seu pré-cadastro para acesso antecipado e bônus exclusivos.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-1">
                    Fazer pré-cadastro
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#visao">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Conheça nossa visão
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-primary-foreground/80">
                Os primeiros 100 usuários terão acesso vitalício ao plano Pro
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-6 md:py-12 flex justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <SquareGanttChart className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Metrio</span>
              </div>
              <p className="text-sm text-muted-foreground">Transformando dados em decisões de negócio.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#funcionalidades" className="text-muted-foreground hover:text-foreground">
                    Funcionalidades
                  </Link>
                </li>
                <li>
                  <Link href="#planos" className="text-muted-foreground hover:text-foreground">
                    Planos e preços
                  </Link>
                </li>
                <li>
                  <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Futura documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Próximos webinars
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Inscreva-se na newsletter
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Política de privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Termos de uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2023 Metrio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

