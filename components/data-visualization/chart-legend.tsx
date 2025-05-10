"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SeriesConfig } from "./types"

interface ChartLegendProps {
  series: SeriesConfig[]
  activeSeries: string[]
  toggleSeries: (seriesKey: string) => void
}

export function ChartLegend({ series, activeSeries, toggleSeries }: ChartLegendProps) {
  return (
    <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
      {series.map((seriesConfig) => (
        <button
          key={seriesConfig.key}
          className="flex items-center gap-1 sm:gap-2"
          onClick={() => toggleSeries(seriesConfig.key)}
          aria-pressed={activeSeries.includes(seriesConfig.key)}
        >
          <div
            className={cn("h-2 w-2 sm:h-3 sm:w-3 rounded-full", {
              "opacity-50": !activeSeries.includes(seriesConfig.key),
            })}
            style={{ backgroundColor: seriesConfig.color }}
          />
          <span
            className={cn("text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]", {
              "font-medium": activeSeries.includes(seriesConfig.key),
              "text-gray-400": !activeSeries.includes(seriesConfig.key),
            })}
          >
            {seriesConfig.label}
          </span>
        </button>
      ))}
    </div>
  )
} 