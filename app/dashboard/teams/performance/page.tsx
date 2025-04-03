import { TeamPerformance } from "@/components/teams/team-performance"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Desempenho de Equipes | Metrics SaaS",
  description: "Acompanhe o desempenho e produtividade das suas equipes",
}

export default function TeamPerformancePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TeamPerformance />
    </div>
  )
} 