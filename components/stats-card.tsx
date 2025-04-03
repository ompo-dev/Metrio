import { ArrowUpRight, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+2,350</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500 flex items-center">
            +12.5% <ArrowUpRight className="ml-1 h-3 w-3" />
          </span>
        </p>
      </CardContent>
    </Card>
  )
} 