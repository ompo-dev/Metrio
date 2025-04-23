"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

export function TeamsList() {
  // Estados para modais
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  // Estados de formulário
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamDescription, setEditTeamDescription] = useState("");

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

  // Manipuladores de eventos
  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !activeProject?.id) return;

    await createTeam(
      newTeamName,
      activeProject.id,
      newTeamDescription || undefined
    );

    // Resetar formulário e fechar modal
    setNewTeamName("");
    setNewTeamDescription("");
    setIsCreateTeamOpen(false);
  };

  const handleEditTeam = async () => {
    if (!editTeamName.trim() || !teamToEdit) return;

    await updateTeam(teamToEdit.id, {
      name: editTeamName,
      description: editTeamDescription || undefined,
    });

    // Resetar formulário e fechar modal
    setTeamToEdit(null);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    await deleteTeam(teamToDelete.id);
    setTeamToDelete(null);
  };

  const openEditModal = (team: Team) => {
    setTeamToEdit(team);
    setEditTeamName(team.name);
    setEditTeamDescription(team.description || "");
  };

  // Definição das colunas da tabela
  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      size: 180,
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
              Informe os detalhes da equipe que deseja criar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateTeam}>
              Criar Equipe
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nome
              </Label>
              <Input
                id="edit-name"
                value={editTeamName}
                onChange={(e) => setEditTeamName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="edit-description"
                value={editTeamDescription}
                onChange={(e) => setEditTeamDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditTeam}>
              Salvar Alterações
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
