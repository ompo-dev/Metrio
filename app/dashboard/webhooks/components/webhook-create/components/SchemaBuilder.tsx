import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash, ChevronUp, ChevronDown, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SchemaField, FieldType } from "../types";

interface SchemaBuilderProps {
  fields: SchemaField[];
  setFields: React.Dispatch<React.SetStateAction<SchemaField[]>>;
  newField: SchemaField;
  setNewField: React.Dispatch<React.SetStateAction<SchemaField>>;
}

export function SchemaBuilder({
  fields,
  setFields,
  newField,
  setNewField,
}: SchemaBuilderProps) {
  const { toast } = useToast();

  const addField = () => {
    if (!newField.name) {
      toast({
        title: "Nome do campo necessário",
        description: "Por favor, informe um nome para o campo.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newId = (fields.length + 1).toString();
    setFields([...fields, { ...newField, id: newId }]);
    setNewField({
      id: "",
      name: "",
      type: "string",
      required: true,
      description: "",
    });
  };

  const removeField = (id: string) => {
    // Nunca remover o campo keyHook que é obrigatório
    if (fields.find((f) => f.id === id)?.name === "keyHook") {
      toast({
        title: "Campo obrigatório",
        description:
          "O campo 'keyHook' é obrigatório para autenticação e não pode ser removido.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setFields(fields.filter((field) => field.id !== id));
  };

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((field) => field.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Trocar posições
    [newFields[index], newFields[newIndex]] = [
      newFields[newIndex],
      newFields[index],
    ];

    setFields(newFields);
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  return (
    <div className="pt-4">
      <div className="flex flex-col space-y-2">
        <Label className="text-lg font-medium mb-2">
          Construtor de Dados
          <span className="text-sm font-normal ml-2 text-muted-foreground">
            Defina quais campos seu webhook aceitará
          </span>
        </Label>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dica</AlertTitle>
          <AlertDescription>
            Defina os campos que você espera receber nas requisições. O campo
            "keyHook" é obrigatório para autenticação e já foi adicionado
            automaticamente.
          </AlertDescription>
        </Alert>
      </div>

      <div className="border rounded-md mt-4">
        <div className="bg-muted p-3 border-b">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm">
            <div className="col-span-4">Nome do Campo</div>
            <div className="col-span-2">Tipo</div>
            <div className="col-span-1">Obrigatório</div>
            <div className="col-span-4">Descrição</div>
            <div className="col-span-1">Ações</div>
          </div>
        </div>

        <div className="divide-y">
          {fields.map((field) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 p-3 items-center"
            >
              <div className="col-span-4">
                <Input
                  value={field.name}
                  onChange={(e) =>
                    updateField(field.id, { name: e.target.value })
                  }
                  className={field.name === "keyHook" ? "bg-muted" : ""}
                  disabled={field.name === "keyHook"}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={field.type}
                  onValueChange={(value) =>
                    updateField(field.id, { type: value as FieldType })
                  }
                  disabled={field.name === "keyHook"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="boolean">Sim/Não</SelectItem>
                    <SelectItem value="object">Objeto</SelectItem>
                    <SelectItem value="array">Lista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 flex justify-center">
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateField(field.id, { required: checked })
                  }
                  disabled={field.name === "keyHook"}
                />
              </div>
              <div className="col-span-4">
                <Input
                  value={field.description || ""}
                  onChange={(e) =>
                    updateField(field.id, { description: e.target.value })
                  }
                  placeholder="Descrição do campo"
                  className={field.name === "keyHook" ? "bg-muted" : ""}
                  disabled={field.name === "keyHook"}
                />
              </div>
              <div className="col-span-1 flex justify-end items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveField(field.id, "up")}
                  disabled={
                    fields.indexOf(field) === 0 || field.name === "keyHook"
                  }
                  className="h-7 w-7"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveField(field.id, "down")}
                  disabled={
                    fields.indexOf(field) === fields.length - 1 ||
                    field.name === "keyHook"
                  }
                  className="h-7 w-7"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(field.id)}
                  disabled={field.name === "keyHook"}
                  className="h-7 w-7 text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t bg-muted/50">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Input
                placeholder="Nome do campo"
                value={newField.name}
                onChange={(e) =>
                  setNewField({ ...newField, name: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Select
                value={newField.type}
                onValueChange={(value) =>
                  setNewField({ ...newField, type: value as FieldType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="boolean">Sim/Não</SelectItem>
                  <SelectItem value="object">Objeto</SelectItem>
                  <SelectItem value="array">Lista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 flex justify-center">
              <Switch
                checked={newField.required}
                onCheckedChange={(checked) =>
                  setNewField({ ...newField, required: checked })
                }
              />
            </div>
            <div className="col-span-4">
              <Input
                placeholder="Descrição do campo"
                value={newField.description || ""}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="outline"
                onClick={addField}
                disabled={!newField.name}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
