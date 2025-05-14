# Componente de Visualização de Dados

## Estrutura do Projeto

```
components/data-visualization/
├── chart-dashboard.tsx      # Componente principal do dashboard
├── chart-renderer.tsx       # Renderizador de gráficos
├── config-panel.tsx         # Painel de configuração
├── types.ts                 # Definições de tipos
├── data-utils.ts           # Utilitários para manipulação de dados
├── ai-response-generator.ts # Gerador de respostas de IA
├── ai-chat.tsx             # Componente de chat com IA
├── chart-legend.tsx        # Componente de legenda
├── config-icons.tsx        # Ícones de configuração
├── filter-bar.tsx          # Barra de filtros
└── markdown-styles.css     # Estilos para markdown
```

## Responsividade

O componente foi projetado para ser totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Adaptações por Tamanho de Tela

#### Mobile (< 640px)
- Layout em coluna única
- Painel de configuração colapsado por padrão
- Tamanhos de fonte reduzidos
- Espaçamentos e margens otimizados
- Altura do gráfico ajustada
- Chat com IA em tela cheia

#### Tablet (640px - 1024px)
- Layout em duas colunas
- Painel de configuração expansível
- Tamanhos de fonte intermediários
- Espaçamentos e margens moderados
- Altura do gráfico média
- Chat com IA em painel lateral

#### Desktop (> 1024px)
- Layout em múltiplas colunas
- Painel de configuração sempre visível
- Tamanhos de fonte padrão
- Espaçamentos e margens amplos
- Altura do gráfico máxima
- Chat com IA em painel lateral expandido

### Componentes Responsivos

#### ChartDashboard
- Layout flexível que se adapta ao tamanho da tela
- Painel de configuração colapsável em telas menores
- Altura do gráfico ajustada automaticamente
- Botões e controles redimensionados

#### ConfigPanel
- Tabs reorganizadas em 2 colunas em telas pequenas
- Tamanhos de fonte e espaçamentos adaptáveis
- Controles e inputs redimensionados
- Scroll vertical quando necessário

#### AIChat
- Layout em coluna única em mobile
- Painel lateral em telas maiores
- Tamanhos de fonte e espaçamentos adaptáveis
- Altura do chat ajustada por tamanho de tela

#### ChartLegend
- Legendas em múltiplas linhas em telas pequenas
- Texto truncado quando necessário
- Tamanhos de indicadores ajustados
- Espaçamento otimizado

#### FilterBar
- Filtros em múltiplas linhas
- Texto truncado em telas pequenas
- Tamanhos de fonte e espaçamentos adaptáveis
- Botões de remoção redimensionados

#### ConfigIcons
- Ícones redimensionados por tamanho de tela
- Espaçamento vertical ajustado
- Tamanhos de fonte adaptáveis
- Tooltips mantidos para melhor usabilidade

## Componentes

### ChartDashboard (chart-dashboard.tsx)
Componente principal que gerencia o estado e a lógica do dashboard.

```typescript
interface ChartDashboardProps {
  title: string
  data: DataPoint[]
  className?: string
}
```

Funcionalidades:
- Gerenciamento de estado do gráfico
- Controle de séries ativas
- Filtros de dados
- Ordenação
- Integração com IA

### ChartRenderer (chart-renderer.tsx)
Responsável pela renderização dos gráficos.

```typescript
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
```

### ConfigPanel (config-panel.tsx)
Painel de configuração para personalização do gráfico.

```typescript
interface ConfigPanelProps {
  activeTab: string
  chartType: ChartType
  xAxisField: string
  groupBy: string
  sortDirection: SortDirection
  showGridLines: boolean
  showDots: boolean
  showLegend: boolean
  showTooltip: boolean
  series: SeriesConfig[]
  // ... outras props
}
```

### ChartLegend (chart-legend.tsx)
Componente de legenda para identificação das séries.

```typescript
interface ChartLegendProps {
  series: SeriesConfig[]
  activeSeries: string[]
  toggleSeries: (seriesKey: string) => void
}
```

### FilterBar (filter-bar.tsx)
Barra de filtros para manipulação dos dados.

```typescript
interface FilterBarProps {
  filters: FilterConfig[]
  removeFilter: (index: number) => void
}
```

