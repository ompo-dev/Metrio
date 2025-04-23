"use client";

import * as React from "react";
import {
  UserPlusIcon,
  Settings,
  Trash2,
  Mail,
  UserCog,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  RowActions,
  statusFilterFn,
} from "@/components/data-table/Table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Member } from "./types";
import { useMemberStore } from "@/lib/store/member-store";
import { useTeamStore, Team } from "@/lib/store/team-store";
import { useProjectStore } from "@/lib/store/project-store";

export function MembersList() {
  // Usar diretamente o store Zustand em vez de receber props
  const {
    members,
    roles,
    addMember,
    updateMemberRole,
    removeMember,
    removeManyMembers,
  } = useMemberStore();

  const { activeProject } = useProjectStore();
  const { teams, fetchTeams, addTeamMember, addManyTeamMembers } =
    useTeamStore();

  const [newMemberName, setNewMemberName] = React.useState("");
  const [newMemberEmail, setNewMemberEmail] = React.useState("");
  const [newMemberRole, setNewMemberRole] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // Estado para o modal de edição de função
  const [editRoleOpen, setEditRoleOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null
  );
  const [newRole, setNewRole] = React.useState("");

  // Estado para confirmação de remoção
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [memberToDelete, setMemberToDelete] = React.useState<Member | null>(
    null
  );

  // Estado para adição de membros à equipe
  const [addToTeamOpen, setAddToTeamOpen] = React.useState(false);
  const [selectedTeamId, setSelectedTeamId] = React.useState("");
  const [memberToAddToTeam, setMemberToAddToTeam] =
    React.useState<Member | null>(null);
  const [selectedMembers, setSelectedMembers] = React.useState<Member[]>([]);
  const [isAddingToTeam, setIsAddingToTeam] = React.useState(false);

  // Carregar as equipes quando o componente montar
  React.useEffect(() => {
    if (activeProject?.id) {
      fetchTeams(activeProject.id);
    }
  }, [activeProject, fetchTeams]);

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim() && newMemberRole) {
      addMember(newMemberName.trim(), newMemberEmail.trim(), newMemberRole);
      setNewMemberName("");
      setNewMemberEmail("");
      setNewMemberRole("");
      setOpen(false);
    }
  };

  // Função para abrir o modal de edição de função
  const handleOpenEditRole = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setEditRoleOpen(true);
  };

  // Função para atualizar a função do membro
  const handleUpdateRole = async () => {
    if (!selectedMember || !newRole || newRole === selectedMember.role) {
      setEditRoleOpen(false);
      return;
    }

    try {
      // Atualiza a função através da store Zustand
      await updateMemberRole(selectedMember.id, newRole);

      // Fechar o modal e mostrar mensagem de sucesso
      toast.success("Função do membro atualizada com sucesso");
      setEditRoleOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar função do membro");
    }
  };

  // Função para abrir confirmação de remoção
  const handleOpenDeleteConfirm = (member: Member) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  // Função para remover um membro
  const handleRemoveMember = async () => {
    if (!memberToDelete) {
      setDeleteConfirmOpen(false);
      return;
    }

    try {
      await removeMember(memberToDelete.id);
      toast.success(`Membro ${memberToDelete.name} removido com sucesso`);
      setDeleteConfirmOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover membro");
    }
  };

  // Definição das colunas para DataTable
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Função",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge
            variant="outline"
            className={role === "owner" ? "bg-blue-100 text-blue-800" : ""}
          >
            {role === "owner"
              ? "Proprietário"
              : role === "admin"
              ? "Administrador"
              : role === "member"
              ? "Membro"
              : role === "viewer"
              ? "Visualizador"
              : role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={status === "Ativo" ? "default" : "secondary"}
            className={status === "Ativo" ? "bg-green-100 text-green-800" : ""}
          >
            {status}
          </Badge>
        );
      },
      filterFn: statusFilterFn,
    },
    {
      id: "acoes",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        // Se for o proprietário, mostrar menos ações
        if (role === "owner") {
          return (
            <RowActions
              row={row}
              actions={[
                {
                  label: "Adicionar à Equipe",
                  onClick: () => handleOpenAddToTeam(row.original),
                  icon: <Users className="h-4 w-4" />,
                },
              ]}
            />
          );
        }

        return (
          <RowActions
            row={row}
            actions={[
              {
                label: "Adicionar à Equipe",
                onClick: () => handleOpenAddToTeam(row.original),
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Editar Função",
                onClick: () => handleOpenEditRole(row.original),
                icon: <UserCog className="h-4 w-4" />,
              },
              {
                label: "Remover Membro",
                onClick: () => handleOpenDeleteConfirm(row.original),
                icon: <Trash2 className="h-4 w-4" />,
                destructive: true,
              },
            ]}
          />
        );
      },
    },
  ];

  // Função para remover múltiplos membros
  const handleRemoveSelectedMembers = async (selectedRows: Member[]) => {
    if (selectedRows.length === 0) return;

    // Verificar se há membros proprietários na seleção
    const hasOwners = selectedRows.some((member) => member.role === "owner");
    if (hasOwners) {
      toast.error("Você não pode remover membros com função de Proprietário");
      return;
    }

    try {
      const memberIds = selectedRows.map((member) => member.id);
      const result = await removeManyMembers(memberIds);
      toast.success(`${result.removedCount} membros removidos com sucesso`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover membros selecionados");
    }
  };

  // Função para abrir o modal de adicionar à equipe (membro individual)
  const handleOpenAddToTeam = (member: Member) => {
    setMemberToAddToTeam(member);
    setSelectedTeamId("");
    setAddToTeamOpen(true);
  };

  // Função para extrair o userId real do membro
  const extractRealUserId = (member: Member): string | null => {
    // Se houver um userId explícito, use-o
    if (member.userId) {
      return member.userId;
    }

    // Tenta extrair o userId do formato especial "owner-userId" ou "member-userId"
    const idMatch = member.id.match(/^(owner|member)-(.+)$/);
    if (idMatch && idMatch[2]) {
      return idMatch[2];
    }

    // Se não conseguir extrair, retorna null
    return null;
  };

  // Função para adicionar membro à equipe selecionada
  const handleAddMemberToTeam = async () => {
    if (!selectedTeamId || !memberToAddToTeam) {
      setAddToTeamOpen(false);
      return;
    }

    try {
      setIsAddingToTeam(true);
      // Usar o ID do membro conforme está, seja um ID de ProjectMember ou um ID especial de proprietário
      // O backend já foi modificado para lidar com o formato "owner-[userId]"
      await addTeamMember(selectedTeamId, memberToAddToTeam.id);

      // Buscar informações da equipe para a notificação
      const selectedTeam = teams.find((team) => team.id === selectedTeamId);

      // Extrair o userId real para enviar a notificação
      const targetUserId = extractRealUserId(memberToAddToTeam);

      // Enviar notificação para o membro adicionado
      if (selectedTeam && targetUserId && activeProject) {
        // Enviar notificação
        await fetch("/api/notifications/team-added", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: targetUserId,
            teamId: selectedTeamId,
            teamName: selectedTeam.name,
            projectId: activeProject.id,
            projectName: activeProject.name,
          }),
        });
      }

      toast.success(`Membro adicionado à equipe com sucesso`);
      setAddToTeamOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar membro à equipe");
    } finally {
      setIsAddingToTeam(false);
    }
  };

  // Função para adicionar múltiplos membros à equipe
  const handleAddSelectedMembersToTeam = async (selectedRows: Member[]) => {
    if (selectedRows.length === 0) {
      return;
    }

    setSelectedMembers(selectedRows);
    setSelectedTeamId("");
    setAddToTeamOpen(true);
  };

  // Função para confirmar a adição de múltiplos membros
  const handleAddMultipleMembersToTeam = async () => {
    if (!selectedTeamId || selectedMembers.length === 0) {
      setAddToTeamOpen(false);
      return;
    }

    try {
      setIsAddingToTeam(true);
      // Usamos os IDs dos membros como estão, incluindo formatos especiais como "owner-[userId]"
      // O backend já foi modificado para lidar com esses casos
      const memberIds = selectedMembers.map((member) => member.id);
      const result = await addManyTeamMembers(selectedTeamId, memberIds);

      if (result.addedCount > 0) {
        // Buscar informações da equipe para a notificação
        const selectedTeam = teams.find((team) => team.id === selectedTeamId);

        // Enviar notificação para cada membro adicionado
        if (selectedTeam && activeProject) {
          const notificationPromises = selectedMembers
            .map(extractRealUserId) // Extrair os userIds reais
            .filter((userId) => userId !== null) // Filtrar os nulos
            .map(async (userId) => {
              // Enviar notificação
              return fetch("/api/notifications/team-added", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId,
                  teamId: selectedTeamId,
                  teamName: selectedTeam.name,
                  projectId: activeProject.id,
                  projectName: activeProject.name,
                }),
              });
            });

          await Promise.all(notificationPromises);
        }

        toast.success(
          `${result.addedCount} membros adicionados à equipe com sucesso`
        );
      } else {
        toast.error("Não foi possível adicionar os membros à equipe");
      }

      setAddToTeamOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar membros à equipe");
    } finally {
      setIsAddingToTeam(false);
      setSelectedMembers([]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Membros</CardTitle>
            <CardDescription>
              Gerencie os membros da sua organização
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={members}
            searchColumn="name"
            searchPlaceholder="Buscar por nome, email ou função..."
            statusColumn="status"
            onAddItem={() => setOpen(true)}
            enableRowSelection={true}
            onDeleteRows={handleRemoveSelectedMembers}
            extraBulkActions={[
              {
                label: "Adicionar à Equipe",
                icon: <Users className="h-4 w-4" />,
                onClick: handleAddSelectedMembersToTeam,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Modal para editar função do membro */}
      <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Função do Membro</DialogTitle>
            <DialogDescription>
              Altere a função de {selectedMember?.name || "membro selecionado"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Nova Função</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roles
                    .filter((role) => role.id !== "owner") // Não pode promover a proprietário
                    .map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleUpdateRole}>
              Atualizar Função
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para confirmar remoção de membro */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {memberToDelete?.name} da sua
              organização? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar membros a uma equipe */}
      <Dialog open={addToTeamOpen} onOpenChange={setAddToTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar à Equipe</DialogTitle>
            <DialogDescription>
              {selectedMembers.length > 0
                ? `Selecione a equipe para adicionar ${selectedMembers.length} membro(s)`
                : `Selecione a equipe para adicionar ${
                    memberToAddToTeam?.name || "o membro"
                  }`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-selection">Equipe</Label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger id="team-selection">
                  <SelectValue placeholder="Selecione uma equipe" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddToTeamOpen(false)}
              disabled={isAddingToTeam}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={
                selectedMembers.length > 0
                  ? handleAddMultipleMembersToTeam
                  : handleAddMemberToTeam
              }
              disabled={!selectedTeamId || isAddingToTeam}
            >
              {isAddingToTeam ? "Adicionando..." : "Adicionar à Equipe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
