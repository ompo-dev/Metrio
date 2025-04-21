"use client";

import WebhooksCreate from "@/app/dashboard/webhooks/components/webhook-create/webhooks-create";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateWebhookPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Criar Novo Webhook</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/webhooks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-700 flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          Novo Sistema de Webhooks
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          Configure seu webhook com os campos necessários e obtenha um endpoint
          exclusivo para receber notificações em tempo real. A URL final será
          fornecida após a criação.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <WebhooksCreate />
      </div>
    </div>
  );
}
