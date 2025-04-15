"use client";

import * as React from "react";
import { Users, UserPlus, Shield, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export function TeamsManagement({
  defaultTab = "todas",
}: TeamsManagementProps) {
  // Estados para armazenar os dados
  const [teams, setTeams] = React.useState(initialTeamsData);
  const [members, setMembers] = React.useState(initialMembersData);
  const [roles, setRoles] = React.useState(initialRolesData);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Equipes
        </h2>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">
            <Users className="h-4 w-4 mr-2" />
            Equipes
          </TabsTrigger>
          <TabsTrigger value="membros">
            <UserPlus className="h-4 w-4 mr-2" />
            Membros
          </TabsTrigger>
          <TabsTrigger value="permissoes">
            <Shield className="h-4 w-4 mr-2" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="funcoes">
            <Briefcase className="h-4 w-4 mr-2" />
            Funções
          </TabsTrigger>
        </TabsList>

        {/* Aba de Equipes */}
        <TabsContent value="todas" className="space-y-4">
          <TeamsList teams={teams} onAddTeam={handleAddTeam} />
        </TabsContent>

        {/* Aba de Membros */}
        <TabsContent value="membros" className="space-y-4">
          <MembersList
            members={members}
            roles={roles}
            onAddMember={handleAddMember}
          />
        </TabsContent>

        {/* Aba de Permissões */}
        <TabsContent value="permissoes" className="space-y-4">
          <PermissionsList permissions={permissionsData} />
        </TabsContent>

        {/* Aba de Funções */}
        <TabsContent value="funcoes" className="space-y-4">
          <RolesList
            roles={roles}
            permissions={permissionsData}
            onAddRole={handleAddRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
