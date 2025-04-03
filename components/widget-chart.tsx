"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Tipos de gráficos suportados
type ChartType = "area" | "bar" | "line" | "pie"

// Períodos de tempo suportados
type TimeRange = "hour" | "day" | "week" | "month" | "year"

// Definição de um widget
interface Widget {
  id: string
  title: string
  description?: string
  webhookId: string
  webhookName: string
  chartType: ChartType
  timeRange: TimeRange
  size: "small" | "medium" | "large"
  fields: string[]
}

interface WidgetChartProps {
  widget: Widget
  className?: string
}

// Cores para os gráficos
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

// Dados de exemplo para cada tipo de gráfico e período
const generateMockData = (widget: Widget) => {
  // Dados para gráficos temporais (área, linha, barra)
  if (widget.chartType === "area" || widget.chartType === "line" || widget.chartType === "bar") {
    if (widget.webhookId === "webhook-1") { // Login events
      // Dados de login
      if (widget.timeRange === "hour") {
        return Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          count: Math.floor(Math.random() * 50) + 20
        }));
      } else if (widget.timeRange === "day") {
        return Array.from({ length: 7 }, (_, i) => {
          const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
          return {
            day: days[i],
            count: Math.floor(Math.random() * 300) + 100
          };
        });
      } else if (widget.timeRange === "week") {
        return Array.from({ length: 4 }, (_, i) => ({
          week: `Semana ${i + 1}`,
          count: Math.floor(Math.random() * 1200) + 800
        }));
      } else if (widget.timeRange === "month") {
        return Array.from({ length: 12 }, (_, i) => {
          const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
          return {
            month: months[i],
            count: Math.floor(Math.random() * 5000) + 3000
          };
        });
      } else {
        return Array.from({ length: 5 }, (_, i) => ({
          year: `${2020 + i}`,
          count: Math.floor(Math.random() * 50000) + 30000
        }));
      }
    } else if (widget.webhookId === "webhook-2") { // Purchase events
      // Dados de compras
      if (widget.timeRange === "month") {
        return Array.from({ length: 12 }, (_, i) => {
          const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
          return {
            month: months[i],
            amount: Math.floor(Math.random() * 15000) + 5000
          };
        });
      } else {
        return Array.from({ length: 5 }, (_, i) => ({
          year: `${2020 + i}`,
          amount: Math.floor(Math.random() * 150000) + 50000
        }));
      }
    } else { // Error logs
      return Array.from({ length: 7 }, (_, i) => {
        const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        return {
          day: days[i],
          count: Math.floor(Math.random() * 30) + 5
        };
      });
    }
  } else if (widget.chartType === "pie") {
    // Dados para gráfico de pizza
    if (widget.webhookId === "webhook-2") { // Purchase events
      return [
        { name: "Eletrônicos", value: 35 },
        { name: "Roupas", value: 25 },
        { name: "Alimentos", value: 15 },
        { name: "Livros", value: 10 },
        { name: "Outros", value: 15 }
      ];
    } else if (widget.webhookId === "webhook-3") { // Error logs
      return [
        { name: "API", value: 45 },
        { name: "Database", value: 25 },
        { name: "Frontend", value: 20 },
        { name: "Auth", value: 10 }
      ];
    } else {
      return [
        { name: "Web", value: 55 },
        { name: "Mobile", value: 35 },
        { name: "API", value: 10 }
      ];
    }
  }

  // Fallback
  return [];
};

// Componente para renderizar o gráfico correto com base no tipo definido
export function WidgetChart({ widget, className = "" }: WidgetChartProps) {
  const data = generateMockData(widget);
  const dataKey = widget.webhookId === "webhook-2" ? "amount" : "count";
  const xDataKey = 
    widget.timeRange === "hour" ? "time" : 
    widget.timeRange === "day" ? "day" : 
    widget.timeRange === "week" ? "week" : 
    widget.timeRange === "month" ? "month" : "year";

  // Renderiza gráfico de área
  if (widget.chartType === "area") {
    return (
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Renderiza gráfico de barras
  if (widget.chartType === "bar") {
    return (
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Renderiza gráfico de linha
  if (widget.chartType === "line") {
    return (
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Renderiza gráfico de pizza
  if (widget.chartType === "pie") {
    return (
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Fallback
  return <div className={className}>Tipo de gráfico não suportado</div>;
} 