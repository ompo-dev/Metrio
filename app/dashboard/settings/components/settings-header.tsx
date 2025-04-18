"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Settings,
  Bell,
  Users,
  CreditCard,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import SelectIcon from "@/components/select-icon";
import { Dispatch, SetStateAction } from "react";

interface SettingsHeaderProps {
  activeTab: "profile" | "notifications" | "billing" | "team";
  setActiveTab: Dispatch<
    SetStateAction<"profile" | "notifications" | "billing" | "team">
  >;
}

export function SettingsHeader({
  activeTab,
  setActiveTab,
}: SettingsHeaderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Configurações</h2>
          <div className="ml-2">
            <SelectIcon
              defaultValue={activeTab}
              options={[
                {
                  value: "profile",
                  label: "Perfil",
                  icon: <Users className="h-4 w-4" />,
                },
                {
                  value: "notifications",
                  label: "Notificações",
                  icon: <Bell className="h-4 w-4" />,
                },
                {
                  value: "billing",
                  label: "Faturamento",
                  icon: <CreditCard className="h-4 w-4" />,
                },
                {
                  value: "team",
                  label: "Equipe",
                  icon: <Building className="h-4 w-4" />,
                },
              ]}
              onChange={(value) => {
                setActiveTab(
                  value as "profile" | "notifications" | "billing" | "team"
                );
              }}
            />
          </div>
          {lastSaved && (
            <Badge
              variant="outline"
              className="ml-2 text-xs animate-in fade-in"
            >
              Salvo às {lastSaved}
            </Badge>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "transition-all duration-200 hover:scale-105",
            isSaving && "opacity-80"
          )}
        >
          <Save className={cn("mr-2 h-4 w-4", isSaving && "animate-spin")} />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
      <p className="text-muted-foreground">
        Gerencie suas configurações pessoais, notificações e preferências da
        conta
      </p>
    </div>
  );
}
