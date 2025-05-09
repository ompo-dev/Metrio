"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Briefcase,
  Code,
  BarChart,
  LineChart,
  Building,
  Settings,
  Wrench,
  Smartphone,
  Globe,
  LucideIcon,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

// Lista de ícones para projetos
const PROJECT_ICONS = [
  { icon: Briefcase, name: "briefcase" },
  { icon: Rocket, name: "rocket" },
  { icon: Code, name: "code" },
  { icon: BarChart, name: "bar-chart" },
  { icon: LineChart, name: "line-chart" },
  { icon: Building, name: "building" },
  { icon: Settings, name: "settings" },
  { icon: Wrench, name: "wrench" },
  { icon: Smartphone, name: "smartphone" },
  { icon: Globe, name: "globe" },
];

// Tipos de projetos
const PROJECT_TYPES = [
  { value: "startup", label: "Startup" },
  { value: "saas", label: "SaaS" },
  { value: "micro-saas", label: "Micro SaaS" },
  { value: "agency", label: "Agência" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "personal", label: "Projeto Pessoal" },
  { value: "other", label: "Outro" },
];

export default function CreateTeamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(PROJECT_ICONS[0].name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validação básica
      if (!teamName.trim()) {
        toast.error("Por favor, informe um nome para o projeto");
        setIsLoading(false);
        return;
      }

      // Criar novo projeto usando Axios
      await api.post("/api/projects", {
        name: teamName,
        logoIcon: selectedIcon,
        type: projectType || null,
      });

      toast.success("Projeto criado com sucesso!");

      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      // O toast de erro já é exibido pelo interceptor do Axios
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Bem-vindo ao Metrio</h1>
          <p className="text-muted-foreground">
            Vamos criar seu primeiro projeto para começar
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Criar Projeto</CardTitle>
              <CardDescription>
                Configure as informações do seu projeto ou empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Nome do Projeto</Label>
                <Input
                  id="team-name"
                  placeholder="Ex: Minha Startup"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-type">Tipo de Projeto</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="project-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ícone do Projeto</Label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_ICONS.map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <Button
                        key={iconData.name}
                        type="button"
                        variant={
                          selectedIcon === iconData.name ? "default" : "outline"
                        }
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setSelectedIcon(iconData.name)}
                      >
                        <IconComponent className="size-5" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Projeto e Continuar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
