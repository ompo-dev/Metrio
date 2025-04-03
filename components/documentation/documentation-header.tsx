import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText } from "lucide-react"

export function DocumentationHeader() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documentação</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar na documentação..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Documentação completa da API, webhooks e integrações disponíveis na plataforma.
      </p>
    </div>
  )
}

