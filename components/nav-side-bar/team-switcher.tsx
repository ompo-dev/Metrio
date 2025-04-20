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
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
import { toast } from "sonner";

// Interface para times do usuário
export interface UserTeam {
  id: string;
  name: string;
  logo: string;
  plan: string;
}

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

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [userTeams, setUserTeams] = React.useState<UserTeam[]>([]);
  const [activeTeam, setActiveTeam] = React.useState<UserTeam | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Estados para o modal de criar projeto
  const [teamName, setTeamName] = React.useState("");
  const [projectType, setProjectType] = React.useState("");
  const [selectedIcon, setSelectedIcon] = React.useState(PROJECT_ICONS[0].name);
  const [isLoading, setIsLoading] = React.useState(false);

  // Carregar times do localStorage ao iniciar
  React.useEffect(() => {
    const storedTeams = localStorage.getItem("userTeams");
    const parsedTeams = storedTeams ? JSON.parse(storedTeams) : [];

    setUserTeams(parsedTeams);

    if (parsedTeams.length > 0) {
      // Recuperar time ativo do localStorage ou definir o primeiro time como ativo
      const activeTeamId = localStorage.getItem("activeTeamId");
      const foundActiveTeam = activeTeamId
        ? parsedTeams.find((team: UserTeam) => team.id === activeTeamId)
        : parsedTeams[0];

      setActiveTeam(foundActiveTeam || parsedTeams[0]);
    } else {
      // Se não houver times, abrir o modal de criação de time
      setIsCreateModalOpen(true);
    }
  }, [router]);

  // Salvar time ativo no localStorage quando mudar
  React.useEffect(() => {
    if (activeTeam) {
      localStorage.setItem("activeTeamId", activeTeam.id);
    }
  }, [activeTeam]);

  // Abrir modal de criação de projeto
  const handleCreateTeamModalOpen = () => {
    setTeamName("");
    setProjectType("");
    setSelectedIcon(PROJECT_ICONS[0].name);
    setIsCreateModalOpen(true);
  };

  // Criar novo projeto
  const handleCreateTeam = () => {
    setIsLoading(true);

    try {
      // Validação básica
      if (!teamName.trim()) {
        toast.error("Por favor, informe um nome para o projeto");
        setIsLoading(false);
        return;
      }

      // Criar novo projeto
      const newTeam = {
        id: uuidv4(),
        name: teamName,
        logo: selectedIcon,
        plan: projectType || "Gratuito",
      };

      // Salvar no localStorage
      const updatedTeams = [...userTeams, newTeam];

      localStorage.setItem("userTeams", JSON.stringify(updatedTeams));
      localStorage.setItem("activeTeamId", newTeam.id);

      // Atualizar estado
      setUserTeams(updatedTeams);
      setActiveTeam(newTeam);

      toast.success("Projeto criado com sucesso!");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast.error("Ocorreu um erro ao criar o projeto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTeam = (team: UserTeam) => {
    setActiveTeam(team);
  };

  // Obter o componente do ícone pelo nome
  const getIconComponent = (iconName: string): LucideIcon => {
    const iconItem = PROJECT_ICONS.find((item) => item.name === iconName);
    return iconItem?.icon || Briefcase;
  };

  // Mostrar placeholder enquanto carrega os dados
  if (!activeTeam) {
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

  // Componente do ícone ativo
  const ActiveIconComponent = getIconComponent(activeTeam.logo);

  // Renderizar com os dados do localStorage
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
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
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
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Projetos
              </DropdownMenuLabel>
              {userTeams.map((team, index) => {
                const TeamIconComponent = getIconComponent(team.logo);
                return (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={() => handleSelectTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <TeamIconComponent className="size-4 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={handleCreateTeamModalOpen}
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
              disabled={isLoading || userTeams.length === 0}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateTeam} disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Projeto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
