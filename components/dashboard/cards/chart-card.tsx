"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChartCard() {
  const data = [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 120 },
    { month: "Mar", value: 170 },
    { month: "Apr", value: 180 },
    { month: "May", value: 160 },
    { month: "Jun", value: 190 },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 pt-4">
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 