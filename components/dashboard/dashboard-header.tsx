import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Métricas</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>
    </div>
  )
}

