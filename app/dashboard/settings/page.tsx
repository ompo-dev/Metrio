import { SettingsHeader } from "@/app/dashboard/settings/components/settings-header";
import { SettingsForm } from "@/app/dashboard/settings/components/settings-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações | Metrics SaaS",
  description:
    "Gerencie suas configurações pessoais, notificações e preferências da conta",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-6 pb-16 pt-4">
        <SettingsHeader />
        <SettingsForm />
      </div>
    </div>
  );
}
