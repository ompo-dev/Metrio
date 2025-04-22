import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProjectStore } from "@/lib/store/project-store";
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

// Função auxiliar para leitura segura de JSON de responses
async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    console.error("Erro ao processar resposta JSON:", error);
    return null;
  }
}

export function InviteSection() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("email");
  const [emailInput, setEmailInput] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isLoadingLink, setIsLoadingLink] = useState(false);

  // Usar o store de projetos
  const {
    activeProject,
    fetchProjects,
    isLoading: isLoadingProjects,
  } = useProjectStore();

  // Função para buscar projetos do usuário
  useEffect(() => {
    // Carregar projetos usando a store
    fetchProjects();
  }, [fetchProjects]);

  // Função para buscar convites do projeto selecionado
  useEffect(() => {
    if (activeProject?.id) {
      fetchInvites();
    }
  }, [activeProject?.id]);

  async function fetchInvites() {
    if (!activeProject?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/invite?projectId=${activeProject.id}`
      );
      if (response.ok) {
        const data = await safeJsonParse(response);
        if (data) {
          setInvites(data.invites || []);
        } else {
          setInvites([]);
          toast({
            title: "Erro",
            description: "Formato de resposta inválido ao carregar convites.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os convites.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os convites.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Função para enviar convite por email
  async function handleSendEmailInvite() {
    if (!emailInput.trim() || !activeProject?.id) {
      toast({
        title: "Erro",
        description:
          "Por favor, forneça um email válido e aguarde o carregamento do projeto.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/projects/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.trim(),
          projectId: activeProject.id,
        }),
      });

      if (response.ok) {
        const data = await safeJsonParse(response);
        toast({
          title: "Sucesso",
          description: "Convite enviado com sucesso!",
        });
        setEmailInput("");
        fetchInvites(); // Atualizar lista de convites
      } else {
        const errorData = await safeJsonParse(response);
        toast({
          title: "Erro",
          description:
            (errorData && errorData.error) ||
            "Não foi possível enviar o convite.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Função para gerar link de convite
  async function handleGenerateInviteLink() {
    if (!activeProject?.id) {
      toast({
        title: "Erro",
        description: "Aguarde o carregamento do projeto.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLink(true);
    try {
      const response = await fetch("/api/projects/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `Aguardando uso do link de convite`, // Email temporário único
          projectId: activeProject.id,
        }),
      });

      if (response.ok) {
        const data = await safeJsonParse(response);
        if (data && data.invite) {
          const baseUrl = window.location.origin;
          // Novo formato do link de convite que aponta para a página de registro
          const link = `${baseUrl}/auth/register?inviteToken=${data.invite.inviteToken}&inviteProjectId=${activeProject.id}`;
          setInviteLink(link);
          toast({
            title: "Sucesso",
            description: "Link de convite gerado com sucesso!",
          });
        } else {
          toast({
            title: "Erro",
            description: "Formato de resposta inválido ao gerar link.",
            variant: "destructive",
          });
        }
      } else {
        const errorData = await safeJsonParse(response);
        toast({
          title: "Erro",
          description:
            (errorData && errorData.error) ||
            "Não foi possível gerar o link de convite.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar link de convite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de convite.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLink(false);
    }
  }

  // Função para copiar link para a área de transferência
  async function handleCopyLink() {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência.",
      });

      // Reset copy status after 3 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  }

  // Função para deletar um convite
  async function handleDeleteInvite(inviteId: string) {
    if (!inviteId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/invite?inviteId=${inviteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Convite excluído com sucesso!",
        });
        // Atualizar a lista de convites
        fetchInvites();
      } else {
        const errorData = await safeJsonParse(response);
        toast({
          title: "Erro",
          description:
            (errorData && errorData.error) ||
            "Não foi possível excluir o convite.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir convite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o convite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Tabs para convites */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Convite por Email</TabsTrigger>
          <TabsTrigger value="link">Convite por Link</TabsTrigger>
        </TabsList>

        {/* Convite por Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Convidar por Email</CardTitle>
              <CardDescription>
                Envie um convite para um email específico. Se o usuário já
                estiver registrado, ele receberá uma notificação.
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
                  disabled={isLoadingLink || !activeProject?.id}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  {isLoadingLink ? "Gerando link..." : "Gerar link de convite"}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lista de convites enviados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Convites Enviados</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInvites}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>

        {invites.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {isLoading
              ? "Carregando convites..."
              : "Nenhum convite enviado ainda."}
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <Card key={invite.id} className="group relative">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => handleDeleteInvite(invite.id)}
                    disabled={isLoading}
                    title="Excluir convite"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir convite</span>
                  </Button>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={invite.recipient?.image || undefined}
                        />
                        <AvatarFallback>
                          {invite.status === "pending" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            invite.email.substring(0, 2).toUpperCase()
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {invite.recipient?.email &&
                          invite.email.startsWith("temp_")
                            ? invite.recipient.email
                            : invite.email}
                          {invite.email.startsWith("temp_") && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              <LinkIcon className="h-3 w-3 mr-1" /> Convite por
                              Link
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Convite enviado em{" "}
                          {new Date(invite.createdAt).toLocaleDateString()}
                          {invite.email.startsWith("temp_") &&
                            invite.status === "pending" && (
                              <div className="mt-1 italic">
                                O email será exibido quando o convite for aceito
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div>{renderStatusBadge(invite.status)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
