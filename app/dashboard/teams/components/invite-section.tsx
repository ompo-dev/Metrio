import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/lib/store/project-store";
import { useInviteStore } from "@/lib/store/invite-store";
import {
  Copy,
  Send,
  Link as LinkIcon,
  Check,
  X,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { DataTable, RowActions } from "@/components/data-table/Table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

// Interface para o modelo de convite
interface Invite {
  id: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  inviteToken: string;
  createdAt: string;
  expiresAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  recipient?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

export function InviteSection() {
  const { toast: uiToast } = useToast();
  const [activeTab, setActiveTab] = useState("email");
  const [emailInput, setEmailInput] = useState("");

  // Usar o store de projetos
  const { activeProject, fetchProjects } = useProjectStore();

  // Usar o store de convites
  const {
    invites,
    isLoading,
    inviteLink,
    linkCopied,
    fetchInvites,
    sendEmailInvite,
    generateInviteLink,
    copyLinkToClipboard,
    deleteInvite,
    deleteManyInvites,
  } = useInviteStore();

  // Função para buscar projetos do usuário
  useEffect(() => {
    // Carregar projetos usando a store
    fetchProjects();
  }, [fetchProjects]);

  // Função para buscar convites do projeto selecionado
  useEffect(() => {
    if (activeProject?.id) {
      fetchInvites(activeProject.id);
    }
  }, [activeProject?.id, fetchInvites]);

  // Função para enviar convite por email
  async function handleSendEmailInvite() {
    if (!emailInput.trim() || !activeProject?.id) {
      uiToast({
        title: "Erro",
        description:
          "Por favor, forneça um email válido e aguarde o carregamento do projeto.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendEmailInvite(emailInput.trim(), activeProject.id);
      setEmailInput("");
    } catch (error) {
      // Erros já tratados na store
    }
  }

  // Função para gerar link de convite
  async function handleGenerateInviteLink() {
    if (!activeProject?.id) {
      uiToast({
        title: "Erro",
        description: "Aguarde o carregamento do projeto.",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateInviteLink(activeProject.id);
    } catch (error) {
      // Erros já tratados na store
    }
  }

  // Função para copiar link para a área de transferência
  async function handleCopyLink() {
    if (!inviteLink) return;

    try {
      await copyLinkToClipboard(inviteLink);
    } catch (error) {
      // Erros já tratados na store
    }
  }

  // Função para deletar um convite
  async function handleDeleteInvite(inviteId: string) {
    if (!inviteId) return;

    try {
      await deleteInvite(inviteId);
    } catch (error) {
      // Erros já tratados na store
    }
  }

  // Função para renderizar o Avatar do convite com base no status e receptor
  function renderAvatar(invite: Invite) {
    return (
      <Avatar className="size-9">
        <AvatarImage src={invite.recipient?.image || undefined} />
        <AvatarFallback>
          {invite.status === "pending" ? (
            <Clock className="h-4 w-4" />
          ) : (
            invite.email.substring(0, 2).toUpperCase()
          )}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Render status badge
  function renderStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-300"
          >
            <Clock className="h-3 w-3 mr-1" /> Pendente
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-300"
          >
            <Check className="h-3 w-3 mr-1" /> Aceito
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-300"
          >
            <X className="h-3 w-3 mr-1" /> Rejeitado
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-300"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Expirado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  // Definição das colunas para a tabela de convites
  const columns: ColumnDef<Invite>[] = [
    {
      header: "Usuário",
      id: "user",
      accessorKey: "email",
      cell: ({ row }) => {
        const invite = row.original;
        const displayEmail =
          invite.recipient?.email && invite.email.startsWith("temp_")
            ? invite.recipient.email
            : invite.email;

        return (
          <div className="flex items-center gap-3">
            {renderAvatar(invite)}
            <div>
              <div className="font-medium flex items-center gap-2">
                {displayEmail}
              </div>
              {invite.email.startsWith("temp_") &&
                invite.status === "pending" && (
                  <div className="text-xs italic text-muted-foreground">
                    O email será exibido quando o convite for aceito
                  </div>
                )}
            </div>
          </div>
        );
      },
      size: 250,
    },
    {
      header: "Método",
      id: "method",
      cell: ({ row }) => {
        const invite = row.original;
        return (
          <Badge
            variant={
              invite.email.startsWith("temp_") ||
              invite.email === "Aguardando uso do link de convite"
                ? "outline"
                : "secondary"
            }
          >
            {invite.email.startsWith("temp_") ||
            invite.email === "Aguardando uso do link de convite" ? (
              <>
                <LinkIcon className="h-3 w-3 mr-1" /> Link
              </>
            ) : (
              <>
                <Send className="h-3 w-3 mr-1" /> Email
              </>
            )}
          </Badge>
        );
      },
      size: 100,
    },
    {
      header: "Data de Envio",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      },
      size: 150,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => renderStatusBadge(row.original.status),
      size: 120,
    },
    {
      header: "Expiração",
      accessorKey: "expiresAt",
      cell: ({ row }) => {
        const date = new Date(row.original.expiresAt);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
      size: 120,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RowActions
          row={row}
          actions={[
            {
              label: "Excluir convite",
              onClick: () => handleDeleteInvite(row.original.id),
              icon: <Trash2 className="h-4 w-4" />,
              destructive: true,
            },
          ]}
        />
      ),
      size: 70,
    },
  ];

  // Handler para excluir múltiplos convites
  const handleDeleteMultipleInvites = async (selectedInvites: Invite[]) => {
    try {
      const inviteIds = selectedInvites.map((invite) => invite.id);
      const result = await deleteManyInvites(inviteIds);

      uiToast({
        title: "Sucesso",
        description: `${result.removedCount} convites excluídos com sucesso!`,
      });
    } catch (error) {
      // Erros já tratados na store
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs para convites */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Convite Direto</TabsTrigger>
          <TabsTrigger value="link">Convite por Link</TabsTrigger>
        </TabsList>

        {/* Convite por Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Convite Direto</CardTitle>
              <CardDescription>
                Envie um convite para um email específico dentro do Metrio. Se o
                usuário já estiver registrado, ele receberá uma notificação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="nome@exemplo.com"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    isLoading || !emailInput.trim() || !activeProject?.id
                  }
                  onClick={handleSendEmailInvite}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar convite</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Convite por Link */}
        <TabsContent value="link">
          <Card>
            <CardHeader>
              <CardTitle>Convidar por Link</CardTitle>
              <CardDescription>
                Gere um link de convite para compartilhar com pessoas que ainda
                não possuem uma conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inviteLink ? (
                <div className="space-y-2">
                  <Label>Link de convite</Label>
                  <div className="flex space-x-2">
                    <Input
                      readOnly
                      value={inviteLink}
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copiar link</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleGenerateInviteLink}
                  className="w-full"
                  disabled={isLoading || !activeProject?.id}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  {isLoading ? "Gerando link..." : "Gerar link de convite"}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lista de convites enviados com DataTable */}
      {invites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Convites Enviados</h3>
          </div>

          <DataTable
            data={invites}
            columns={columns}
            searchColumn="user"
            searchPlaceholder="Filtrar convites..."
            statusColumn="status"
            onDeleteRows={handleDeleteMultipleInvites}
            enableRowSelection
            pageSize={5}
            pageSizeOptions={[5, 10, 20]}
            initialSorting={[{ id: "createdAt", desc: true }]}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </div>
      )}
    </div>
  );
}
