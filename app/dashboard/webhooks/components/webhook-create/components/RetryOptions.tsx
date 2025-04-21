import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebhookFormData } from "../types";

interface RetryOptionsProps {
  formData: WebhookFormData;
  onSwitchChange: (field: string, value: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<WebhookFormData>>;
}

export function RetryOptions({
  formData,
  onSwitchChange,
  setFormData,
}: RetryOptionsProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="retryOnFailure">
          Tentar novamente em caso de falha
        </Label>
        <Switch
          id="retryOnFailure"
          checked={formData.retryOnFailure}
          onCheckedChange={(checked) =>
            onSwitchChange("retryOnFailure", checked)
          }
        />
      </div>
      {formData.retryOnFailure && (
        <div className="pl-6 border-l-2 border-muted space-y-2">
          <Label htmlFor="maxRetries" className="text-sm">
            Número máximo de tentativas
          </Label>
          <Select
            value={formData.maxRetries.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, maxRetries: parseInt(value) })
            }
          >
            <SelectTrigger id="maxRetries" className="w-[180px]">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 tentativa</SelectItem>
              <SelectItem value="3">3 tentativas</SelectItem>
              <SelectItem value="5">5 tentativas</SelectItem>
              <SelectItem value="10">10 tentativas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
