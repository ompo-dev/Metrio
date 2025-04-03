import { TeamMembers } from "@/components/teams/team-members"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Membros da Equipe | Metrics SaaS",
  description: "Gerencie os membros da sua equipe e permissões",
}

export default function TeamMembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TeamMembers />
    </div>
  )
}

