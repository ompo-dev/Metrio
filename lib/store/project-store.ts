import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

// Interface para projetos
export interface Project {
  id: string;
  name: string;
  logoIcon: string;
  type: string | null;
}

// Interface da store
interface ProjectState {
  // Estado
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Ações
  fetchProjects: () => Promise<void>;
  setActiveProject: (project: Project) => Promise<void>;
  addProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      projects: [],
      activeProject: null,
      isLoading: false,
      error: null,

      // Ações
      fetchProjects: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get("/api/projects");
          const projects = response.data;

          // Atualizar projetos
          set({ projects });

          // Se houver projetos e não tiver um projeto ativo, definir o primeiro como ativo
          if (projects.length > 0 && !get().activeProject) {
            set({ activeProject: projects[0] });
          }
        } catch (error) {
          console.error("Erro ao buscar projetos:", error);
          set({ error: "Falha ao carregar projetos" });
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveProject: async (project: Project) => {
        try {
          // Atualizar o estado localmente primeiro para feedback imediato
          set({ activeProject: project });

          // Enviar para a API
          await api.put("/api/projects/active", {
            projectId: project.id,
          });
        } catch (error) {
          console.error("Erro ao definir projeto ativo:", error);

          // Em caso de erro, buscar os projetos novamente para restaurar o estado correto
          get().fetchProjects();
        }
      },

      addProject: (project: Project) => {
        set((state) => ({
          projects: [project, ...state.projects],
          activeProject: project, // Novo projeto se torna o ativo
        }));
      },
    }),
    {
      name: "project-store", // Nome para o localStorage
      partialize: (state) => ({ activeProject: state.activeProject }), // Só persistir o projeto ativo
    }
  )
);
