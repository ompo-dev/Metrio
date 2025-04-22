"use client";

import * as React from "react";
import { Users, UserPlus, Shield, Briefcase } from "lucide-react";
import SelectIcon from "@/components/select-icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

// Importações dos componentes internos
import { TeamsList } from "./TeamsList";
import { MembersList } from "./MembersList";
import { PermissionsList } from "./PermissionsList";
import { RolesList } from "./RolesList";
import { InviteSection } from "./invite-section";

// Importações de dados e tipos
import { TeamsManagementProps, Team, Member, Role } from "./types";
import { teamsData as initialTeamsData, permissionsData } from "./data";

// Definindo o tipo para as abas
type TabType = "todas" | "membros" | "permissoes" | "funcoes";

export function TeamsManagement({
  defaultTab = "todas",
}: TeamsManagementProps) {
  // Estados para armazenar os dados
  const [teams, setTeams] = React.useState(initialTeamsData);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [activeTab, setActiveTab] = React.useState<TabType>(
    defaultTab as TabType
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Buscar membros do projeto atual
  const fetchMembers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/projects/members");
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
      toast.error("Não foi possível carregar os membros do projeto");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar funções disponíveis
  const fetchRoles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/projects/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Erro ao buscar funções:", error);
      toast.error("Não foi possível carregar as funções disponíveis");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar dados quando a aba mudar para "membros"
  React.useEffect(() => {
    if (activeTab === "membros") {
      fetchMembers();
      fetchRoles();
    }
  }, [activeTab, fetchMembers, fetchRoles]);

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
  const handleAddMember = async (name: string, email: string, role: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("/api/projects/members", {
        name,
        email,
        role,
      });

      // Adicionar o novo membro ao estado
      setMembers([...members, response.data]);
      toast.success("Membro adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao adicionar membro:", error);
      toast.error(error.response?.data?.error || "Erro ao adicionar membro");
    } finally {
      setIsLoading(false);
    }
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
      {/* Seção de Convites */}
      <InviteSection />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Gerenciamento de Equipes</h2>
          <div className="ml-2">
            <SelectIcon
              defaultValue={activeTab}
              options={[
                {
                  value: "todas",
                  label: "Equipes",
                  icon: <Users className="h-4 w-4" />,
                },
                {
                  value: "membros",
                  label: "Membros",
                  icon: <UserPlus className="h-4 w-4" />,
                },
                {
                  value: "permissoes",
                  label: "Permissões",
                  icon: <Shield className="h-4 w-4" />,
                },
                {
                  value: "funcoes",
                  label: "Funções",
                  icon: <Briefcase className="h-4 w-4" />,
                },
              ]}
              onChange={(value) => {
                setActiveTab(value as TabType);
              }}
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

      <div className="space-y-4">
        {isLoading && activeTab === "membros" ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
