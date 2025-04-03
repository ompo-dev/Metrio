import { TeamsManagement } from "@/components/teams/teams-management"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gerenciamento de Equipes | Metrics SaaS",
  description: "Gerencie suas equipes, membros e permissões",
}

export default function TeamsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TeamsManagement />
    </div>
  )
}

