export interface DataPoint {
  [key: string]: string | number | boolean
}

export type ChartType = "line" | "bar" | "area"
export type AggregationType = "sum" | "average" | "min" | "max" | "count"
export type SortDirection = "ascending" | "descending" | "none"

export interface SeriesConfig {
  key: string
  label: string
  color: string
  aggregation: AggregationType
  groupBy?: string
}

export interface FilterConfig {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains"
  value: string | number
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChartDashboardProps {
  title: string
  data: DataPoint[]
  className?: string
}

export const DEFAULT_COLORS = [
  "#4263eb", // books - blue
  "#40c057", // clothing - green
  "#fcc419", // electronics - yellow
  "#fa5252", // tools - red
  "#15aabf", // widgets - light blue
  "#7950f2", // purple
  "#fd7e14", // orange
  "#e64980", // pink
  "#1098ad", // teal
  "#495057", // gray
] 