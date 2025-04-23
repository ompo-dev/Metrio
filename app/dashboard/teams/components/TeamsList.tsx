"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Users,
  UserCircle,
  User,
  UserPlus,
  UserCog,
  UserCheck,
  UsersRound,
  Building,
  Briefcase,
  LayoutGrid,
  Code,
  LucideIcon,
  Loader2,
  CodeXml,
  Database,
  LineChart,
  PieChart,
  Figma,
  Paintbrush,
  Search,
  Megaphone,
  Presentation,
  HeartHandshake,
  Brain,
  Microscope,
  BookOpen,
  Lightbulb,
  Bot,
  ShieldCheck,
  Coffee,
  UserCog2,
  Server,
  FileCode,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";

// Componentes UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Componente de tabela personalizado
import { DataTable, RowActions } from "@/components/data-table/Table";

// Store
import { useTeamStore, Team } from "@/lib/store/team-store";
import { useProjectStore } from "@/lib/store/project-store";

// Lista de ícones para equipes
const TEAM_ICONS = [
  // Genéricos
  { icon: Users, name: "users" },
  { icon: UsersRound, name: "users-round" },
  { icon: UserPlus, name: "user-plus" },

  // Desenvolvimento e Tecnologia
  { icon: Code, name: "code" },
  { icon: CodeXml, name: "code-xml" },
  { icon: FileCode, name: "file-code" },
  { icon: Server, name: "server" },
  { icon: Database, name: "database" },
  { icon: Bot, name: "bot" },
  { icon: ShieldCheck, name: "shield-check" },

  // Design e UI/UX
  { icon: Figma, name: "figma" },
  { icon: Paintbrush, name: "paintbrush" },
  { icon: LayoutGrid, name: "layout-grid" },

  // Dados e Análise
  { icon: LineChart, name: "line-chart" },
  { icon: PieChart, name: "pie-chart" },
  { icon: Search, name: "search" },
  { icon: Brain, name: "brain" },
  { icon: Microscope, name: "microscope" },

  // Marketing, RH e Gestão
  { icon: Megaphone, name: "megaphone" },
  { icon: Presentation, name: "presentation" },
  { icon: HeartHandshake, name: "heart-handshake" },
  { icon: BookOpen, name: "book-open" },
  { icon: Briefcase, name: "briefcase" },
  { icon: UserCog, name: "user-cog" },
  { icon: UserCog2, name: "user-cog-2" },
  { icon: Lightbulb, name: "lightbulb" },

  // Outros
  { icon: Coffee, name: "coffee" },
  { icon: Building, name: "building" },
  { icon: User, name: "user" },
  { icon: UserCheck, name: "user-check" },
  { icon: UserCircle, name: "user-circle" },
];

