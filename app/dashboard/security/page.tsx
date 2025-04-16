import { EnterpriseSecurity } from "@/app/dashboard/security/components/enterprise-security";

export default function SecurityPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <EnterpriseSecurity />
    </div>
  );
}
