"use client"

import * as React from "react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
  PieChart,
  Label,
  Cell,
  RadialBar,
  RadialBarChart,
  PolarRadiusAxis,
} from "recharts"
import { ChartType, DataPoint, SeriesConfig } from "./types"
import { cn } from "@/lib/utils"

// Importar componentes de tooltip personalizados
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartRendererProps {
  chartType: ChartType
  data: DataPoint[]
  xAxisField: string
  activeSeries: string[]
  series: SeriesConfig[]
  showGridLines: boolean
  showDots: boolean
  showLegend: boolean
  showTooltip: boolean
  yAxisTicks: number[]
  maxValue: number
}

export function ChartRenderer({
  chartType,
  data,
  xAxisField,
  activeSeries,
  series,
  showGridLines,
  showDots,
  showLegend,
  showTooltip,
  yAxisTicks,
  maxValue,
}: ChartRendererProps) {
  const commonProps = {
    data,
    margin: {
      top: 20,
      right: 20,
      left: 20,
      bottom: 20,
    },
  }

  // Calcular o valor total para o gráfico de pizza e radial
  const totalValue = React.useMemo(() => {
    if (!(chartType === "pie" || chartType === "radial") || !activeSeries.length) return 0;
    
    return data.reduce((total, item) => {
      let sum = 0;
      activeSeries.forEach(seriesKey => {
        if (typeof item[seriesKey] === 'number') {
          sum += item[seriesKey] as number;
        }
      });
      return total + sum;
    }, 0);
  }, [chartType, data, activeSeries]);

  // Preparar dados para o gráfico de pizza
  const pieData = React.useMemo(() => {
    if (chartType !== "pie") return [];
    
    // Para gráfico de pizza, precisamos reformatar os dados
    // Vamos somar os valores por série
    const seriesSums = activeSeries.map(seriesKey => {
      const seriesConfig = series.find(s => s.key === seriesKey);
      if (!seriesConfig) return null;
      
      const sum = data.reduce((total, item) => {
        if (typeof item[seriesKey] === 'number') {
          return total + (item[seriesKey] as number);
        }
        return total;
      }, 0);
      
      return {
        name: seriesConfig.label,
        value: sum,
        fill: seriesConfig.color,
        key: seriesKey
      };
    }).filter(Boolean);
    
    return seriesSums;
  }, [chartType, data, activeSeries, series]);

  // Preparar dados para o gráfico radial
  const radialData = React.useMemo(() => {
    if (chartType !== "radial" || !data.length) return [];
    
    // Para o gráfico radial, precisamos usar o primeiro item dos dados
    // conforme o exemplo fornecido
    return [data[0]];
  }, [chartType, data]);

  // Criar um objeto de configuração para o ChartContainer
  const chartConfig = React.useMemo(() => {
    return series.reduce((config: any, seriesItem) => {
      config[seriesItem.key] = {
        label: seriesItem.label,
        color: seriesItem.color
      };
      return config;
    }, {});
  }, [series]);

  const renderLines = () => {
    return activeSeries.map((seriesKey) => {
      const seriesConfig = series.find((s) => s.key === seriesKey)
      if (!seriesConfig) return null

      if (chartType === "line") {
        return (
          <Line
            key={seriesKey}
            type="monotone"
            dataKey={seriesKey}
            name={seriesConfig.label}
            stroke={seriesConfig.color}
            strokeWidth={2}
            dot={showDots ? { r: 4, strokeWidth: 2 } : false}
            activeDot={{ r: 6 }}
          />
        )
      } else if (chartType === "area") {
        return (
          <Area
            key={seriesKey}
            type="monotone"
            dataKey={seriesKey}
            name={seriesConfig.label}
            stroke={seriesConfig.color}
            fill={seriesConfig.color}
            fillOpacity={0.2}
            strokeWidth={2}
            dot={showDots ? { r: 4, strokeWidth: 2 } : false}
            activeDot={{ r: 6 }}
          />
        )
      } else if (chartType === "bar") {
        return (
          <Bar
            key={seriesKey}
            dataKey={seriesKey}
            name={seriesConfig.label}
            fill={seriesConfig.color}
            radius={[4, 4, 0, 0]}
          />
        )
      } else if (chartType === "stacked-bar") {
        return (
          <Bar
            key={seriesKey}
            dataKey={seriesKey}
            name={seriesConfig.label}
            stackId="a"
            fill={`var(--color-${seriesKey})`}
            radius={seriesKey === activeSeries[0] ? [0, 0, 4, 4] : (seriesKey === activeSeries[activeSeries.length - 1] ? [4, 4, 0, 0] : [0, 0, 0, 0])}
          />
        )
      }
      return null;
    })
  }

  const renderXAxis = () => (
    <XAxis
      dataKey={xAxisField}
      axisLine={{ stroke: "#e2e8f0" }}
      tickLine={false}
      tick={{ fontSize: 12, fill: "#94a3b8" }}
      tickFormatter={value => {
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return new Date(value).toLocaleDateString('pt-BR', { 
            weekday: 'short'
          });
        }
        return value;
      }}
    />
  )

  const renderYAxis = () => (
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12, fill: "#94a3b8" }}
      domain={[0, maxValue]}
      ticks={yAxisTicks}
      tickFormatter={(value) => value.toString()}
      label={{
        value: "Sales ($)",
        angle: -90,
        position: "insideLeft",
        style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 12 },
      }}
    />
  )

  const renderTooltip = () => {
    if (!showTooltip) return null;

    if (chartType === "pie") {
      return (
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
      );
    } else if (chartType === "radial") {
      return (
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
      );
    } else if (chartType === "stacked-bar") {
      return (
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent 
              labelKey="activities" 
              indicator="line" 
            />
          }
          defaultIndex={1}
        />
      );
    } else {
      return (
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent 
              labelKey={xAxisField} 
              indicator="line" 
            />
          }
        />
      );
    }
  }

  const renderLegend = () => showLegend && (
    <Legend
      verticalAlign="top"
      height={36}
      iconType="circle"
      iconSize={8}
      wrapperStyle={{ fontSize: "12px" }}
    />
  )

  const renderGrid = () => showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />

  const renderPieChart = () => {
    return (
      <PieChart {...commonProps}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          strokeWidth={5}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.fill || "#ccc"} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalValue.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Total
                    </tspan>
                  </text>
                )
              }
              return null;
            }}
          />
        </Pie>
        {renderTooltip()}
        {renderLegend()}
      </PieChart>
    );
  }

  const renderRadialChart = () => {
    // Verificar se temos dados
    if (!radialData.length) return null;
    
    // Verificar quais séries devem ser exibidas
    const activeSeriesConfigs = series.filter(s => activeSeries.includes(s.key));
    
    // Definir o tamanho de cada fatia - ajustar com base no número de séries
    const barSize = Math.max(5, Math.min(20, 100 / activeSeriesConfigs.length));
    
    return (
      <RadialBarChart
        {...commonProps}
        data={radialData}
        innerRadius={80}
        outerRadius={130}
        endAngle={180}
        barSize={barSize}
        startAngle={0}
        cx="50%"
        cy="50%"
      >
        {renderGrid()}
        {renderTooltip()}
        {renderLegend()}
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalValue.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Total
                    </tspan>
                  </text>
                )
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
        
        {/* Renderizar TODAS as barras radiais ativas */}
        {activeSeriesConfigs.map((seriesConfig) => (
          <RadialBar
            key={seriesConfig.key}
            dataKey={seriesConfig.key}
            name={seriesConfig.label}
            stackId="a"
            cornerRadius={5}
            fill={seriesConfig.color}
            stroke="none"
          />
        ))}
      </RadialBarChart>
    );
  }

  const renderChartContent = () => {
    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </LineChart>
      )
    } else if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </AreaChart>
      )
    } else if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </BarChart>
      )
    } else if (chartType === "stacked-bar") {
      return (
        <BarChart {...commonProps} accessibilityLayer>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderTooltip()}
          {renderLegend()}
          {renderLines()}
        </BarChart>
      )
    } else if (chartType === "pie") {
      return renderPieChart();
    } else if (chartType === "radial") {
      const chart = renderRadialChart();
      return chart !== null ? chart : (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          <p className="text-gray-400">Sem dados para o gráfico radial</p>
        </div>
      );
    }
    
    // Retorno padrão
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <p className="text-gray-400">Nenhum gráfico selecionado</p>
      </div>
    )
  }
  
  // Verificar se o conteúdo do gráfico está disponível
  const chartContent = renderChartContent();
  
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      {chartContent}
    </ChartContainer>
  )
} 