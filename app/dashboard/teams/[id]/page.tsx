import { TeamDetails } from "@/components/teams/team-details"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Detalhes da Equipe | Metrics SaaS",
  description: "Visualize detalhes completos da equipe",
}

export default function TeamDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TeamDetails teamId={params.id} />
    </div>
  )
} 