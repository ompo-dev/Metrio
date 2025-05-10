"use client"

import * as React from "react"
import { X } from "lucide-react"
import { FilterConfig } from "./types"

interface FilterBarProps {
  filters: FilterConfig[]
  removeFilter: (index: number) => void
}

export function FilterBar({ filters, removeFilter }: FilterBarProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 border-b bg-gray-50 px-2 sm:px-4 py-1.5 sm:py-2">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2 rounded-full bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm shadow-sm">
          <span className="font-medium truncate max-w-[80px] sm:max-w-[120px]">{filter.field}</span>
          <span className="text-gray-500 text-[10px] sm:text-xs">{filter.operator.replace("_", " ")}</span>
          <span className="truncate max-w-[60px] sm:max-w-[100px]">{filter.value}</span>
          <button onClick={() => removeFilter(index)} className="ml-0.5 sm:ml-1 rounded-full p-0.5 hover:bg-gray-100">
            <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  )
} 