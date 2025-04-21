"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { webhooksApi } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/store/project-store";
import { SchemaField, WebhookFormData, ExtendedSession } from "./types";
import { webhookTemplates } from "./constants";
import { parseSchemaToFields, generateSecretKey } from "./utils";
import { BasicInformationForm } from "./components/BasicInformationForm";
import { SchemaBuilder } from "./components/SchemaBuilder";
import { ExampleRequest } from "./components/ExampleRequest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function WebhooksCreate() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado inicial dos campos do formulário
  const initialFields: SchemaField[] = [
    {
      id: "field_userId",
      name: "userId",
      type: "number",
      required: true,
      description: "ID do usuário",
    },
    {
      id: "field_value",
      name: "value",
      type: "string",
      required: true,
      description: "Valor da transação",
    },
    {
      id: "field_currency",
      name: "currency",
      type: "string",
      required: true,
      description: "Moeda (ex: BRL, USD)",
    },
    {
      id: "field_itemId",
      name: "itemId",
      type: "number",
      required: true,
      description: "ID do item",
    },
    {
      id: "field_keyHook",
      name: "keyHook",
      type: "string",
      required: true,
      description: "Chave de autenticação",
    },
  ];

  // Estado inicial do formulário
  const initialFormData: WebhookFormData = {
    name: "",
    hookName: "",
    url: "",
    secret: "",
    description: "",
    isActive: true,
    retryOnFailure: true,
    maxRetries: 5,
    eventFormat: "json",
    isShared: false,
  };

  const initialNewField: SchemaField = {
    id: "",
    name: "",
    type: "string",
    required: true,
    description: "",
  };

  const [fields, setFields] = useState<SchemaField[]>(initialFields);
  const [formData, setFormData] = useState<WebhookFormData>(initialFormData);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newField, setNewField] = useState<SchemaField>(initialNewField);

  // Estados para o diálogo de confirmação
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdWebhook, setCreatedWebhook] = useState<any>(null);

  // Usar a store de projetos
  const { activeProject } = useProjectStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = webhookTemplates.find((t) => t.id === templateId);
    if (template) {
      // Converter o schema do template para campos visuais
      setFields(parseSchemaToFields(template.schema));

      toast({
        title: "Template aplicado",
        description: `O template "${template.title}" foi aplicado com sucesso.`,
        duration: 3000,
      });
    }
  };

  const generateSecret = () => {
    setFormData({
      ...formData,
      secret: generateSecretKey(),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência",
      duration: 2000,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (!formData.name || !formData.hookName || !formData.secret) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive",
        duration: 5000,
      });
      console.log("Erro: campos obrigatórios ausentes");
      return;
    }

    // Verificar se há o campo keyHook
    if (!fields.some((field) => field.name === "keyHook")) {
      toast({
        title: "Campo keyHook obrigatório",
        description:
          "Seu schema deve incluir o campo 'keyHook' para autenticação.",
        variant: "destructive",
        duration: 5000,
      });
      console.log("Erro: campo keyHook ausente");
      return;
    }

    // Verificar se existe um projeto ativo
    if (!activeProject?.id) {
      toast({
        title: "Nenhum projeto selecionado",
        description: "Selecione um projeto para criar um webhook",
        variant: "destructive",
        duration: 5000,
      });
      console.log("Erro: nenhum projeto ativo encontrado");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Definindo estado de submissão para true");

      // Usar type assertion para acessar o ID do usuário
      const extendedSession = session as unknown as ExtendedSession;
      const userId = extendedSession.user.id;
      console.log("User ID encontrado:", userId);

      if (!userId) {
        toast({
          title: "ID do usuário não encontrado",
          description: "Não foi possível identificar o ID do usuário.",
          variant: "destructive",
          duration: 5000,
        });
        console.log("Erro: ID do usuário não encontrado");
        setIsSubmitting(false);
        return;
      }

      // Preparar dados para a API
      const payloadSchema = {
        fields: fields.map((field) => ({
          name: field.name,
          type: field.type,
          required: field.required,
          description: field.description || "",
        })),
        version: "1.0",
      };

      const webhookData = {
        name: formData.name,
        technicalName: formData.hookName,
        description: formData.description,
        secretToken: formData.secret,
        events: ["custom.event"],
        isActive: formData.isActive,
        payloadSchema,
        projectId: activeProject.id,
        userId,
        headers: [],
      };

      console.log("Dados do webhook preparados:", webhookData);
      console.log("Chamando API para criar webhook...");

      // Chamar a API com tratamento de erro mais detalhado
      try {
        const response = await webhooksApi.create(webhookData);
        console.log("Resposta da API:", response);

        // Armazenar os dados do webhook criado
        setCreatedWebhook({
          id: response.id,
          name: response.name,
          projectId: activeProject.id,
          url: `http://localhost:3000/api/webhook/${activeProject.id}/${response.id}`,
          secret: formData.secret,
          fields: fields,
        });

        // Exibir o diálogo de confirmação
        setShowSuccessDialog(true);

        toast({
          title: "Webhook criado com sucesso!",
          description:
            "Seu novo webhook foi configurado e está pronto para receber eventos.",
          duration: 5000,
        });
      } catch (apiError: any) {
        console.error(
          "Erro específico da API:",
          apiError?.response?.data || apiError
        );

        // Fornecer mensagem de erro mais específica
        const errorMessage =
          apiError?.response?.data?.error ||
          "Erro desconhecido ao comunicar com a API";

        toast({
          title: "Erro ao criar webhook",
          description: `Erro da API: ${errorMessage}`,
          variant: "destructive",
          duration: 7000,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erro geral ao criar webhook:", error);
      toast({
        title: "Erro ao criar webhook",
        description:
          "Ocorreu um erro ao processar sua solicitação. Verifique o console para mais detalhes.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
      console.log("Processamento do formulário finalizado");
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFields(initialFields);
    setFormData(initialFormData);
    setSelectedTemplate(null);
    setNewField(initialNewField);
    setShowSuccessDialog(false);
    setCreatedWebhook(null);

    toast({
      title: "Formulário resetado",
      description: "Você pode criar um novo webhook agora",
      duration: 3000,
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Webhook</CardTitle>
            <CardDescription>
              Configure um novo webhook para receber notificações em tempo real
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <BasicInformationForm
              formData={formData}
              onInputChange={handleInputChange}
              onSwitchChange={handleSwitchChange}
              generateSecret={generateSecret}
            />

            {/* Construtor de Schema */}
            <div className="pt-4 border-t mt-4">
              <SchemaBuilder
                fields={fields}
                setFields={setFields}
                newField={newField}
                setNewField={setNewField}
              />
            </div>

            {/* Exemplo de Requisição */}
            <ExampleRequest fields={fields} formData={formData} />
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-6 px-6 py-4 border-t">
            <Button
              variant="outline"
              type="button"
              className="w-full sm:w-auto"
              onClick={() => router.push("/dashboard/webhooks")}
            >
              Cancelar
            </Button>

            <div className="flex-1 flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Webhook"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>

      {/* Diálogo de confirmação após criação do webhook */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Webhook criado com sucesso!</DialogTitle>
            <DialogDescription>
              Abaixo estão as informações do seu novo webhook. Guarde essas
              informações para integrar com sua aplicação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">URL do Webhook</p>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={createdWebhook?.url || ""}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(createdWebhook?.url || "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Utilize esta URL para receber notificações
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Chave de Autenticação</p>
              <div className="flex items-center space-x-2">
                <Input
                  readOnly
                  value={createdWebhook?.secret || ""}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(createdWebhook?.secret || "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Necessária em todas as requisições como{" "}
                <code className="bg-muted px-1 py-0.5 rounded">keyHook</code>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={resetForm} className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Criar Novo Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
