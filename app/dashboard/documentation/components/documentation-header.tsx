"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, BookOpen } from "lucide-react";
import SelectIcon from "@/components/select-icon";
import { Dispatch, SetStateAction } from "react";

interface DocumentationHeaderProps {
  activeTab: "webhooks" | "examples";
  setActiveTab: Dispatch<SetStateAction<"webhooks" | "examples">>;
}

export function DocumentationHeader({
  activeTab,
  setActiveTab,
}: DocumentationHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Documentação</h2>
            <div className="ml-2">
              <SelectIcon
                defaultValue={activeTab}
                options={[
                  {
                    value: "webhooks",
                    label: "Webhooks",
                    icon: <FileText className="h-4 w-4" />,
                  },
                  {
                    value: "examples",
                    label: "Exemplos",
                    icon: <BookOpen className="h-4 w-4" />,
                  },
                ]}
                onChange={(value) => {
                  setActiveTab(value as "webhooks" | "examples");
                }}
              />
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Documentação completa da API, webhooks e integrações disponíveis na
            plataforma.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar na documentação..."
              className="w-[200px] pl-8 md:w-[300px]"
            />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
