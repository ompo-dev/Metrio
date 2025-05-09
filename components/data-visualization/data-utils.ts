import { DataPoint, FilterConfig, SeriesConfig } from "./types";

/**
 * Aplica filtros a um conjunto de dados
 */
export function applyFilters(data: DataPoint[], filters: FilterConfig[]): DataPoint[] {
  if (filters.length === 0) return data;

  return data.filter((item) => {
    return filters.every((filter) => {
      const value = item[filter.field];
      switch (filter.operator) {
        case "equals":
          return value === filter.value;
        case "not_equals":
          return value !== filter.value;
        case "greater_than":
          return Number(value) > Number(filter.value);
        case "less_than":
          return Number(value) < Number(filter.value);
        case "contains":
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        default:
          return true;
      }
    });
  });
}

/**
 * Ordena dados baseado em um campo e direção
 */
export function sortData(data: DataPoint[], fieldName: string, direction: "ascending" | "descending" | "none"): DataPoint[] {
  if (direction === "none") return data;

  return [...data].sort((a, b) => {
    if (direction === "ascending") {
      return a[fieldName] > b[fieldName] ? 1 : -1;
    } else {
      return a[fieldName] < b[fieldName] ? 1 : -1;
    }
  });
}

/**
 * Calcula o valor máximo para um conjunto de campos
 */
export function calculateMaxValue(data: DataPoint[], fields: string[]): number {
  let max = 0;
  data.forEach((item) => {
    fields.forEach((field) => {
      const value = Number(item[field]) || 0;
      if (value > max) max = value;
    });
  });
  // Round up to nearest thousand
  return Math.ceil(max / 1000) * 1000;
}

/**
 * Gera marcas para o eixo Y
 */
export function generateYAxisTicks(maxValue: number, tickCount = 5): number[] {
  const step = maxValue / tickCount;
  return Array.from({ length: tickCount + 1 }, (_, i) => i * step);
}

/**
 * Extrai campos disponíveis de um conjunto de dados
 */
export function extractAvailableFields(data: DataPoint[]): string[] {
  const fields = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => fields.add(key));
  });
  return Array.from(fields);
}

/**
 * Inicializa séries baseadas nos dados
 */
export function initializeSeries(data: DataPoint[], availableFields: string[], xAxisField: string, DEFAULT_COLORS: string[]): SeriesConfig[] {
  const numericFields = availableFields.filter(
    (field) => field !== xAxisField && typeof data[0][field] === "number"
  );
  
  return numericFields.slice(0, 5).map((field, index) => ({
    key: field,
    label: field.charAt(0).toUpperCase() + field.slice(1),
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    aggregation: "sum",
  }));
}

/**
 * Adiciona uma série
 */
export function addSeries(series: SeriesConfig[], newSeries: SeriesConfig): SeriesConfig[] {
  return [...series, newSeries];
}

/**
 * Remove uma série
 */
export function removeSeries(series: SeriesConfig[], seriesKey: string): SeriesConfig[] {
  return series.filter((s) => s.key !== seriesKey);
}

/**
 * Atualiza configuração de uma série
 */
export function updateSeries(series: SeriesConfig[], seriesKey: string, updates: Partial<SeriesConfig>): SeriesConfig[] {
  return series.map((s) => (s.key === seriesKey ? { ...s, ...updates } : s));
}

/**
 * Alternancia de visibilidade de série
 */
export function toggleSeriesVisibility(activeSeries: string[], seriesKey: string): string[] {
  return activeSeries.includes(seriesKey) 
    ? activeSeries.filter((key) => key !== seriesKey) 
    : [...activeSeries, seriesKey];
} 