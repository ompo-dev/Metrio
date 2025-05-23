"use client"

import * as React from "react"
import { BarChart2, LineChart, AreaChart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfigIconsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  setConfigPanelExpanded: (expanded: boolean) => void
}

export function ConfigIcons({ activeTab, setActiveTab, setConfigPanelExpanded }: ConfigIconsProps) {
  return (
    <div className="h-full py-2 sm:py-4 flex flex-col items-center">
      <div className="mb-4 sm:mb-8"></div> {/* Spacer to align with expanded view */}
      <button
        onClick={() => {
          setActiveTab("general")
          setConfigPanelExpanded(true)
        }}
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-4 rounded-full flex items-center justify-center",
          activeTab === "general" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
        )}
        title="Geral"
      >
        <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={() => {
          setActiveTab("display")
          setConfigPanelExpanded(true)
        }}
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-4 rounded-full flex items-center justify-center",
          activeTab === "display" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
        )}
        title="Exibição"
      >
        <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={() => {
          setActiveTab("x-axis")
          setConfigPanelExpanded(true)
        }}
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-4 rounded-full flex items-center justify-center",
          activeTab === "x-axis" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
        )}
        title="Eixo-X"
      >
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={() => {
          setActiveTab("y-axis")
          setConfigPanelExpanded(true)
        }}
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-4 rounded-full flex items-center justify-center",
          activeTab === "y-axis" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-100"
        )}
        title="Eixo-Y"
      >
        <AreaChart className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  )
} 