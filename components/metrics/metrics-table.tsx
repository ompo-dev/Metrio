"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Dados mockados para evitar problema de carregamento
const mockEvents = [
  {
    id: "1",
    type: "Cadastro",
    source: "Website",
    timestamp: "2023-10-15 14:32:45",
    status: "success" as const,
  },
  {
    id: "2",
    type: "Login",
    source: "App Mobile",
    timestamp: "2023-10-15 14:30:12",
    status: "success" as const,
  },
  {
    id: "3",
    type: "Compra",
    source: "Website",
    timestamp: "2023-10-15 14:28:30",
    status: "success" as const,
  },
  {
    id: "4",
    type: "Visualização",
    source: "App Mobile",
    timestamp: "2023-10-15 14:25:18",
    status: "pending" as const,
  },
  {
    id: "5",
    type: "Evento API",
    source: "API",
    timestamp: "2023-10-15 14:22:05",
    status: "error" as const,
  },
]

export function MetricsTable() {
  const [events] = useState(mockEvents)
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.type}</TableCell>
            <TableCell>{event.source}</TableCell>
            <TableCell>{event.timestamp}</TableCell>
            <TableCell>
              <Badge
                variant={
                  event.status === "success" ? "default" : event.status === "pending" ? "outline" : "destructive"
                }
              >
                {event.status === "success" ? "Sucesso" : event.status === "pending" ? "Pendente" : "Erro"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

