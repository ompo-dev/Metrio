"use client";

import * as React from "react";
import {
  Briefcase,
  Shield,
  Users,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, RowActions } from "@/components/ui/data-table/Table";
import { ColumnDef } from "@tanstack/react-table";

import { RoleListProps, Role } from "./types";

export function RolesList({ roles, permissions, onAddRole }: RoleListProps) {
  const [open, setOpen] = React.useState(false);
  const [roleName, setRoleName] = React.useState("");
  const [roleDescription, setRoleDescription] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);

  const handleAddRole = () => {
    if (roleName.trim() && roleDescription.trim()) {
      onAddRole(roleName, roleDescription, selectedPermissions);
      setRoleName("");
      setRoleDescription("");
      setSelectedPermissions([]);
      setOpen(false);
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((current) =>
      current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission]
    );
  };

  // Definição das colunas para DataTable
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="max-w-[300px]">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "members",
      header: "Membros",
    },
    {
      id: "acoes",
      cell: ({ row }) => (
        <RowActions
          row={row}
          actions={[
            {
              label: "Ver Membros",
              onClick: () =>
                console.log("Ver membros com função", row.original.id),
              icon: <Users className="h-4 w-4" />,
            },
            {
              label: "Editar Permissões",
              onClick: () =>
                console.log("Editar permissões da função", row.original.id),
              icon: <Shield className="h-4 w-4" />,
            },
            {
              label: "Editar Função",
              onClick: () => console.log("Editar função", row.original.id),
              icon: <Settings className="h-4 w-4" />,
            },
            {
              label: "Excluir Função",
              onClick: () => console.log("Excluir função", row.original.id),
              icon: <Trash2 className="h-4 w-4" />,
              destructive: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Funções</CardTitle>
            <CardDescription>
              Gerencie as funções e suas permissões
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Nova Função
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Função</DialogTitle>
                <DialogDescription>
                  Crie uma nova função e defina suas permissões
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="role-name">Nome da Função</Label>
                  <Input
                    id="role-name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Ex: Gerente de Produto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role-description">Descrição</Label>
                  <Textarea
                    id="role-description"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Descreva as responsabilidades desta função"
                  />
                </div>
                <div className="grid gap-4">
                  <Label>Permissões</Label>
                  <div className="grid gap-3 max-h-60 overflow-auto">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {permission.description}
                          </div>
                        </div>
                        <Switch
                          checked={selectedPermissions.includes(
                            permission.name
                          )}
                          onCheckedChange={() =>
                            togglePermission(permission.name)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddRole}>
                  Adicionar Função
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={roles}
          searchColumn="name"
          searchPlaceholder="Buscar funções..."
          onAddItem={() => setOpen(true)}
          addButtonLabel="Nova Função"
        />
      </CardContent>
    </Card>
  );
}
