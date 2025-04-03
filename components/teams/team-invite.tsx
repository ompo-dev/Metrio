"use client"

import * as React from "react"
import { User, Mail, Link2, Copy, Check, Send } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Dados de exemplo para funções
const roles = [
  { id: "admin", name: "Admin" },
  { id: "gerente", name: "Gerente" },
  { id: "desenvolvedor", name: "Desenvolvedor" },
  { id: "analista", name: "Analista" },
  { id: "visualizador", name: "Visualizador" },
]

// Exemplo de convites pendentes
const pendingInvites = [
  {
    id: "i1",
    email: "mariana@empresa.com",
    role: "Analista",
    status: "Pendente",
    sent: "Há 2 dias",
  },
  {
    id: "i2",
    email: "lucas@empresa.com",
    role: "Desenvolvedor",
    status: "Pendente",
    sent: "Ontem",
  },
]

export function TeamInvite() {
  const [copied, setCopied] = React.useState(false)
  const [inviteLink, setInviteLink] = React.useState("https://metricas.com/convite/equipe/123456")
  const [emailList, setEmailList] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState("")
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Convidar Membros</h2>
      </div>
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="email">Por Email</TabsTrigger>
          <TabsTrigger value="link">Link de Convite</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Convite por Email</CardTitle>
              <CardDescription>
                Envie convites por email para seus colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Emails</Label>
                <Textarea 
                  id="emails" 
                  placeholder="Insira emails separados por vírgula ou linha" 
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Você pode adicionar até 20 emails por vez
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem Personalizada (opcional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Adicione uma mensagem personalizada ao convite" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Enviar Convites
              </Button>
            </CardFooter>
          </Card>
          
          {pendingInvites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Convites Pendentes</CardTitle>
                <CardDescription>
                  Convites que ainda não foram aceitos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingInvites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{invite.email[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{invite.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Função: {invite.role} • Enviado: {invite.sent}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-500 font-medium">
                          {invite.status}
                        </span>
                        <Button variant="ghost" size="sm">Reenviar</Button>
                        <Button variant="ghost" size="sm">Cancelar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Link de Convite</CardTitle>
              <CardDescription>
                Compartilhe este link com pessoas que você deseja convidar para sua equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Link de Convite</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={inviteLink} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link-role">Função Padrão para este Link</Label>
                <Select>
                  <SelectTrigger id="link-role">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Prefere enviar o convite você mesmo?</p>
                    <p className="text-muted-foreground">
                      Você pode copiar este link e compartilhar por email, Slack, WhatsApp ou qualquer outro meio.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Gerar Novo Link</Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Link2 className="h-4 w-4" />
                Configurações de Link
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Controle de Acesso</CardTitle>
              <CardDescription>
                Configure opções de segurança para convites por link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Opções de controle de acesso serão exibidas aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 