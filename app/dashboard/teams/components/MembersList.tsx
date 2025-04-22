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

import { MemberListProps, Member } from "./types";

export function MembersList({ members, roles, onAddMember }: MemberListProps) {
  const [newMemberName, setNewMemberName] = React.useState("");
  const [newMemberEmail, setNewMemberEmail] = React.useState("");
  const [newMemberRole, setNewMemberRole] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim() && newMemberRole) {
      onAddMember(newMemberName.trim(), newMemberEmail.trim(), newMemberRole);
      setNewMemberName("");
      setNewMemberEmail("");
      setNewMemberRole("");
      setOpen(false);
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
                onClick: () =>
                  console.log(
                    "Editar função do membro",
                    row.original.userId || row.original.id
                  ),
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
                onClick: () =>
                  console.log(
                    "Remover membro",
                    row.original.userId || row.original.id
                  ),
                icon: <Trash2 className="h-4 w-4" />,
                destructive: true,
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Membros</CardTitle>
            <CardDescription>
              Gerencie os membros da sua organização
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlusIcon className="h-4 w-4" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
                <DialogDescription>
                  Adicione um novo membro à sua organização
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="member-name">Nome</Label>
                  <Input
                    id="member-name"
                    placeholder="Nome completo"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="member-email">Email</Label>
                  <Input
                    id="member-email"
                    placeholder="email@example.com"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="member-role">Função</Label>
                  <Select
                    value={newMemberRole}
                    onValueChange={setNewMemberRole}
                  >
                    <SelectTrigger id="member-role">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles
                        .filter((role) => role.id !== "owner") // Filtrar o papel de proprietário
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
                <Button type="submit" onClick={handleAddMember}>
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          addButtonLabel="Adicionar Membro"
        />
      </CardContent>
    </Card>
  );
}
