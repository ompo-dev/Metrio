"use client";

import { SettingsHeader } from "@/app/dashboard/settings/components/settings-header";
import { SettingsForm } from "@/app/dashboard/settings/components/settings-form";
import { useState } from "react";

export function SettingsFormContent() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "billing" | "team"
  >("profile");

  return (
    <div className="space-y-6">
      <SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <SettingsForm activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
