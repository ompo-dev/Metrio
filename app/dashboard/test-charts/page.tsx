"use client"

import { useEffect, useState } from "react"
import { ChartDashboard } from "@/components/data-visualization/chart-dashboard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

interface ChartData {
  title: string
  data: Array<Record<string, string | number>>
}

// Dados de fallback para caso o carregamento falhe
const fallbackSalesData: ChartData = {
  title: "Monthly Sales by Product Category (Fallback)",
  data: [
    { month: "Oct 2022", books: 600, clothing: 1400, electronics: 200, tools: 1000, widgets: 1500 },
    { month: "Nov 2022", books: 2200, clothing: 3500, electronics: 1700, tools: 4500, widgets: 3600 },
    { month: "Dec 2022", books: 3400, clothing: 5400, electronics: 2100, tools: 5000, widgets: 6400 },
    { month: "Jan 2023", books: 3500, clothing: 6100, electronics: 2200, tools: 5000, widgets: 6500 },
    { month: "Feb 2023", books: 4900, clothing: 8600, electronics: 2200, tools: 4000, widgets: 7600 },
    { month: "Mar 2023", books: 3900, clothing: 4800, electronics: 1900, tools: 5900, widgets: 5400 },
  ],
}

const fallbackRegionalData: ChartData = {
  title: "Regional Performance Metrics (Fallback)",
  data: [
    { month: "Jan 2023", north: 4500, south: 3200, east: 5100, west: 6800, central: 4200 },
    { month: "Feb 2023", north: 5200, south: 3800, east: 4800, west: 7200, central: 5100 },
    { month: "Mar 2023", north: 6100, south: 4500, east: 5300, west: 6500, central: 5800 },
    { month: "Apr 2023", north: 7800, south: 5200, east: 6200, west: 8100, central: 6300 },
    { month: "May 2023", north: 8500, south: 6100, east: 7400, west: 9200, central: 7500 },
    { month: "Jun 2023", north: 7200, south: 5800, east: 6800, west: 8500, central: 6900 },
  ],
}

export default function Home() {
  // Estado para armazenar os dados carregados diretamente
  const [salesData, setSalesData] = useState<ChartData | null>(null)
  const [regionalData, setRegionalData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Carrega os dados diretamente na montagem do componente
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // Carrega os dados de vendas
        const salesResponse = await fetch("/data/sales-data.json")
        if (!salesResponse.ok) {
          throw new Error(`Failed to load sales data: ${salesResponse.status}`)
        }
        const salesData = await salesResponse.json()
        setSalesData(salesData)

        // Carrega os dados regionais
        const regionalResponse = await fetch("/data/regional-data.json")
        if (!regionalResponse.ok) {
          throw new Error(`Failed to load regional data: ${regionalResponse.status}`)
        }
        const regionalData = await regionalResponse.json()
        setRegionalData(regionalData)

        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err : new Error(String(err)))

        // Usa dados de fallback em caso de erro
        setSalesData(fallbackSalesData)
        setRegionalData(fallbackRegionalData)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard de Visualização de Dados</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {error.message}
            <p className="mt-2">Usando dados de fallback para demonstração.</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-12 space-y-8">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {salesData && (
              <div className="mx-auto max-w-6xl">
                <ChartDashboard title={salesData.title} data={salesData.data} />
              </div>
            )}

            {regionalData && (
              <div className="mx-auto max-w-6xl">
                <ChartDashboard title={regionalData.title} data={regionalData.data} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

function ChartSkeleton() {
  return (
    <div className="mx-auto max-w-6xl rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}