// Tipos para o sistema de gerenciamento de equipes

export interface Team {
  id: string;
  name: string;
  members: number;
  plan?: string;
  lastActive: string;
}

export interface Member {
  id: string;
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
  onAddMember: (name: string, email: string, role: string) => void;
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
