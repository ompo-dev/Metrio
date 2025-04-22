"use client";

import * as React from "react";
import { UserPlusIcon, Settings, Trash2, Mail, UserCog } from "lucide-react";
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
                  label: "Enviar Email",
                  onClick: () =>
                    console.log("Enviar email para", row.original.email),
                  icon: <Mail className="h-4 w-4" />,
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
                label: "Enviar Email",
                onClick: () =>
                  console.log("Enviar email para", row.original.email),
                icon: <Mail className="h-4 w-4" />,
              },
              {
                label: "Editar Função",
                onClick: () => handleOpenEditRole(row.original),
                icon: <UserCog className="h-4 w-4" />,
              },
              {
                label: "Editar Membro",
                onClick: () =>
                  console.log(
                    "Editar membro",
                    row.original.userId || row.original.id
                  ),
                icon: <Settings className="h-4 w-4" />,
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
    </>
  );
}
