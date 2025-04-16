"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function SecurityHeader() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Segurança</h2>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Verificar Segurança
        </Button>
      </div>
      <p className="text-muted-foreground">
        Configure as opções de segurança e autenticação para proteger seus dados e APIs.
      </p>
    </div>
  )
}

