import { TeamPermissions } from "@/components/teams/team-permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Permissões de Equipe | Metrics SaaS",
  description: "Gerencie as permissões e funções da sua equipe",
}

export default function TeamPermissionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TeamPermissions />
    </div>
  )
}