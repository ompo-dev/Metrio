import { WebhooksTester } from "@/app/dashboard/webhooks/components/webhooks-tester";

export default function WebhooksTesterPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <WebhooksTester />
    </div>
  );
}
