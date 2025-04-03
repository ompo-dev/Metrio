import { TeamInvite } from "@/components/teams/team-invite"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Convidar Membros | Metrics SaaS",
  description: "Convide novos membros para sua equipe",
}

export default function TeamInvitePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TeamInvite />
    </div>
  )
} 