import { Team, Member, Role, Permission } from "./types";

// Dados de exemplo para equipes
export const teamsData: Team[] = [
  {
    id: "1",
    name: "Métricas SaaS",
    members: 12,
    plan: "Enterprise",
    lastActive: "Hoje",
  },
  {
    id: "2",
    name: "Acme Corp.",
    members: 8,
    plan: "Startup",
    lastActive: "Ontem",
  },
  {
    id: "3",
    name: "Tech Solutions",
    members: 5,
    plan: "Free",
    lastActive: "3 dias atrás",
  },
];

// Dados de exemplo para membros
export const membersData: Member[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@metricas.com",
    role: "Gerente de Produto",
    status: "Ativo",
    lastActive: "Agora",
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos@metricas.com",
    role: "Desenvolvedor Full-stack",
    status: "Ativo",
    lastActive: "Há 2 horas",
  },
  {
    id: "3",
    name: "Juliana Mendes",
    email: "juliana@metricas.com",
    role: "Designer UX/UI",
    status: "Ativo",
    lastActive: "Ontem",
  },
  {
    id: "4",
    name: "Roberto Santos",
    email: "roberto@metricas.com",
    role: "QA Tester",
    status: "Inativo",
    lastActive: "2 semanas atrás",
  },
];

// Dados de exemplo para funções
export const rolesData: Role[] = [
  {
    id: "1",
    name: "Gerente de Produto",
    description:
      "Responsável por planejar e coordenar o desenvolvimento de produtos",
    members: 3,
  },
  {
    id: "2",
    name: "Desenvolvedor Full-stack",
    description: "Trabalha com desenvolvimento frontend e backend",
    members: 5,
  },
  {
    id: "3",
    name: "Designer UX/UI",
    description: "Responsável pela experiência do usuário e design visual",
    members: 2,
  },
  {
    id: "4",
    name: "QA Tester",
    description: "Realiza testes de qualidade e reporta bugs",
    members: 2,
  },
  {
    id: "5",
    name: "Analista de Dados",
    description: "Analisa dados e produz relatórios e insights",
    members: 1,
  },
];

// Dados de exemplo para permissões
export const permissionsData: Permission[] = [
  {
    id: "1",
    name: "Dashboard",
    description: "Acesso ao dashboard principal e métricas",
    roles: ["Todos"],
  },
  {
    id: "2",
    name: "Gerenciamento de Usuários",
    description: "Adicionar, remover e editar usuários",
    roles: ["Gerente de Produto", "Admin"],
  },
  {
    id: "3",
    name: "Gerenciamento de Equipes",
    description: "Criar e gerenciar equipes",
    roles: ["Gerente de Produto", "Admin"],
  },
  {
    id: "4",
    name: "Acesso a API",
    description: "Gerar e gerenciar chaves de API",
    roles: ["Desenvolvedor Full-stack", "Admin"],
  },
  {
    id: "5",
    name: "Acesso a Dados Sensíveis",
    description: "Visualizar e exportar dados sensíveis",
    roles: ["Gerente de Produto", "Analista de Dados", "Admin"],
  },
  {
    id: "6",
    name: "Ferramentas de Design",
    description: "Acesso a ferramentas de design e protótipos",
    roles: ["Designer UX/UI", "Admin"],
  },
];
