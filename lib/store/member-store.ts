import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { toast } from "sonner";

// Interface para membros
export interface Member {
  id: string; // ID único para a lista (ex: "member-123")
  userId?: string; // ID real do usuário para referência
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

// Interface para roles/funções
export interface Role {
  id: string;
  name: string;
  description: string;
  members: number;
}

// Interface da store
interface MemberState {
  // Estado
  members: Member[];
  roles: Role[];
  isLoading: boolean;
  error: string | null;

  // Ações
  fetchMembers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  addMember: (name: string, email: string, role: string) => Promise<void>;
  updateMemberRole: (memberId: string, newRole: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  removeManyMembers: (memberIds: string[]) => Promise<{ removedCount: number }>;
  addRole: (
    name: string,
    description: string,
    permissions: string[]
  ) => Promise<void>;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      members: [],
      roles: [],
      isLoading: false,
      error: null,

      // Buscar membros
      fetchMembers: async () => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const response = await api.get("/api/projects/members");
          const members = response.data;

          set((state) => ({ ...state, members, isLoading: false }));
        } catch (error) {
          console.error("Erro ao buscar membros:", error);
          set((state) => ({
            ...state,
            error: "Falha ao carregar membros",
            isLoading: false,
          }));
          toast.error("Não foi possível carregar os membros do projeto");
        }
      },

      // Buscar funções/roles
      fetchRoles: async () => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          const response = await api.get("/api/projects/roles");
          const roles = response.data;

          set((state) => ({ ...state, roles, isLoading: false }));
        } catch (error) {
          console.error("Erro ao buscar funções:", error);
          set((state) => ({
            ...state,
            error: "Falha ao carregar funções",
            isLoading: false,
          }));
          toast.error("Não foi possível carregar as funções disponíveis");
        }
      },

      // Adicionar membro
      addMember: async (name: string, email: string, role: string) => {
        try {
          // Não definimos isLoading como true para evitar recarregamento da tabela

          const response = await api.post("/api/projects/members", {
            name,
            email,
            role,
          });

          // Adicionar o novo membro ao estado
          set((state) => ({
            members: [...state.members, response.data],
            error: null,
          }));

          toast.success("Membro adicionado com sucesso!");
        } catch (error: any) {
          console.error("Erro ao adicionar membro:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao adicionar membro";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // Atualizar função de um membro
      updateMemberRole: async (memberId: string, newRole: string) => {
        try {
          // Não definimos isLoading como true para evitar recarregamento da tabela

          // Chamar API para atualizar a função do membro
          await api.patch(`/api/projects/members/${memberId}`, {
            role: newRole,
          });

          // Atualizar o estado local imediatamente sem recarregar dados
          set((state) => ({
            members: state.members.map((member) =>
              member.id === memberId ? { ...member, role: newRole } : member
            ),
            error: null,
          }));

          // Não mostramos o toast aqui pois já está sendo mostrado no MembersList
        } catch (error: any) {
          console.error("Erro ao atualizar função do membro:", error);
          const errorMessage =
            error.response?.data?.error ||
            (Array.isArray(error.response?.data?.errors)
              ? error.response.data.errors.join(", ")
              : "Erro ao atualizar função do membro");

          set((state) => ({ ...state, error: errorMessage }));
          throw new Error(errorMessage);
        }
      },

      // Remover um membro
      removeMember: async (memberId: string) => {
        try {
          // Não definimos isLoading como true para evitar recarregamento da tabela

          // Chamar API para remover o membro
          await api.delete(`/api/projects/members/${memberId}`);

          // Atualizar o estado local
          set((state) => ({
            members: state.members.filter((member) => member.id !== memberId),
            error: null,
          }));

          // Toast já é mostrado no componente MembersList
        } catch (error: any) {
          console.error("Erro ao remover membro:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao remover membro";

          set((state) => ({ ...state, error: errorMessage }));
          throw new Error(errorMessage);
        }
      },

      // Remover múltiplos membros
      removeManyMembers: async (memberIds: string[]) => {
        try {
          // Não definimos isLoading como true para evitar recarregamento da tabela

          // Chamar API para remover vários membros
          const response = await api.post("/api/projects/members/[...params]", {
            memberIds,
          });

          // Atualizar o estado local
          set((state) => ({
            members: state.members.filter(
              (member) => !memberIds.includes(member.id)
            ),
            error: null,
          }));

          // Toast já é mostrado no componente MembersList
          return {
            removedCount: response.data.removedCount || memberIds.length,
          };
        } catch (error: any) {
          console.error("Erro ao remover membros:", error);
          const errorMessage =
            error.response?.data?.error ||
            (error.response?.data?.errors
              ? error.response.data.errors.join(", ")
              : "Erro ao remover membros");

          set((state) => ({ ...state, error: errorMessage }));
          throw new Error(errorMessage);
        }
      },

      // Adicionar nova função/role
      addRole: async (
        name: string,
        description: string,
        permissions: string[]
      ) => {
        try {
          // Não definimos isLoading como true para evitar recarregamento da tabela

          // Em uma implementação completa, chamaríamos a API
          // const response = await api.post("/api/projects/roles", {
          //   name,
          //   description,
          //   permissions
          // });

          // Por enquanto, apenas atualizamos o estado local com uma geração de ID simples
          const newRole: Role = {
            id: `role-${Date.now()}`,
            name,
            description,
            members: 0,
          };

          // Adicionar ao estado
          set((state) => ({
            roles: [...state.roles, newRole],
            error: null,
          }));

          toast.success("Função adicionada com sucesso!");
        } catch (error: any) {
          console.error("Erro ao adicionar função:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao adicionar função";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "member-store", // Nome para o localStorage
      partialize: (state) => ({}), // Não persistir nada, sempre buscar do servidor
    }
  )
);