### AIChat (ai-chat.tsx)
Componente de chat com IA para análise de dados.

```typescript
interface AIChatProps {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  isAiThinking: boolean
  currentMessage: string
  setCurrentMessage: (message: string) => void
  handleSendMessage: () => void
  setShowAiChat: (show: boolean) => void
  data: DataPoint[]
  activeSeries: string[]
}
```

## Tipos (types.ts)

```typescript
// Tipos de gráficos suportados
type ChartType = "line" | "bar" | "area" | "pie" | "stacked-bar" | "radial"

// Tipos de agregação
type AggregationType = "sum" | "average" | "min" | "max" | "count"

// Direção de ordenação
type SortDirection = "ascending" | "descending" | "none"

// Estrutura de dados
interface DataPoint {
  [key: string]: string | number | boolean
}

// Configuração de série
interface SeriesConfig {
  key: string
  label: string
  color: string
  aggregation: AggregationType
  groupBy?: string
}

// Configuração de filtro
interface FilterConfig {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains"
  value: string | number
}

// Mensagem do chat
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}
```

## Utilitários (data-utils.ts)

### Funções Principais

```typescript
// Aplica filtros aos dados
applyFilters(data: DataPoint[], filters: FilterConfig[]): DataPoint[]

// Ordena os dados
sortData(data: DataPoint[], fieldName: string, direction: SortDirection): DataPoint[]

// Inicializa séries
initializeSeries(data: DataPoint[], availableFields: string[], xAxisField: string, DEFAULT_COLORS: string[]): SeriesConfig[]

// Adiciona série
addSeries(series: SeriesConfig[], newSeries: SeriesConfig): SeriesConfig[]

// Remove série
removeSeries(series: SeriesConfig[], seriesKey: string): SeriesConfig[]

// Atualiza série
updateSeries(series: SeriesConfig[], seriesKey: string, updates: Partial<SeriesConfig>): SeriesConfig[]
```

## Estilos (markdown-styles.css)

Estilos CSS para formatação de markdown no chat com IA, incluindo:
- Formatação de texto
- Estilos de código
- Listas e tabelas
- Citações e blocos
- Links e imagens

## Funcionalidades

### Gráficos
- Linha: Visualização de tendências
- Barra: Comparação de valores
- Área: Visualização de volumes
- Pizza: Proporções
- Barras Empilhadas: Comparação de componentes
- Radial: Métricas circulares

### Personalização
- Seleção de tipo de gráfico
- Configuração de eixos
- Personalização de cores
- Controle de legendas
- Opções de grade
- Tooltips interativos

### Análise de Dados
- Filtros por campo
- Múltiplos operadores de filtro
- Ordenação ascendente/descendente
- Agrupamento de dados
- Agregação (soma, média, mínimo, máximo, contagem)

### IA
- Chat interativo
- Sugestões automáticas
- Insights sobre os dados
- Análise de tendências
- Recomendações de visualização

## Sobre

Componente React para visualização de dados com suporte a múltiplos tipos de gráficos e integração com IA.

## Instalação

```bash
npm install @metrio/data-visualization
```

## Uso Básico

```typescript
import { ChartDashboard } from '@metrio/data-visualization'

const data = [
  { date: '2024-01-01', sales: 100, profit: 50 },
  { date: '2024-01-02', sales: 150, profit: 75 }
]

function App() {
  return (
    <ChartDashboard
      title="Análise de Vendas"
      data={data}
      className="w-full h-[600px]"
    />
  )
}
```

## Props

### ChartDashboard

| Prop | Tipo | Descrição |
|------|------|-----------|
| title | string | Título do dashboard |
| data | DataPoint[] | Array de dados para visualização |
| className | string? | Classes CSS adicionais |

### Tipos

```typescript
type ChartType = "line" | "bar" | "area" | "pie" | "stacked-bar" | "radial"
type AggregationType = "sum" | "average" | "min" | "max" | "count"
type SortDirection = "ascending" | "descending" | "none"

interface DataPoint {
  [key: string]: string | number | boolean
}

interface SeriesConfig {
  key: string
  label: string
  color: string
  aggregation: AggregationType
  groupBy?: string
}
```

## Dependências

- React
- Recharts
- Tailwind CSS
- Lucide Icons
- Radix UI

## Licença

MIT 