import {
  Bot,
  Command,
  GalleryVerticalEnd,
  Home,
  Settings2,
  Shield,
  SquareTerminal,
  Webhook,
  Database,
  BookOpen,
  Users,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items: {
    title: string;
    url: string;
  }[];
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

// Estrutura de navegação compartilhada
export const navData = {
  user: {
    name: "Admin",
    email: "admin@metricas.com",
    avatar: "/avatars/admin.jpg",
  } as User,
  teams: [
    {
      name: "Métricas SaaS",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: Command,
      plan: "Startup",
    },
    {
      name: "Tech Solutions",
      logo: SquareTerminal,
      plan: "Free",
    },
  ] as Team[],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Painel Principal",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Webhooks",
      url: "/dashboard/webhooks",
      icon: Webhook,
      items: [
        {
          title: "Gerenciador de Webhooks",
          url: "/dashboard/webhooks",
        },
        {
          title: "Criar Webhook",
          url: "/dashboard/webhooks/new",
        },
        {
          title: "Testador",
          url: "/dashboard/webhooks/tester",
        },
        {
          title: "Integrações",
          url: "/dashboard/webhooks/integrations",
        },
        {
          title: "Automatizações",
          url: "/dashboard/webhooks/automations",
        },
      ],
    },
    {
      title: "IA & Insights",
      url: "/dashboard/ai-insights",
      icon: Bot,
      items: [
        {
          title: "Recursos de IA",
          url: "/dashboard/ai-insights",
        },
        {
          title: "Recursos",
          url: "/dashboard/ai-insights/resources",
        },
      ],
    },
    {
      title: "Gestão de Dados",
      url: "/dashboard/data-management",
      icon: Database,
      items: [
        {
          title: "Banco de Dados",
          url: "/dashboard/data-management",
        },
      ],
    },
    {
      title: "Equipes",
      url: "/dashboard/teams",
      icon: Users,
      items: [
        {
          title: "Gerenciamento de Equipes",
          url: "/dashboard/teams",
        },
      ],
    },
    {
      title: "Segurança",
      url: "/dashboard/security",
      icon: Shield,
      items: [
        {
          title: "Proteção e Acesso",
          url: "/dashboard/security",
        },
      ],
    },
    {
      title: "Documentação",
      url: "/dashboard/documentation",
      icon: BookOpen,
      items: [
        {
          title: "Guias e Tutoriais",
          url: "/dashboard/documentation",
        },
      ],
    },
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Preferências do Sistema",
          url: "/dashboard/settings",
        },
      ],
    },
  ] as NavItem[],
};
