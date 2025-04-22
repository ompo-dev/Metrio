"use client";

import * as React from "react";
import { Users, UserPlus, MoreHorizontal, EyeIcon, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, RowActions } from "@/components/data-table/Table";
import { ColumnDef } from "@tanstack/react-table";

import { TeamListProps, Team } from "./types";
import { membersData } from "./data";

export function TeamsList({ teams, onAddTeam }: TeamListProps) {
  const [newTeamName, setNewTeamName] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      onAddTeam(newTeamName.trim());
      setNewTeamName("");
      setOpen(false);
    }
  };

  // Definição das colunas para DataTable
  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "members",
      header: "Membros",
    },
    {
      accessorKey: "lastActive",
      header: "Última Atividade",
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
                console.log("Ver membros da equipe", row.original.id),
              icon: <Users className="h-4 w-4" />,
            },
            {
              label: "Excluir Equipe",
              onClick: () => console.log("Excluir equipe", row.original.id),
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
            <CardTitle>Equipes</CardTitle>
            <CardDescription>
              Monte e gerencie equipes da sua organização
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nova Equipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Equipe</DialogTitle>
                <DialogDescription>
                  Crie uma nova equipe para sua organização
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Nome da Equipe</Label>
                  <Input
                    id="team-name"
                    placeholder="Insira o nome da equipe"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddTeam}>
                  Criar Equipe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={teams}
          searchColumn="name"
          searchPlaceholder="Buscar equipes..."
          onAddItem={() => setOpen(true)}
          addButtonLabel="Nova Equipe"
        />
      </CardContent>
    </Card>
  );
}
