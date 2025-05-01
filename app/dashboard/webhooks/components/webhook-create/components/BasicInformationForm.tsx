import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WebhookFormData } from "../types";

interface BasicInformationFormProps {
  formData: WebhookFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSwitchChange: (field: string, value: boolean) => void;
  generateSecret: () => void;
}

export function BasicInformationForm({
  formData,
  onInputChange,
  onSwitchChange,
  generateSecret,
}: BasicInformationFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome do Webhook <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Notificação de Cadastros"
            value={formData.name}
            onChange={onInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hookName">
            Nome Técnico do Hook <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="hookName"
              placeholder="Ex: payment-webhook"
              value={formData.hookName}
              onChange={(e) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-") // Substituir espaços por hífens
                  .replace(/[^a-z0-9-]/g, ""); // Remover caracteres não alfanuméricos

                onInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    id: "hookName",
                    value,
                  },
                });
              }}
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Nome técnico que será usado na URL (apenas letras, números e
                    traços)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground">
            Este nome será usado para identificar seu webhook
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="secret">
              Chave Secreta <span className="text-destructive">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={generateSecret}
              className="h-5 text-xs px-2"
            >
              Gerar
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              id="secret"
              type="text"
              placeholder="whsec_..."
              value={formData.secret}
              onChange={onInputChange}
              className="flex-1 font-mono text-xs"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Chave secreta que será enviada no corpo da requisição para
                    validação
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground">
            Enviada como{" "}
            <code className="bg-muted px-1 py-0.5 rounded">keyHook</code>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição do propósito deste webhook"
          value={formData.description}
          onChange={onInputChange}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="webhook-active"
            checked={formData.isActive}
            onCheckedChange={(checked) => onSwitchChange("isActive", checked)}
          />
          <Label htmlFor="webhook-active">
            Ativar webhook imediatamente após a criação
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="webhook-shared"
            checked={formData.isShared}
            onCheckedChange={(checked) => onSwitchChange("isShared", checked)}
          />
          <Label htmlFor="webhook-shared">Compartilhar com a equipe</Label>
        </div>
      </div>
    </div>
  );
}
