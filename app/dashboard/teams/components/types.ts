// Tipos para o sistema de gerenciamento de equipes
import {
  Users,
  UsersRound,
  UserPlus,
  User,
  UserCheck,
  UserCircle,
  UserCog,
  UserCog2,
  Code,
  CodeXml,
  FileCode,
  Server,
  Database,
  Bot,
  ShieldCheck,
  Figma,
  Paintbrush,
  LayoutGrid,
  LineChart,
  PieChart,
  Search,
  Brain,
  Microscope,
  Megaphone,
  Presentation,
  HeartHandshake,
  BookOpen,
  Briefcase,
  Lightbulb,
  Coffee,
  Building,
  LucideIcon,
} from "lucide-react";

export interface Team {
  id: string;
  name: string;
  members: number;
  plan?: string;
  lastActive: string;
}

export interface Member {
  id: string; // ID único para a lista (pode ser um formato especial como "member-123")
  userId?: string; // ID real do usuário para referência
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  members: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: string[];
}

export interface TeamsManagementProps {
  defaultTab?: "todas" | "membros" | "permissoes" | "funcoes";
}

export interface TeamListProps {
  teams: Team[];
  onAddTeam: (teamName: string) => void;
}

export interface MemberListProps {
  members: Member[];
  roles: Role[];
  onAddMember: (name: string, email: string, role: string) => Promise<void>;
  onUpdateRole: (memberId: string, newRole: string) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onRemoveMembers: (memberIds: string[]) => Promise<{ removedCount: number }>;
}

export interface PermissionListProps {
  permissions: Permission[];
  onAddPermission?: () => void;
}

export interface RoleListProps {
  roles: Role[];
  permissions: Permission[];
  onAddRole: (name: string, description: string, permissions: string[]) => void;
}

// Definição de ícones para equipes
export const TEAM_ICONS = [
  // Genéricos
  { icon: Users, name: "users" },
  { icon: UsersRound, name: "users-round" },
  { icon: UserPlus, name: "user-plus" },

  // Desenvolvimento e Tecnologia
  { icon: Code, name: "code" },
  { icon: CodeXml, name: "code-xml" },
  { icon: FileCode, name: "file-code" },
  { icon: Server, name: "server" },
  { icon: Database, name: "database" },
  { icon: Bot, name: "bot" },
  { icon: ShieldCheck, name: "shield-check" },

  // Design e UI/UX
  { icon: Figma, name: "figma" },
  { icon: Paintbrush, name: "paintbrush" },
  { icon: LayoutGrid, name: "layout-grid" },

  // Dados e Análise
  { icon: LineChart, name: "line-chart" },
  { icon: PieChart, name: "pie-chart" },
  { icon: Search, name: "search" },
  { icon: Brain, name: "brain" },
  { icon: Microscope, name: "microscope" },

  // Marketing, RH e Gestão
  { icon: Megaphone, name: "megaphone" },
  { icon: Presentation, name: "presentation" },
  { icon: HeartHandshake, name: "heart-handshake" },
  { icon: BookOpen, name: "book-open" },
  { icon: Briefcase, name: "briefcase" },
  { icon: UserCog, name: "user-cog" },
  { icon: UserCog2, name: "user-cog-2" },
  { icon: Lightbulb, name: "lightbulb" },

  // Outros
  { icon: Coffee, name: "coffee" },
  { icon: Building, name: "building" },
  { icon: User, name: "user" },
  { icon: UserCheck, name: "user-check" },
  { icon: UserCircle, name: "user-circle" },
];

// Função auxiliar para obter o ícone de uma equipe
export const getTeamIcon = (logoIcon: string): LucideIcon => {
  const iconItem = TEAM_ICONS.find((item) => item.name === logoIcon);
  return iconItem?.icon || Users;
};
