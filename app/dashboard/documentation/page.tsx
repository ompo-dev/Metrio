"use client";

import { DocumentationHeader } from "@/app/dashboard/documentation/components/documentation-header";
import { DocumentationContent } from "@/app/dashboard/documentation/components/documentation-content";
import { useState } from "react";

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<"webhooks" | "examples">(
    "webhooks"
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
      <DocumentationHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <DocumentationContent activeTab={activeTab} />
    </div>
  );
}
