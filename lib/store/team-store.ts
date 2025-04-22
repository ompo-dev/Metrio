import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { toast } from "sonner";

// Interfaces para os objetos de equipe
export interface Team {
  id: string;
  name: string;
  description: string | null;
  iconColor: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  memberCount: number;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  role: string;
  joinedAt: string;
  projectMemberId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

// Interface para o estado da store
interface TeamState {
  // Estado
  teams: Team[];
  activeTeam: Team | null;
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;

  // Ações
  fetchTeams: (projectId: string) => Promise<void>;
  fetchTeam: (teamId: string) => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  createTeam: (
    name: string,
    projectId: string,
    description?: string,
    iconColor?: string
  ) => Promise<void>;
  updateTeam: (
    teamId: string,
    data: {
      name?: string;
      description?: string;
      iconColor?: string;
      isActive?: boolean;
    }
  ) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addTeamMember: (
    teamId: string,
    projectMemberId: string,
    role?: string
  ) => Promise<void>;
  updateTeamMemberRole: (
    teamId: string,
    memberId: string,
    role: string
  ) => Promise<void>;
  removeTeamMember: (teamId: string, memberId: string) => Promise<void>;
  setActiveTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      teams: [],
      activeTeam: null,
      teamMembers: [],
      isLoading: false,
      error: null,

      // Buscar equipes de um projeto
      fetchTeams: async (projectId: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const response = await api.get(
            `/api/projects/teams?projectId=${projectId}`
          );
          const data = response.data;

          set((state) => ({
            ...state,
            teams: data.teams || [],
            isLoading: false,
          }));
        } catch (error: any) {
          console.error("Erro ao buscar equipes:", error);
          set((state) => ({
            ...state,
            error: "Falha ao carregar equipes",
            isLoading: false,
          }));
          toast.error("Não foi possível carregar as equipes");
        }
      },

