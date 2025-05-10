"use client"

import { useEffect, useState } from "react"
import { ChartDashboard, ChartSkeleton } from "@/components/data-visualization/chart-dashboard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ChartData {
  title: string
  data: Array<Record<string, string | number | boolean>>
}

export default function Home() {
  // Estado para armazenar os dados carregados diretamente
  const [salesData, setSalesData] = useState<ChartData | null>(null)
  const [regionalData, setRegionalData] = useState<ChartData | null>(null)
  const [errorLogsData, setErrorLogsData] = useState<ChartData | null>(null)
  const [loginLogsData, setLoginLogsData] = useState<ChartData | null>(null)
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

        // Carrega os dados de logs de erro
        const errorLogsResponse = await fetch("/data/error-logs.json")
        if (!errorLogsResponse.ok) {
          throw new Error(`Failed to load error logs data: ${errorLogsResponse.status}`)
        }
        const errorLogsData = await errorLogsResponse.json()
        setErrorLogsData(errorLogsData)
        
        // Carrega os dados de logs de login
        const loginLogsResponse = await fetch("/data/login-logs.json")
        if (!loginLogsResponse.ok) {
          throw new Error(`Failed to load login logs data: ${loginLogsResponse.status}`)
        }
        const loginLogsData = await loginLogsResponse.json()
        setLoginLogsData(loginLogsData)

        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
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
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-12 space-y-8">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
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
            
            {errorLogsData && (
              <div className="mx-auto max-w-6xl">
                <ChartDashboard title={errorLogsData.title} data={errorLogsData.data} />
              </div>
            )}
            
            {loginLogsData && (
              <div className="mx-auto max-w-6xl">
                <ChartDashboard title={loginLogsData.title} data={loginLogsData.data} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}