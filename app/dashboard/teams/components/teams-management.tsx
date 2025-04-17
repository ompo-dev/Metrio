"use client";

import * as React from "react";
import { Users, UserPlus, Shield, Briefcase } from "lucide-react";
import { BreadcrumbSelect } from "@/components/breadcrumb-select/breadcrumb-select";
import { Button } from "@/components/ui/button";

// Importações dos componentes internos
import { TeamsList } from "./TeamsList";
import { MembersList } from "./MembersList";
import { PermissionsList } from "./PermissionsList";
import { RolesList } from "./RolesList";

// Importações de dados e tipos
import { TeamsManagementProps, Team, Member, Role } from "./types";
import {
  teamsData as initialTeamsData,
  membersData as initialMembersData,
  rolesData as initialRolesData,
  permissionsData,
} from "./data";

// Definindo o tipo para as abas
type TabType = "todas" | "membros" | "permissoes" | "funcoes";

export function TeamsManagement({
  defaultTab = "todas",
}: TeamsManagementProps) {
  // Estados para armazenar os dados
  const [teams, setTeams] = React.useState(initialTeamsData);
  const [members, setMembers] = React.useState(initialMembersData);
  const [roles, setRoles] = React.useState(initialRolesData);
  const [activeTab, setActiveTab] = React.useState<TabType>(
    defaultTab as TabType
  );

  // Função para obter o ícone ativo com base na aba selecionada
  const getActiveIcon = () => {
    switch (activeTab) {
      case "todas":
        return <Users className="h-4 w-4" />;
      case "membros":
        return <UserPlus className="h-4 w-4" />;
      case "permissoes":
        return <Shield className="h-4 w-4" />;
      case "funcoes":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Função para adicionar nova equipe
  const handleAddTeam = (name: string) => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      members: 0,
      lastActive: "Agora",
    };
    setTeams([...teams, newTeam]);
  };

  // Função para adicionar novo membro
  const handleAddMember = (name: string, email: string, role: string) => {
    const newMember: Member = {
      id: `member-${Date.now()}`,
      name,
      email,
      role,
      status: "Ativo",
      lastActive: "Agora",
    };
    setMembers([...members, newMember]);
  };

  // Função para adicionar nova função
  const handleAddRole = (
    name: string,
    description: string,
    permissions: string[]
  ) => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name,
      description,
      members: 0,
    };
    setRoles([...roles, newRole]);
  };

  // Renderiza o conteúdo com base na tab ativa
  const renderContent = () => {
    switch (activeTab) {
      case "todas":
        return <TeamsList teams={teams} onAddTeam={handleAddTeam} />;
      case "membros":
        return (
          <MembersList
            members={members}
            roles={roles}
            onAddMember={handleAddMember}
          />
        );
      case "permissoes":
        return <PermissionsList permissions={permissionsData} />;
      case "funcoes":
        return (
          <RolesList
            roles={roles}
            permissions={permissionsData}
            onAddRole={handleAddRole}
          />
        );
      default:
        return <TeamsList teams={teams} onAddTeam={handleAddTeam} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Gerenciamento de Equipes</h2>
          <div className="ml-2">
            <BreadcrumbSelect
              items={[
                {
                  icon: getActiveIcon(),
                  isSelect: true,
                  label: "Visualização",
                  selectProps: {
                    defaultValue: activeTab,
                    options: [
                      { value: "todas", label: "Equipes" },
                      { value: "membros", label: "Membros" },
                      { value: "permissoes", label: "Permissões" },
                      { value: "funcoes", label: "Funções" },
                    ],
                    onChange: (value) => {
                      setActiveTab(value as TabType);
                    },
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 md:hidden">
        <Button
          variant={activeTab === "todas" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("todas")}
        >
          <Users className="h-4 w-4 mr-2" />
          Equipes
        </Button>
        <Button
          variant={activeTab === "membros" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("membros")}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Membros
        </Button>
        <Button
          variant={activeTab === "permissoes" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("permissoes")}
        >
          <Shield className="h-4 w-4 mr-2" />
          Permissões
        </Button>
        <Button
          variant={activeTab === "funcoes" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("funcoes")}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Funções
        </Button>
      </div>

      <div className="space-y-4">{renderContent()}</div>
    </div>
  );
}
