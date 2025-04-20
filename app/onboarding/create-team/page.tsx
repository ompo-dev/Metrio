"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
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

// Lista de emojis para projetos
const PROJECT_ICONS = [
  "💼",
  "🚀",
  "💻",
  "📊",
  "📈",
  "🏢",
  "🔧",
  "🛠️",
  "📱",
  "🌐",
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
  const [selectedIcon, setSelectedIcon] = useState(PROJECT_ICONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validação básica
      if (!teamName.trim()) {
        toast.error("Por favor, informe um nome para o projeto");
        setIsLoading(false);
        return;
      }

      // Criar novo projeto
      const newTeam = {
        id: uuidv4(),
        name: teamName,
        logo: selectedIcon,
        plan: projectType || "Gratuito",
      };

      // Salvar no localStorage
      const existingTeams = localStorage.getItem("userTeams");
      const parsedTeams = existingTeams ? JSON.parse(existingTeams) : [];
      const updatedTeams = [...parsedTeams, newTeam];

      localStorage.setItem("userTeams", JSON.stringify(updatedTeams));
      localStorage.setItem("activeTeamId", newTeam.id);

      toast.success("Projeto criado com sucesso!");

      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast.error("Ocorreu um erro ao criar o projeto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Bem-vindo à Métricas SaaS</h1>
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
                  {PROJECT_ICONS.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={selectedIcon === icon ? "default" : "outline"}
                      size="icon"
                      className="h-10 w-10 text-lg"
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Projeto e Continuar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
