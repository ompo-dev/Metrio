"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronsUpDown,
  Plus,
  LucideIcon,
  Rocket,
  Briefcase,
  Code,
  BarChart,
  LineChart,
  Building,
  Settings,
  Wrench,
  Smartphone,
  Globe,
  Loader2,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { Project, useProjectStore } from "@/lib/store/project-store";

// Lista de ícones para projetos
const PROJECT_ICONS = [
  { icon: Briefcase, name: "briefcase" },
  { icon: Rocket, name: "rocket" },
  { icon: Code, name: "code" },
  { icon: BarChart, name: "bar-chart" },
  { icon: LineChart, name: "line-chart" },
  { icon: Building, name: "building" },
  { icon: Settings, name: "settings" },
  { icon: Wrench, name: "wrench" },
  { icon: Smartphone, name: "smartphone" },
  { icon: Globe, name: "globe" },
];

// Tipos de projetos
const PROJECT_TYPES = [
  { value: "startup", label: "Startup" },
  { value: "saas", label: "SaaS" },
  { value: "micro-saas", label: "Micro SaaS" },
  { value: "agency", label: "Agência" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "personal", label: "Projeto Pessoal" },
  { value: "other", label: "Outro" },
];

export function TeamSwitcher() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session, status } = useSession();

  // Usar a store de projetos
  const {
    projects,
    activeProject,
    isLoading: isStoreLoading,
    fetchProjects,
    setActiveProject,
    addProject,
  } = useProjectStore();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Estados para o modal de criar projeto
  const [teamName, setTeamName] = React.useState("");
  const [projectType, setProjectType] = React.useState("");
  const [selectedIcon, setSelectedIcon] = React.useState(PROJECT_ICONS[0].name);

  // Separar projetos em dois grupos: os que sou dono e os que sou membro
  const ownedProjects = React.useMemo(
    () =>
      projects.filter((project) => project.role === "owner" || !project.role),
    [projects]
  );

  const memberProjects = React.useMemo(
    () =>
      projects.filter(
        (project) => project.role === "member" || project.role === "admin"
      ),
    [projects]
  );

  // Carregar projetos ao iniciar
  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProjects();
    }
  }, [session?.user?.id, status, fetchProjects]);

  // Abrir modal de criação de projeto
  const handleCreateProjectModalOpen = () => {
    setTeamName("");
    setProjectType("");
    setSelectedIcon(PROJECT_ICONS[0].name);
    setIsCreateModalOpen(true);
  };

  // Criar novo projeto
  const handleCreateProject = async () => {
    setIsLoading(true);

    try {
      // Validação básica
      if (!teamName.trim()) {
        toast.error("Por favor, informe um nome para o projeto");
        setIsLoading(false);
        return;
      }

      // Enviar para a API
      const response = await api.post("/api/projects", {
        name: teamName,
        logoIcon: selectedIcon,
        type: projectType || null,
      });

      const newProject = response.data;

      // Adicionar à store e definir como ativo
      addProject(newProject);

      toast.success("Projeto criado com sucesso!");
      setIsCreateModalOpen(false);
    } catch (error) {
      // O toast de erro já é exibido pelo interceptor do Axios
      console.error("Erro ao criar projeto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obter o componente do ícone pelo nome
  const getIconComponent = (iconName: string): LucideIcon => {
    const iconItem = PROJECT_ICONS.find((item) => item.name === iconName);
    return iconItem?.icon || Briefcase;
  };

  // Mostrar estado de carregamento enquanto busca dados
  if (isStoreLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-muted animate-pulse"></div>
            <div className="grid flex-1 gap-1">
              <div className="h-4 w-20 rounded-md bg-sidebar-muted animate-pulse"></div>
              <div className="h-3 w-16 rounded-md bg-sidebar-muted animate-pulse"></div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Mostrar estado de sem projetos
  if (!activeProject) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" onClick={handleCreateProjectModalOpen}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-muted">
              <Plus className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Criar Projeto</span>
              <span className="truncate text-xs">Comece aqui</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Componente do ícone ativo
  const ActiveIconComponent = getIconComponent(activeProject.logoIcon);

  // Renderizar com os dados do banco
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ActiveIconComponent className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeProject.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeProject.type || "Projeto"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              {ownedProjects.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Meus Projetos
                  </DropdownMenuLabel>
                  {ownedProjects.map((project, index) => {
                    const ProjectIconComponent = getIconComponent(
                      project.logoIcon
                    );
                    return (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={() => setActiveProject(project)}
                        className="gap-2 p-2"
                      >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <ProjectIconComponent className="size-4 shrink-0" />
                        </div>
                        {project.name}
                        <DropdownMenuShortcut>
                          ⌘{index + 1}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    );
                  })}
                </>
              )}

              {memberProjects.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Projetos Compartilhados
                  </DropdownMenuLabel>
                  {memberProjects.map((project) => {
                    const ProjectIconComponent = getIconComponent(
                      project.logoIcon
                    );
                    return (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={() => setActiveProject(project)}
                        className="gap-2 p-2"
                      >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <ProjectIconComponent className="size-4 shrink-0" />
                        </div>
                        {project.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {project.role === "admin" ? "Admin" : "Membro"}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={handleCreateProjectModalOpen}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Adicionar projeto
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Modal de Criação de Projeto */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Projeto</DialogTitle>
            <DialogDescription>
              Configure as informações do seu projeto ou empresa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome do Projeto</Label>
              <Input
                id="team-name"
                placeholder="Ex: Minha Startup"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-type">Tipo de Projeto</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ícone do Projeto</Label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_ICONS.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <Button
                      key={iconData.name}
                      type="button"
                      variant={
                        selectedIcon === iconData.name ? "default" : "outline"
                      }
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setSelectedIcon(iconData.name)}
                    >
                      <IconComponent className="size-5" />
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading || projects.length === 0}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateProject} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
