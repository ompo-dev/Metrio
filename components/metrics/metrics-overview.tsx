import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricsCards } from "@/components/metrics/metrics-cards"
import { MetricsChart } from "@/components/metrics/metrics-chart"
import { MetricsTable } from "@/components/metrics/metrics-table"

// Skeletons
const ChartSkeleton = () => (
  <div className="h-[250px] w-full animate-pulse rounded-lg bg-muted" />
)

const TableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-2">
        <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-1/4 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-1/5 animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
      </div>
    ))}
  </div>
)

export function MetricsOverview() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader className="h-20">
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-1/3 animate-pulse rounded-md bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-7 w-1/3 animate-pulse rounded-md bg-muted" />
                <div className="mt-2 h-4 w-1/4 animate-pulse rounded-md bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <MetricsCards />
      </Suspense>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Métricas de Desempenho</CardTitle>
          <CardDescription>Visualização das principais métricas de desempenho ao longo do tempo.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Suspense fallback={<ChartSkeleton />}>
            <MetricsChart />
          </Suspense>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
          <CardDescription>Lista dos eventos mais recentes registrados na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <MetricsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

