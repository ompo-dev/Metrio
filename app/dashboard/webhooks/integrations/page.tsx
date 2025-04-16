import { WebhooksIntegrations } from "@/app/dashboard/webhooks/components/webhooks-integrations";

export default function WebhooksIntegrationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <WebhooksIntegrations />
    </div>
  );
}
