"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Key, RefreshCw, Shield } from "lucide-react"

export function SecuritySettings() {
  return (
    <Tabs defaultValue="api-keys" className="space-y-4">
      <TabsList>
        <TabsTrigger value="api-keys">Chaves de API</TabsTrigger>
        <TabsTrigger value="authentication">Autenticação</TabsTrigger>
        <TabsTrigger value="encryption">Criptografia</TabsTrigger>
      </TabsList>
      <TabsContent value="api-keys" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Chaves de API</CardTitle>
            <CardDescription>Gerencie suas chaves de API para autenticar requisições</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Chave de Produção</h3>
                  <p className="text-sm text-muted-foreground">Use esta chave para ambiente de produção</p>
                </div>
                <Badge>Ativa</Badge>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Input value="sk_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copiar</span>
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Criada em: 10/10/2023</span>
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Regenerar
                </Button>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Chave de Desenvolvimento</h3>
                  <p className="text-sm text-muted-foreground">Use esta chave para testes e desenvolvimento</p>
                </div>
                <Badge variant="outline">Desenvolvimento</Badge>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Input value="sk_dev_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4" readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copiar</span>
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Criada em: 15/09/2023</span>
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Regenerar
                </Button>
              </div>
            </div>
            <Button>
              <Key className="mr-2 h-4 w-4" />
              Gerar Nova Chave
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="authentication" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Autenticação</CardTitle>
            <CardDescription>Configure métodos de autenticação e segurança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">Autenticação de Dois Fatores (2FA)</Label>
                <p className="text-sm text-muted-foreground">Requer verificação adicional ao fazer login</p>
              </div>
              <Switch id="2fa" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ip-whitelist">Lista de IPs Permitidos</Label>
                <p className="text-sm text-muted-foreground">Restringe acesso à API apenas para IPs específicos</p>
              </div>
              <Switch id="ip-whitelist" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rate-limit">Limite de Requisições</Label>
                <p className="text-sm text-muted-foreground">Limita o número de requisições por minuto</p>
              </div>
              <Switch id="rate-limit" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-limit-value">Requisições por Minuto</Label>
              <Input id="rate-limit-value" type="number" defaultValue="100" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Salvar Configurações</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="encryption" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Criptografia de Dados</CardTitle>
            <CardDescription>Configure como seus dados são criptografados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encrypt-data">Criptografia em Repouso</Label>
                <p className="text-sm text-muted-foreground">Criptografa todos os dados armazenados</p>
              </div>
              <Switch id="encrypt-data" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encrypt-transit">Criptografia em Trânsito</Label>
                <p className="text-sm text-muted-foreground">Requer HTTPS para todas as comunicações</p>
              </div>
              <Switch id="encrypt-transit" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="field-level">Criptografia em Nível de Campo</Label>
                <p className="text-sm text-muted-foreground">Criptografa campos sensíveis individualmente</p>
              </div>
              <Switch id="field-level" />
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Certificado SSL</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Seu certificado SSL está ativo e válido até 15/10/2024
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Certificado
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renovar
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Verificar Configurações de Segurança
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