export function TeamsList() {
  // Estados para modais
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  // Estados de formulário
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(TEAM_ICONS[0].name);
  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamDescription, setEditTeamDescription] = useState("");
  const [editSelectedIcon, setEditSelectedIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtendo estado e ações das stores
  const { teams, isLoading, fetchTeams, createTeam, updateTeam, deleteTeam } =
    useTeamStore();
  const { activeProject } = useProjectStore();

  // Carregar equipes quando o componente montar
  useEffect(() => {
    if (activeProject?.id) {
      fetchTeams(activeProject.id);
    }
  }, [activeProject, fetchTeams]);

  // Função para obter o componente do ícone pelo nome
  const getIconComponent = (iconName: string): LucideIcon => {
    const iconItem = TEAM_ICONS.find((item) => item.name === iconName);
    return iconItem?.icon || Users;
  };

  // Manipuladores de eventos
  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !activeProject?.id) return;

    setIsSubmitting(true);

    await createTeam(
      newTeamName,
      activeProject.id,
      newTeamDescription || undefined,
      selectedIcon
    );

    // Resetar formulário e fechar modal
    setNewTeamName("");
    setNewTeamDescription("");
    setSelectedIcon(TEAM_ICONS[0].name);
    setIsCreateTeamOpen(false);
    setIsSubmitting(false);
  };

  const handleEditTeam = async () => {
    if (!editTeamName.trim() || !teamToEdit) return;

    setIsSubmitting(true);

    await updateTeam(teamToEdit.id, {
      name: editTeamName,
      description: editTeamDescription || undefined,
      logoIcon: editSelectedIcon,
    });

    // Resetar formulário e fechar modal
    setTeamToEdit(null);
    setIsSubmitting(false);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    setIsSubmitting(true);
    await deleteTeam(teamToDelete.id);
    setTeamToDelete(null);
    setIsSubmitting(false);
  };

  const openEditModal = (team: Team) => {
    setTeamToEdit(team);
    setEditTeamName(team.name);
    setEditTeamDescription(team.description || "");
    setEditSelectedIcon(team.logoIcon || TEAM_ICONS[0].name);
  };

  // Definição das colunas da tabela
  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const team = row.original;
        const IconComponent = getIconComponent(team.logoIcon || "users");

        return (
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <IconComponent className="size-4" />
            </div>
            <div className="font-medium">{team.name}</div>
          </div>
        );
      },
      size: 220,
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px]">
          {row.original.description || "Sem descrição"}
        </div>
      ),
      size: 220,
    },
    {
      accessorKey: "memberCount",
      header: "Membros",
      cell: ({ row }) => <div>{row.original.memberCount || 0}</div>,
      size: 100,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {isActive ? "Ativa" : "Inativa"}
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: "updatedAt",
      header: "Última Atualização",
      cell: ({ row }) => {
        const updatedAt = new Date(row.original.updatedAt);
        const formatted = formatDistanceToNow(updatedAt, {
          addSuffix: true,
          locale: ptBR,
        });
        return <div>{formatted}</div>;
      },
      size: 180,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => (
        <RowActions
          row={row}
          actions={[
            {
              label: "Editar",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => openEditModal(row.original),
            },
            {
              label: "Excluir",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => setTeamToDelete(row.original),
              destructive: true,
            },
          ]}
        />
      ),
      size: 60,
      enableHiding: false,
    },
  ];

  if (isLoading && teams.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabela de equipes usando o componente DataTable */}
      <DataTable
        data={teams}
        columns={columns}
        searchColumn="name"
        searchPlaceholder="Filtrar por nome..."
        statusColumn="isActive"
        enablePagination
        enableRowSelection
        enableColumnVisibility
        onAddItem={() => setIsCreateTeamOpen(true)}
        addButtonLabel="Nova Equipe"
        onDeleteRows={(selectedTeams) => {
          if (selectedTeams.length === 1) {
            setTeamToDelete(selectedTeams[0]);
          } else {
            // Aqui você pode implementar a lógica para exclusão em massa
            // ou apenas continuar usando a lógica de exclusão individual
            console.log("Excluir múltiplas equipes", selectedTeams);
          }
        }}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* Modal de criação de equipe */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Equipe</DialogTitle>
            <DialogDescription>
              Configure as informações da equipe que deseja criar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe</Label>
              <Input
                id="name"
                placeholder="Ex: Equipe de Desenvolvimento"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva a função desta equipe"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Ícone da Equipe</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_ICONS.map((iconData) => {
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
              onClick={() => setIsCreateTeamOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleCreateTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Equipe"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      <Dialog
        open={!!teamToEdit}
        onOpenChange={(open) => !open && setTeamToEdit(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Equipe</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da equipe selecionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Equipe</Label>
              <Input
                id="edit-name"
                value={editTeamName}
                onChange={(e) => setEditTeamName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editTeamDescription}
                onChange={(e) => setEditTeamDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Ícone da Equipe</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_ICONS.map((iconData) => {
                  const IconComponent = iconData.icon;
                  return (
                    <Button
                      key={iconData.name}
                      type="button"
                      variant={
                        editSelectedIcon === iconData.name
                          ? "default"
                          : "outline"
                      }
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setEditSelectedIcon(iconData.name)}
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
              onClick={() => setTeamToEdit(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleEditTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a equipe {teamToDelete?.name}? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
