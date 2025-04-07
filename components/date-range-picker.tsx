"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn("w-[240px] justify-start text-left font-normal")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yy", { locale: ptBR })} - {format(date.to, "dd/MM/yy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd/MM/yy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Tabs defaultValue="range">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="predefined">Predefinidos</TabsTrigger>
              <TabsTrigger value="range">Intervalo</TabsTrigger>
            </TabsList>
            <TabsContent value="predefined" className="p-3">
              <Select
                onValueChange={(value) => {
                  const today = new Date()
                  const days = parseInt(value)
                  setDate({
                    from: addDays(today, -days),
                    to: today,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="15">Últimos 15 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="60">Últimos 2 meses</SelectItem>
                  <SelectItem value="90">Últimos 3 meses</SelectItem>
                  <SelectItem value="180">Últimos 6 meses</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>
            <TabsContent value="range" className="p-3 border-none">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={{
                  from: date?.from,
                  to: date?.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDate({ from: range.from, to: range.to })
                  }
                }}
                numberOfMonths={2}
                locale={ptBR}
              />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-between p-3 border-t">
            <Button variant="ghost" size="sm" onClick={() => setDate({ from: new Date(), to: new Date() })}>
              Hoje
            </Button>
            <Button size="sm" onClick={() => document.querySelector('[role="dialog"]')?.setAttribute('data-state', 'closed')}>
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

