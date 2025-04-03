"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Grip, X, Maximize, Minimize, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface DashboardWidgetProps {
  children: React.ReactNode
  id: string
  colSpan?: number
  rowSpan?: number
  className?: string
  isDragging?: boolean
  onResize?: (id: string, colSpan: number, rowSpan: number) => void
  onDragStart?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDragEnd?: () => void
  onRemove?: () => void
}

export function DashboardWidget({
  children,
  id,
  colSpan = 1,
  rowSpan = 1,
  className,
  isDragging = false,
  onResize,
  onDragStart,
  onDragOver,
  onDragEnd,
  onRemove,
}: DashboardWidgetProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [tempColSpan, setTempColSpan] = useState(colSpan)
  const [tempRowSpan, setTempRowSpan] = useState(rowSpan)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [prevSize, setPrevSize] = useState({ colSpan, rowSpan })
  const [isResizeDialogOpen, setIsResizeDialogOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const widgetRef = useRef<HTMLDivElement>(null)

  // Update temp spans when props change
  useEffect(() => {
    if (!isResizing) {
      setTempColSpan(colSpan)
      setTempRowSpan(rowSpan)
    }
  }, [colSpan, rowSpan, isResizing])

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    onDragStart?.()
  }

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling

    if (isCollapsed) {
      // Restore previous size
      onResize?.(id, prevSize.colSpan, prevSize.rowSpan)
      setIsCollapsed(false)
    } else {
      // Save current size and collapse
      setPrevSize({ colSpan, rowSpan })
      onResize?.(id, colSpan, 1)
      setIsCollapsed(true)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    onRemove?.()
  }

  const handleSizeSelect = (newColSpan: number, newRowSpan: number) => {
    if (onResize && (newColSpan !== colSpan || newRowSpan !== rowSpan)) {
      onResize(id, newColSpan, newRowSpan)
    }
    setIsResizeDialogOpen(false)
  }

  const handleOpenResizeDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizeDialogOpen(true)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={widgetRef}
      className={cn(
        "relative rounded-lg border bg-card text-card-foreground shadow group",
        isDragging ? "ring-2 ring-primary z-20 opacity-70" : "",
        isResizing ? "ring-2 ring-primary z-10" : "",
        className,
      )}
      style={{
        gridColumn: `span ${Math.round(tempColSpan)}`,
        gridRow: `span ${Math.round(tempRowSpan)}`,
        minHeight: isCollapsed ? "80px" : `${Math.round(tempRowSpan) * 120}px`,
        height: "100%",
      }}
      layout
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.2,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      draggable={true}
      onDragStart={() => onDragStart?.()}
      onDragOver={(e) => onDragOver?.(e)}
      onDragEnd={() => onDragEnd?.()}
    >
      {/* Header with drag handle and actions - only visible on hover */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-3 py-1 bg-muted/40 rounded-t-lg z-10",
          "opacity-0 invisible transition-all duration-200",
          (isHovered || isDragging) && "opacity-100 visible",
        )}
      >
        <div className="text-xs text-muted-foreground">
          <Grip className="h-3 w-3 inline-block mr-1" />
          <span>Arraste para mover</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1 rounded-sm hover:bg-muted text-muted-foreground" onClick={handleOpenResizeDialog}>
            <LayoutGrid className="h-3 w-3" />
          </button>

          <button className="p-1 rounded-sm hover:bg-muted text-muted-foreground" onClick={handleToggleCollapse}>
            {isCollapsed ? <Maximize className="h-3 w-3" /> : <Minimize className="h-3 w-3" />}
          </button>

          <button className="p-1 rounded-sm hover:bg-muted text-muted-foreground" onClick={handleRemove}>
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={cn("h-full pt-2 px-4 pb-4", isCollapsed && "overflow-hidden")}>{children}</div>

      {/* Visual indicator for current size - only visible on hover */}
      <div
        className={cn(
          "absolute bottom-1 right-1 bg-muted/60 text-xs px-1 py-0.5 rounded-sm",
          "opacity-0 transition-opacity duration-200",
          (isHovered || isDragging) && "opacity-70",
        )}
      >
        {colSpan}x{rowSpan}
      </div>

      {/* Size selector dialog */}
      <Dialog open={isResizeDialogOpen} onOpenChange={setIsResizeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Selecionar Tamanho</DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, rowIndex) =>
                Array.from({ length: 4 }).map((_, colIndex) => {
                  const newColSpan = colIndex + 1
                  const newRowSpan = rowIndex + 1
                  const isSelected = colSpan === newColSpan && rowSpan === newRowSpan

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "border rounded-md flex items-center justify-center text-sm p-2 h-12",
                        isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 hover:bg-muted",
                      )}
                      onClick={() => handleSizeSelect(newColSpan, newRowSpan)}
                    >
                      {newColSpan}x{newRowSpan}
                    </button>
                  )
                }),
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Tamanhos comuns:</h4>
              <div className="grid grid-cols-4 gap-2">
                <button
                  className="border rounded-md bg-muted/50 hover:bg-muted text-sm p-2"
                  onClick={() => handleSizeSelect(1, 1)}
                >
                  1x1
                </button>
                <button
                  className="border rounded-md bg-muted/50 hover:bg-muted text-sm p-2"
                  onClick={() => handleSizeSelect(2, 1)}
                >
                  2x1
                </button>
                <button
                  className="border rounded-md bg-muted/50 hover:bg-muted text-sm p-2"
                  onClick={() => handleSizeSelect(2, 2)}
                >
                  2x2
                </button>
                <button
                  className="border rounded-md bg-muted/50 hover:bg-muted text-sm p-2"
                  onClick={() => handleSizeSelect(4, 2)}
                >
                  4x2
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 