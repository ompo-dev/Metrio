import { AiInsightsHeader } from "@/components/ai-insights/ai-insights-header"
import { AiInsightsDashboard } from "@/components/ai-insights/ai-insights-dashboard"
import { AIAssistant } from "@/components/ai-assistant/ai-assistant"

export default function AiInsightsPage() {
  return (
    <>
      <AiInsightsHeader />
      <AiInsightsDashboard />
      <AIAssistant />
    </>
  )
}

