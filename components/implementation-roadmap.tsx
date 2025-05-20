"use client";
import { CheckCircle2, Circle, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ImplementationRoadmap() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Plano de Implementação Estratégico
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Um roadmap faseado para implementação das novas funcionalidades da
          plataforma Metrio
        </p>
      </div>

      <Tabs defaultValue="phase1" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="phase1">
            Fase 1<br />
            (Q1-Q2 2024)
          </TabsTrigger>
          <TabsTrigger value="phase2">
            Fase 2<br />
            (Q3-Q4 2024)
          </TabsTrigger>
          <TabsTrigger value="phase3">
            Fase 3<br />
            (Q1-Q2 2025)
          </TabsTrigger>
          <TabsTrigger value="phase4">
            Fase 4<br />
            (Q3-Q4 2025)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phase1">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PhaseCard
              title="Análise Avançada e IA"
              description="Implementação dos primeiros recursos de IA e análise preditiva"
              progress={15}
              features={[
                {
                  name: "Assistente Virtual de Análise (MVP)",
                  status: "in-progress",
                },
                { name: "Detecção Básica de Anomalias", status: "planned" },
                { name: "Resumos Automáticos Semanais", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Integrações Expandidas"
              description="Ampliação das possibilidades de conexão com outras plataformas"
              progress={25}
              features={[
                {
                  name: "5 Novos Conectores Pré-construídos",
                  status: "in-progress",
                },
                { name: "Webhooks Bidirecionais", status: "planned" },
                { name: "API Pública Documentada", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Experiência do Usuário"
              description="Melhorias na experiência e onboarding de usuários"
              progress={30}
              features={[
                { name: "Onboarding Personalizado", status: "in-progress" },
                { name: "Temas Personalizáveis", status: "planned" },
                { name: "Biblioteca de Casos de Uso", status: "planned" },
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="phase2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PhaseCard
              title="Colaboração e Compartilhamento"
              description="Recursos para trabalho em equipe e compartilhamento de insights"
              progress={0}
              features={[
                { name: "Dashboards Compartilhados", status: "planned" },
                { name: "Comentários e Anotações", status: "planned" },
                { name: "Relatórios Programados", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Análise Preditiva Avançada"
              description="Expansão dos recursos de IA e previsão"
              progress={0}
              features={[
                { name: "Previsão de Tendências", status: "planned" },
                { name: "Análise de Coorte Avançada", status: "planned" },
                { name: "Integração com OpenAI", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Experiência Mobile"
              description="Recursos dedicados para dispositivos móveis"
              progress={0}
              features={[
                { name: "App Móvel (iOS/Android)", status: "planned" },
                { name: "Alertas Móveis Contextuais", status: "planned" },
                {
                  name: "Dashboards Otimizados para Mobile",
                  status: "planned",
                },
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="phase3">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PhaseCard
              title="Segurança e Conformidade"
              description="Recursos avançados de segurança e conformidade regulatória"
              progress={0}
              features={[
                { name: "Catálogo de Dados", status: "planned" },
                {
                  name: "Painéis de Conformidade LGPD/GDPR",
                  status: "planned",
                },
                { name: "Anonimização Automática", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Marketplace e Extensibilidade"
              description="Ecossistema de plugins e extensões"
              progress={0}
              features={[
                { name: "Marketplace de Plugins", status: "planned" },
                { name: "Templates de Dashboard", status: "planned" },
                { name: "Widgets Personalizados", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Automação Avançada"
              description="Fluxos de trabalho e automações personalizadas"
              progress={0}
              features={[
                {
                  name: "Fluxos de Trabalho Personalizados",
                  status: "planned",
                },
                { name: "Ações Programáveis", status: "planned" },
                { name: "Integração com Zapier/Make", status: "planned" },
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="phase4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PhaseCard
              title="Verticais Especializadas"
              description="Soluções específicas para diferentes indústrias"
              progress={0}
              features={[
                { name: "Módulo E-commerce", status: "planned" },
                { name: "Módulo SaaS", status: "planned" },
                { name: "Módulo Aplicativos Móveis", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Benchmarking de Indústria"
              description="Comparação com métricas de mercado e concorrentes"
              progress={0}
              features={[
                { name: "Comparação com Concorrentes", status: "planned" },
                { name: "Tendências de Mercado", status: "planned" },
                { name: "Previsões de Indústria", status: "planned" },
              ]}
            />
            <PhaseCard
              title="Monetização para Clientes"
              description="Ferramentas para clientes monetizarem seus dados"
              progress={0}
              features={[
                { name: "Marketplace de Dados", status: "planned" },
                { name: "APIs como Produto", status: "planned" },
                { name: "Análise de Receita Avançada", status: "planned" },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Critérios de Priorização</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-medium mb-2">Impacto no Usuário</h3>
            <p className="text-sm text-muted-foreground">
              Prioridade para funcionalidades que trazem benefício imediato aos
              usuários existentes
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-medium mb-2">Complexidade Técnica</h3>
            <p className="text-sm text-muted-foreground">
              Balanceamento entre valor entregue e esforço de desenvolvimento
              necessário
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-medium mb-2">Diferenciação Competitiva</h3>
            <p className="text-sm text-muted-foreground">
              Foco em recursos que destacam a plataforma da concorrência
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-medium mb-2">Feedback dos Usuários</h3>
            <p className="text-sm text-muted-foreground">
              Adaptação contínua baseada em pesquisas e feedback dos clientes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PhaseCardProps {
  title: string;
  description: string;
  progress: number;
  features: {
    name: string;
    status: "completed" | "in-progress" | "planned";
  }[];
}

function PhaseCard({ title, description, progress, features }: PhaseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature.name} className="flex items-start gap-2">
              {feature.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              ) : feature.status === "in-progress" ? (
                <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div>
                <div className="font-medium">{feature.name}</div>
                <div className="text-xs text-muted-foreground">
                  {feature.status === "completed" ? (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      Concluído
                    </Badge>
                  ) : feature.status === "in-progress" ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-500"
                    >
                      Em Progresso
                    </Badge>
                  ) : (
                    <Badge variant="outline">Planejado</Badge>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
