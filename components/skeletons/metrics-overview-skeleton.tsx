import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MetricsOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Skeleton para MetricsCards */}
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

      {/* Skeleton para Métricas de Desempenho */}
      <Card className="col-span-4">
        <CardHeader>
          <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>

      {/* Skeleton para Eventos Recentes */}
      <Card className="col-span-3">
        <CardHeader>
          <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
} 