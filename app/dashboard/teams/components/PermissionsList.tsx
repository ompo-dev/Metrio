"use client";

import * as React from "react";
import { Info, ShieldCheck, Settings, Users } from "lucide-react";
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
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { DataTable, RowActions } from "@/components/data-table/Table";
import { ColumnDef } from "@tanstack/react-table";

import { PermissionListProps, Permission } from "./types";

export function PermissionsList({
  permissions,
  onAddPermission,
}: PermissionListProps) {
  // Definição das colunas para DataTable
  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "name",
      header: "Permissão",
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
      accessorKey: "roles",
      header: "Funções com Acesso",
      cell: ({ row }) => {
        const roles = row.getValue("roles") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role, index) => (
              <Badge key={index} variant="outline" className="mr-1">
                {role}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "acoes",
      cell: ({ row }) => (
        <RowActions
          row={row}
          actions={[
            {
              label: "Ver Funções",
              onClick: () =>
                console.log("Ver funções com permissão", row.original.id),
              icon: <Users className="h-4 w-4" />,
            },
            {
              label: "Editar Permissão",
              onClick: () => console.log("Editar permissão", row.original.id),
              icon: <Settings className="h-4 w-4" />,
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
          <div className="flex items-center gap-2">
            <CardTitle>Permissões</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                  >
                    <Info className="h-3 w-3" />
                    <span className="sr-only">Informações</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Permissões controlam o acesso às funcionalidades da
                  plataforma. Cada permissão pode ser atribuída a uma ou mais
                  funções.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            <CardDescription>
              Gerencie permissões de acesso às funcionalidades
            </CardDescription>
          </div>
          {onAddPermission && (
            <Button
              className="flex items-center gap-2"
              onClick={onAddPermission}
            >
              <ShieldCheck className="h-4 w-4" />
              Nova Permissão
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={permissions}
          searchColumn="name"
          searchPlaceholder="Buscar permissões..."
          onAddItem={onAddPermission}
          addButtonLabel="Nova Permissão"
        />
      </CardContent>
    </Card>
  );
}
