import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardGridProps {
  children: React.ReactNode
  columns?: number
  className?: string
}

export function DashboardGrid({ children, columns = 4, className }: DashboardGridProps) {
  return (
    <div
      className={cn("grid gap-4", className)}
      style={{
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gridAutoRows: "minmax(120px, auto)",
      }}
    >
      {children}
    </div>
  )
} 