      // Buscar detalhes de uma equipe
      fetchTeam: async (teamId: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const response = await api.get(`/api/projects/teams/${teamId}`);
          const data = response.data;

          set((state) => ({
            ...state,
            activeTeam: data.team,
            isLoading: false,
          }));
        } catch (error: any) {
          console.error("Erro ao buscar detalhes da equipe:", error);
          set((state) => ({
            ...state,
            error: "Falha ao carregar detalhes da equipe",
            isLoading: false,
          }));
          toast.error("Não foi possível carregar os detalhes da equipe");
        }
      },

      // Buscar membros de uma equipe
      fetchTeamMembers: async (teamId: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const response = await api.get(
            `/api/projects/teams/${teamId}/members`
          );
          const data = response.data;

          set((state) => ({
            ...state,
            teamMembers: data.members || [],
            isLoading: false,
          }));
        } catch (error: any) {
          console.error("Erro ao buscar membros da equipe:", error);
          set((state) => ({
            ...state,
            error: "Falha ao carregar membros da equipe",
            isLoading: false,
          }));
          toast.error("Não foi possível carregar os membros da equipe");
        }
      },

      // Criar uma nova equipe
      createTeam: async (
        name: string,
        projectId: string,
        description?: string,
        iconColor?: string
      ) => {
        try {
          const response = await api.post("/api/projects/teams", {
            name,
            description,
            iconColor,
            projectId,
          });

          // Adicionar a nova equipe ao estado
          set((state) => ({
            ...state,
            teams: [...state.teams, response.data.team],
            error: null,
          }));

          toast.success("Equipe criada com sucesso");
        } catch (error: any) {
          console.error("Erro ao criar equipe:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao criar equipe";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
        }
      },

      // Atualizar uma equipe
      updateTeam: async (
        teamId: string,
        data: {
          name?: string;
          description?: string;
          iconColor?: string;
          isActive?: boolean;
        }
      ) => {
        try {
          const response = await api.patch(
            `/api/projects/teams/${teamId}`,
            data
          );
          const updatedTeam = response.data.team;

          // Atualizar o estado
          set((state) => ({
            ...state,
            teams: state.teams.map((team) =>
              team.id === teamId ? updatedTeam : team
            ),
            activeTeam:
              state.activeTeam?.id === teamId ? updatedTeam : state.activeTeam,
            error: null,
          }));

          toast.success("Equipe atualizada com sucesso");
        } catch (error: any) {
          console.error("Erro ao atualizar equipe:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao atualizar equipe";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
        }
      },

      // Excluir uma equipe
      deleteTeam: async (teamId: string) => {
        try {
          await api.delete(`/api/projects/teams/${teamId}`);

          // Remover a equipe do estado
          set((state) => ({
            ...state,
            teams: state.teams.filter((team) => team.id !== teamId),
            activeTeam:
              state.activeTeam?.id === teamId ? null : state.activeTeam,
            error: null,
          }));

          toast.success("Equipe removida com sucesso");
        } catch (error: any) {
          console.error("Erro ao excluir equipe:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao excluir equipe";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
        }
      },

      // Adicionar membro a uma equipe
      addTeamMember: async (
        teamId: string,
        projectMemberId: string,
        role: string = "member"
      ) => {
        try {
          const response = await api.post(
            `/api/projects/teams/${teamId}/members`,
            {
              projectMemberId,
              role,
            }
          );

          const newMember = response.data.member;

          // Adicionar o membro ao estado
          set((state) => ({
            ...state,
            teamMembers: [...state.teamMembers, newMember],
            // Atualizar a contagem de membros na equipe ativa
            activeTeam:
              state.activeTeam?.id === teamId
                ? {
                    ...state.activeTeam,
                    memberCount: (state.activeTeam.memberCount || 0) + 1,
                  }
                : state.activeTeam,
            // Atualizar a contagem de membros na lista de equipes
            teams: state.teams.map((team) =>
              team.id === teamId
                ? { ...team, memberCount: (team.memberCount || 0) + 1 }
                : team
            ),
            error: null,
          }));

          toast.success("Membro adicionado à equipe com sucesso");
        } catch (error: any) {
          console.error("Erro ao adicionar membro à equipe:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao adicionar membro à equipe";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
        }
      },

      // Atualizar a função de um membro na equipe
      updateTeamMemberRole: async (
        teamId: string,
        memberId: string,
        role: string
      ) => {
        try {
          const response = await api.patch(
            `/api/projects/teams/${teamId}/members/${memberId}`,
            {
              role,
            }
          );

          const updatedMember = response.data.member;

          // Atualizar o membro no estado
          set((state) => ({
            ...state,
            teamMembers: state.teamMembers.map((member) =>
              member.id === memberId ? updatedMember : member
            ),
            error: null,
          }));

          toast.success("Função do membro atualizada com sucesso");
        } catch (error: any) {
          console.error("Erro ao atualizar função do membro:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao atualizar função do membro";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
        }
      },

      // Remover um membro da equipe
      removeTeamMember: async (teamId: string, memberId: string) => {
        try {
          await api.delete(`/api/projects/teams/${teamId}/members/${memberId}`);

          // Remover o membro do estado
          set((state) => ({
            ...state,
            teamMembers: state.teamMembers.filter(
              (member) => member.id !== memberId
            ),
            // Atualizar a contagem de membros na equipe ativa
            activeTeam:
              state.activeTeam?.id === teamId
                ? {
                    ...state.activeTeam,
                    memberCount: Math.max(
                      (state.activeTeam.memberCount || 1) - 1,
                      0
                    ),
                  }
                : state.activeTeam,
            // Atualizar a contagem de membros na lista de equipes
            teams: state.teams.map((team) =>
              team.id === teamId
                ? {
                    ...team,
                    memberCount: Math.max((team.memberCount || 1) - 1, 0),
                  }
                : team
            ),
            error: null,
          }));

          toast.success("Membro removido da equipe com sucesso");
        } catch (error: any) {
          console.error("Erro ao remover membro da equipe:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao remover membro da equipe";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
        }
      },

      // Definir equipe ativa
      setActiveTeam: (team: Team | null) => {
        set((state) => ({ ...state, activeTeam: team }));
      },
    }),
    {
      name: "team-store", // Nome para o localStorage
      partialize: (state) => ({}), // Não persistir nada, sempre buscar do servidor
    }
  )
);
