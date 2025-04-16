import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiInsightsHeader } from "@/app/dashboard/ai/components/ai-insights-header";
import { AiInsightsDashboard } from "@/app/dashboard/ai/components/ai-insights-dashboard";
import { AIAssistant } from "@/app/dashboard/ai/components/ai-assistant";
import { AIFeatures } from "@/app/dashboard/ai/components/ai-features";

export default function AiInsightsPage() {
  return (
    <div className="flex flex-col space-y-6 p-4 md:p-8">
      <AiInsightsHeader />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="dashboard" className="flex-1">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="ai-features" className="flex-1">
            Recursos de IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <AiInsightsDashboard />
        </TabsContent>

        <TabsContent value="ai-features" className="mt-6">
          <AIFeatures />
        </TabsContent>
      </Tabs>

      <AIAssistant />
    </div>
  );
}
