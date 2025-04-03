"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Settings, Bell, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsHeader() {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const handleSave = () => {
    setIsSaving(true)
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false)
      setLastSaved(new Date().toLocaleTimeString())
    }, 1000)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          {lastSaved && (
            <Badge variant="outline" className="ml-2 text-xs animate-in fade-in">
              Salvo às {lastSaved}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-4 border rounded-md px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Perfil</span>
            </div>
            <div className="h-4 border-r border-gray-200"></div>
            <div className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4 text-primary" />
              <span>Notificações</span>
            </div>
            <div className="h-4 border-r border-gray-200"></div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Faturamento</span>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className={cn(
              "transition-all duration-200 hover:scale-105",
              isSaving && "opacity-80"
            )}
          >
            <Save className={cn(
              "mr-2 h-4 w-4",
              isSaving && "animate-spin"
            )} />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground max-w-2xl">
          Configure as preferências da sua conta, notificações e outras configurações. 
          Estas alterações afetarão apenas sua experiência pessoal.
        </p>
        <div className="hidden md:block"></div>
      </div>
    </div>
  )
}

