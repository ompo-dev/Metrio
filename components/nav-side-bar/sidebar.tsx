import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Webhook,
  User,
  LineChart,
  Database,
  Shield,
  Brain
} from "lucide-react"

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Métricas",
      href: "/dashboard/metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Relatórios",
      href: "/dashboard/reports",
      icon: <LineChart className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Webhooks",
      href: "/dashboard/webhooks",
      icon: <Webhook className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Gestão de Dados",
      href: "/dashboard/data-management",
      icon: <Database className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Recursos de IA",
      href: "/dashboard/ai",
      icon: <Brain className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Segurança",
      href: "/dashboard/security",
      icon: <Shield className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Perfil",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
      variant: "ghost",
    },
    {
      title: "Configurações",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      variant: "ghost",
    },
  ],
} 