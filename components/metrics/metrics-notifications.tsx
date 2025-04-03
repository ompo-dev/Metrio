"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Save } from "lucide-react"

export function MetricsNotifications() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Configuração de Webhooks</CardTitle>
          <CardDescription>Configure URLs para receber notificações em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <div className="flex gap-2">
                <Input id="webhook-url" placeholder="https://sua-api.com/webhook" />
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Esta URL receberá notificações em formato JSON quando eventos ocorrerem.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Eventos para Notificar</h4>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="cadastro" />
                    <Label htmlFor="cadastro">Cadastros</Label>
                  </div>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="login" />
                    <Label htmlFor="login">Logins</Label>
                  </div>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="compra" />
                    <Label htmlFor="compra">Compras</Label>
                  </div>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="erro" />
                    <Label htmlFor="erro">Erros</Label>
                  </div>
                  <Badge variant="outline">Ativo</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
          <CardDescription>Configure como deseja receber alertas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="push" />
              <Label htmlFor="push">Notificações Push</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sms" />
              <Label htmlFor="sms">SMS</Label>
            </div>
            <div className="mt-4">
              <Label htmlFor="email-address">Email para notificações</Label>
              <div className="flex gap-2 mt-1">
                <Input id="email-address" placeholder="seu@email.com" />
                <Button size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Verificar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

