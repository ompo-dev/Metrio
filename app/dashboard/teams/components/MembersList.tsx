"use client";

import * as React from "react";
import {
  UserPlusIcon,
  Settings,
  Trash2,
  Mail,
  UserCog,
  Users,
  Code,
  Briefcase,
  Database,
  Pencil,
  LucideIcon,
  Figma,
  LineChart,
  Search,
  Megaphone,
  Bot,
  UsersRound,
  User,
  UserCheck,
  Loader2,
  ChevronDown,
  Check,
  X,
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

import { Member, getTeamIcon } from "./types";
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
  const [selectedTeamIds, setSelectedTeamIds] = React.useState<string[]>([]);
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
    setSelectedTeamIds([]);
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

  // Função para adicionar um membro a equipes
  const handleAddMemberToTeam = () => {
    if (memberToAddToTeam && selectedTeamIds.length > 0) {
      setIsAddingToTeam(true);

      // Adicionar o membro a várias equipes
      selectedTeamIds.forEach((teamId) => {
        addTeamMember(teamId, memberToAddToTeam.id)
          .then(() => {
            toast.success(
              `${memberToAddToTeam.name} adicionado às equipes selecionadas`
            );
            setAddToTeamOpen(false);
            setMemberToAddToTeam(null);
            setSelectedTeamIds([]);
            setIsAddingToTeam(false);
          })
          .catch((error) => {
            toast.error(`Erro ao adicionar membro à equipe: ${error.message}`);
            setIsAddingToTeam(false);
          });
      });
    }
  };

  // Função para adicionar vários membros a equipes
  const handleAddMembersToTeams = () => {
    if (selectedMembers.length > 0 && selectedTeamIds.length > 0) {
      setIsAddingToTeam(true);

      // Criar array de IDs dos membros selecionados
      const memberIds = selectedMembers.map((member) => member.id);

      // Adicionar os membros às equipes selecionadas
      Promise.all(
        selectedTeamIds.map((teamId) => addManyTeamMembers(teamId, memberIds))
      )
        .then(() => {
          toast.success(
            `${selectedMembers.length} membros adicionados a ${selectedTeamIds.length} equipes`
          );
          setAddToTeamOpen(false);
          setSelectedMembers([]);
          setSelectedTeamIds([]);
          setIsAddingToTeam(false);
        })
        .catch((error) => {
          toast.error(`Erro ao adicionar membros às equipes: ${error.message}`);
          setIsAddingToTeam(false);
        });
    }
  };

  // Função para adicionar múltiplos membros à equipe
  const handleAddSelectedMembersToTeam = (selectedRows: Member[]) => {
    if (selectedRows.length === 0) {
      return;
    }

    setSelectedMembers(selectedRows);
    setSelectedTeamIds([]);
    setMemberToAddToTeam(null);
    setAddToTeamOpen(true);
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

      {/* Modal para adicionar membro a equipes */}
      <Dialog open={addToTeamOpen} onOpenChange={setAddToTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar às Equipes</DialogTitle>
            <DialogDescription>
              {selectedMembers.length > 0
                ? `Selecione as equipes para adicionar ${selectedMembers.length} membro(s)`
                : `Selecione as equipes para adicionar ${
                    memberToAddToTeam?.name || "o membro"
                  }`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Selecione uma ou mais equipes
              </h3>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Users className="mb-2 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Não há equipes disponíveis
                  </p>
                </div>
              ) : (
                teams.map((team) => {
                  const IconComponent = getTeamIcon(team.logoIcon || "users");
                  const isSelected = selectedTeamIds.includes(team.id);

                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => {
                        if (selectedTeamIds.includes(team.id)) {
                          setSelectedTeamIds(
                            selectedTeamIds.filter((id) => id !== team.id)
                          );
                        } else {
                          setSelectedTeamIds([...selectedTeamIds, team.id]);
                        }
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted ${
                        isSelected ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <IconComponent className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {team.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {team.memberCount || 0} membro(s)
                          </span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border">
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Equipes selecionadas - contador */}
            {selectedTeamIds.length > 0 && (
              <div className="mt-3 text-sm">
                <span className="font-medium text-primary">
                  {selectedTeamIds.length}
                </span>{" "}
                equipe(s) selecionada(s)
              </div>
            )}
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
                  ? handleAddMembersToTeams
                  : handleAddMemberToTeam
              }
              disabled={selectedTeamIds.length === 0 || isAddingToTeam}
            >
              {isAddingToTeam ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                "Adicionar às Equipes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
