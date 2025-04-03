"use client"

import type * as React from "react"
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
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@metricas.com",
    avatar: "/avatars/admin.jpg",
  },
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
  ],
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
        }
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
        }
        
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
        }
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
        }
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
        {
          title: "Membros",
          url: "/dashboard/teams/members",
        },
        {
          title: "Permissões",
          url: "/dashboard/teams/permissions",
        },
        {
          title: "Desempenho",
          url: "/dashboard/teams/performance",
        },
        {
          title: "Convidar Membros",
          url: "/dashboard/teams/invite",
        }
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
        }
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
        }
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
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

