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
    <div className="flex flex-wrap gap-2 border-b bg-gray-50 px-4 py-2">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
          <span className="font-medium">{filter.field}</span>
          <span className="text-gray-500">{filter.operator.replace("_", " ")}</span>
          <span>{filter.value}</span>
          <button onClick={() => removeFilter(index)} className="ml-1 rounded-full p-0.5 hover:bg-gray-100">
            <X className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  )
} 