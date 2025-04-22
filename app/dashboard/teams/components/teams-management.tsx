"use client";

import * as React from "react";
import { Users, UserPlus, Shield, Briefcase } from "lucide-react";
import SelectIcon from "@/components/select-icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Importações dos componentes internos
import { TeamsList } from "./TeamsList";
import { MembersList } from "./MembersList";
import { PermissionsList } from "./PermissionsList";
import { RolesList } from "./RolesList";
import { InviteSection } from "./invite-section";

// Importações de stores e tipos
import { useMemberStore } from "@/lib/store/member-store";
import { useTeamStore } from "@/lib/store/team-store";
import { useProjectStore } from "@/lib/store/project-store";
import { permissionsData } from "./data";

// Definindo o tipo para as abas
type TabType = "todas" | "membros" | "permissoes" | "funcoes";

export function TeamsManagement({
  defaultTab = "todas",
}: {
  defaultTab?: TabType;
}) {
  // Estado para o controle de abas
  const [activeTab, setActiveTab] = React.useState<TabType>(
    defaultTab as TabType
  );

  // Obter estado e ações das stores
  const { members, roles, fetchMembers, fetchRoles, addRole } =
    useMemberStore();

  const { teams, fetchTeams, isLoading: isTeamsLoading } = useTeamStore();

  const { activeProject } = useProjectStore();

  // Estado local para controlar carregamento inicial
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);

  // Carregar dados quando o componente montar
  React.useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        if (activeProject?.id) {
          if (activeTab === "todas") {
            await fetchTeams(activeProject.id);
          }

          if (activeTab === "membros" || activeTab === "funcoes") {
            if (members.length === 0) {
              await fetchMembers();
            }
            if (roles.length === 0) {
              await fetchRoles();
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados necessários");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [
    activeTab,
    activeProject,
    fetchTeams,
    fetchMembers,
    fetchRoles,
    members.length,
    roles.length,
  ]);

  // Renderiza o conteúdo com base na tab ativa
  const renderContent = () => {
    switch (activeTab) {
      case "todas":
        return <TeamsList />;
      case "membros":
        return <MembersList />;
      case "permissoes":
        return <PermissionsList permissions={permissionsData} />;
      case "funcoes":
        return (
          <RolesList
            roles={roles}
            permissions={permissionsData}
            onAddRole={addRole}
          />
        );
      default:
        return <TeamsList />;
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
        {isInitialLoading ? (
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
