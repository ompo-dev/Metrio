import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { toast } from "sonner";

// Interface para convites
export interface Invite {
  id: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  inviteToken: string;
  createdAt: string;
  expiresAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  recipient?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

// Interface da store
interface InviteState {
  // Estado
  invites: Invite[];
  isLoading: boolean;
  error: string | null;
  inviteLink: string;
  linkCopied: boolean;

  // Ações
  fetchInvites: (projectId?: string) => Promise<void>;
  sendEmailInvite: (email: string, projectId?: string) => Promise<void>;
  generateInviteLink: (projectId?: string) => Promise<string>;
  deleteInvite: (inviteId: string) => Promise<void>;
  deleteManyInvites: (inviteIds: string[]) => Promise<{ removedCount: number }>;
  copyLinkToClipboard: (link: string) => Promise<void>;
  resetLinkCopied: () => void;
}

export const useInviteStore = create<InviteState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      invites: [],
      isLoading: false,
      error: null,
      inviteLink: "",
      linkCopied: false,

      // Buscar convites
      fetchInvites: async (projectId?: string) => {
        try {
          set((state) => ({ ...state, isLoading: true, error: null }));

          // Construir URL com projectId se fornecido
          const url = projectId
            ? `/api/projects/invite?projectId=${projectId}`
            : `/api/projects/invite`;

          const response = await api.get(url);
          const data = response.data;

          // Ordenar os convites por data de criação (mais recentes primeiro)
          const sortedInvites = [...(data.invites || [])].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          set((state) => ({
            ...state,
            invites: sortedInvites,
            isLoading: false,
          }));
        } catch (error: any) {
          console.error("Erro ao buscar convites:", error);
          set((state) => ({
            ...state,
            error: "Falha ao carregar convites",
            isLoading: false,
          }));
          toast.error("Não foi possível carregar os convites");
        }
      },

      // Enviar convite por email
      sendEmailInvite: async (email: string, projectId?: string) => {
        try {
          // Sem definir isLoading para evitar recarregamento completo

          const response = await api.post("/api/projects/invite", {
            email: email.trim(),
            projectId,
          });

          // Adicionar o novo convite diretamente ao estado
          if (response.data && response.data.invite) {
            const newInvite = response.data.invite;
            set((state) => {
              // Ordenar os convites por data de criação (mais recentes primeiro)
              const updatedInvites = [newInvite, ...state.invites];
              return {
                ...state,
                invites: updatedInvites,
                error: null,
              };
            });
          }

          toast.success("Convite enviado com sucesso!");
          return response.data;
        } catch (error: any) {
          console.error("Erro ao enviar convite:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao enviar convite";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // Gerar link de convite
      generateInviteLink: async (projectId?: string) => {
        try {
          // Sem definir isLoading para evitar recarregamento completo

          const response = await api.post("/api/projects/invite", {
            email: `Aguardando uso do link de convite`, // Email temporário único
            projectId,
          });

          if (response.data && response.data.invite) {
            const baseUrl = window.location.origin;
            // Formato do link de convite que aponta para a página de registro
            const link = `${baseUrl}/auth/register?inviteToken=${response.data.invite.inviteToken}&inviteProjectId=${projectId}`;

            // Adicionar o novo convite diretamente ao estado
            const newInvite = response.data.invite;
            set((state) => {
              // Ordenar os convites por data de criação (mais recentes primeiro)
              const updatedInvites = [newInvite, ...state.invites];
              return {
                ...state,
                invites: updatedInvites,
                inviteLink: link,
                error: null,
              };
            });

            toast.success("Link de convite gerado com sucesso!");
            return link;
          } else {
            throw new Error("Formato de resposta inválido ao gerar link");
          }
        } catch (error: any) {
          console.error("Erro ao gerar link de convite:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao gerar link de convite";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // Copiar link para a área de transferência
      copyLinkToClipboard: async (link: string) => {
        try {
          await navigator.clipboard.writeText(link);
          set((state) => ({ ...state, linkCopied: true }));
          toast.success("Link copiado para a área de transferência");

          // Reset automático após 3 segundos
          setTimeout(() => {
            get().resetLinkCopied();
          }, 3000);
        } catch (error: any) {
          console.error("Erro ao copiar link:", error);
          toast.error("Não foi possível copiar o link");
          throw new Error("Não foi possível copiar o link");
        }
      },

      // Resetar o estado de cópia do link
      resetLinkCopied: () => {
        set((state) => ({ ...state, linkCopied: false }));
      },

      // Excluir um convite
      deleteInvite: async (inviteId: string) => {
        try {
          // Sem definir isLoading para evitar recarregamento completo

          await api.delete(`/api/projects/invite?inviteId=${inviteId}`);

          // Atualizar o estado local
          set((state) => ({
            ...state,
            invites: state.invites.filter((invite) => invite.id !== inviteId),
            error: null,
          }));

          toast.success("Convite excluído com sucesso!");
        } catch (error: any) {
          console.error("Erro ao excluir convite:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao excluir convite";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },

      // Excluir múltiplos convites
      deleteManyInvites: async (inviteIds: string[]) => {
        try {
          // Sem definir isLoading para evitar recarregamento completo

          // Array para armazenar promessas de exclusão
          const deletePromises = inviteIds.map((id) =>
            api.delete(`/api/projects/invite?inviteId=${id}`)
          );

          // Executar todas as promessas em paralelo
          await Promise.all(deletePromises);

          // Atualizar o estado local
          set((state) => ({
            ...state,
            invites: state.invites.filter(
              (invite) => !inviteIds.includes(invite.id)
            ),
            error: null,
          }));

          return { removedCount: inviteIds.length };
        } catch (error: any) {
          console.error("Erro ao excluir convites:", error);
          const errorMessage =
            error.response?.data?.error || "Erro ao excluir convites";

          set((state) => ({ ...state, error: errorMessage }));
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "invite-store", // Nome para o localStorage
      partialize: (state) => ({}), // Não persistir nada, sempre buscar do servidor
    }
  )
);
