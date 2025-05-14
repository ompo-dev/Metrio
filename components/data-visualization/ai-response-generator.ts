import { DataPoint, SeriesConfig } from "./types";

/**
 * Gera uma resposta de IA baseada na consulta do usuário
 */
export function generateAiResponse(query: string, data: DataPoint[], activeSeries: string[], series: SeriesConfig[], xAxisField: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("tabela") || lowerQuery.includes("table") || lowerQuery.includes("markdown")) {
    return generateMarkdownExample();
  }

  if (lowerQuery.includes("tendência") || lowerQuery.includes("tendencia") || lowerQuery.includes("trend")) {
    return generateTrendAnalysis(data, activeSeries);
  }

  if (lowerQuery.includes("melhor") || lowerQuery.includes("maior") || lowerQuery.includes("top")) {
    return generateTopPerformers(data, series);
  }

  if (lowerQuery.includes("pior") || lowerQuery.includes("menor")) {
    return generateWorstPerformers(data, series);
  }

  if (lowerQuery.includes("resumo") || lowerQuery.includes("resumir") || lowerQuery.includes("summary")) {
    return generateSummary(data, series, xAxisField);
  }

  if (lowerQuery.includes("comparar") || lowerQuery.includes("comparação") || lowerQuery.includes("compare")) {
    return generateComparison(data, activeSeries);
  }

  if (lowerQuery.includes("sazonalidade") || lowerQuery.includes("seasonal") || lowerQuery.includes("padrão")) {
    return generateSeasonalityAnalysis();
  }

  // Default response
  return generateDefaultResponse();
}

/**
 * Gera exemplo de tabela em markdown
 */
function generateMarkdownExample(): string {
  return `# Exemplo de Markdown

Aqui está um exemplo de como uso Markdown para formatação:

## Tabela de Vendas por Categoria

| Categoria | Vendas ($) | % do Total |
|-----------|----------:|----------:|
| Eletrônicos | 245,000 | 42.8% |
| Roupas | 125,000 | 21.8% |
| Livros | 98,500 | 17.2% |
| Acessórios | 65,000 | 11.3% |
| Outros | 39,500 | 6.9% |

### Lista de destaques:

1. **Eletrônicos** é a categoria com maior venda
2. *Roupas* está em segundo lugar
3. Juntos, Eletrônicos e Roupas representam mais de 60% das vendas

### Código de exemplo:

\`\`\`javascript
// Calculando o total de vendas
const totalSales = categories.reduce((sum, cat) => {
  return sum + cat.sales;
}, 0);
\`\`\`

> **Nota:** Esta análise é baseada nos dados do último trimestre.`;
}

/**
 * Gera análise de tendências
 */
function generateTrendAnalysis(data: DataPoint[], activeSeries: string[]): string {
  const lastMonths = data.slice(-3);
  const firstMonths = data.slice(0, 3);

  let trend = "estável";
  let avgRecent = 0;
  let avgEarly = 0;

  activeSeries.forEach((series) => {
    avgRecent += lastMonths.reduce((sum, item) => sum + (Number(item[series]) || 0), 0) / lastMonths.length;
    avgEarly += firstMonths.reduce((sum, item) => sum + (Number(item[series]) || 0), 0) / firstMonths.length;
  });

  const percentChange = ((avgRecent - avgEarly) / avgEarly) * 100;

  if (percentChange > 10) trend = "de alta significativa";
  else if (percentChange > 0) trend = "de leve alta";
  else if (percentChange < -10) trend = "de queda significativa";
  else if (percentChange < 0) trend = "de leve queda";

  return `## Análise de Tendência

Observei uma tendência **${trend}** nas categorias selecionadas.

### Comparação de Períodos
| Período | Média de Vendas | Variação |
|---------|---------------:|--------:|
| Início do Ano | $${Math.round(avgEarly).toLocaleString()} | - |  
| Últimos Meses | $${Math.round(avgRecent).toLocaleString()} | ${avgRecent > avgEarly ? '📈' : '📉'} ${Math.abs(((avgRecent - avgEarly) / avgEarly) * 100).toFixed(1)}% |

> A variação entre os períodos indica um padrão que deve ser monitorado nos próximos meses.`;
}

/**
 * Gera análise dos melhores desempenhos
 */
function generateTopPerformers(data: DataPoint[], series: SeriesConfig[]): string {
  const seriesPerformance: { [key: string]: number } = {};

  series.forEach((s) => {
    seriesPerformance[s.key] = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0);
  });

  const topSeries = Object.entries(seriesPerformance)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return `## Categorias com Melhor Desempenho 🏆

### Top 3 Categorias:

| Posição | Categoria | Total de Vendas |
|:-------:|-----------|----------------:|
| 🥇 | **${topSeries[0][0]}** | $${topSeries[0][1].toLocaleString()} |
| 🥈 | **${topSeries[1][0]}** | $${topSeries[1][1].toLocaleString()} |
| 🥉 | **${topSeries[2][0]}** | $${topSeries[2][1].toLocaleString()} |

> A categoria **${topSeries[0][0]}** representa ${(topSeries[0][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% do total de vendas.`;
}

/**
 * Gera análise dos piores desempenhos
 */
function generateWorstPerformers(data: DataPoint[], series: SeriesConfig[]): string {
  const seriesPerformance: { [key: string]: number } = {};

  series.forEach((s) => {
    seriesPerformance[s.key] = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0);
  });

  const worstSeries = Object.entries(seriesPerformance)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);

  return `## Categorias com Menor Desempenho

### Categorias que precisam de atenção:

| Categoria | Total de Vendas | % do Total |
|-----------|----------------:|----------:|
| **${worstSeries[0][0]}** | $${worstSeries[0][1].toLocaleString()} | ${(worstSeries[0][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% |
| **${worstSeries[1][0]}** | $${worstSeries[1][1].toLocaleString()} | ${(worstSeries[1][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% |
| **${worstSeries[2][0]}** | $${worstSeries[2][1].toLocaleString()} | ${(worstSeries[2][1] / Object.values(seriesPerformance).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% |

### Recomendações:

1. Avaliar estratégias de marketing para **${worstSeries[0][0]}**
2. Considerar revisão de preços ou promoções
3. Investigar fatores sazonais que possam influenciar estas categorias`;
}

/**
 * Gera resumo dos dados
 */
function generateSummary(data: DataPoint[], series: SeriesConfig[], xAxisField: string): string {
  const totalsByCategory: { [key: string]: number } = {};
  let grandTotal = 0;

  series.forEach((s) => {
    const total = data.reduce((sum, item) => sum + (Number(item[s.key]) || 0), 0);
    totalsByCategory[s.key] = total;
    grandTotal += total;
  });

  const highestCategory = Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1])[0];
  const lowestCategory = Object.entries(totalsByCategory).sort((a, b) => a[1] - b[1])[0];

  return `# Resumo dos Dados 📊

## Principais métricas:

- **Total geral:** $${grandTotal.toLocaleString()}
- **Período analisado:** ${data[0][xAxisField]} a ${data[data.length - 1][xAxisField]}
- **Número de categorias:** ${series.length}

## Destaques:

| Métrica | Categoria | Valor |
|---------|-----------|------:|
| Maior valor | **${highestCategory[0]}** | $${highestCategory[1].toLocaleString()} |
| Menor valor | **${lowestCategory[0]}** | $${lowestCategory[1].toLocaleString()} |

## Distribuição por categoria:

\`\`\`
${Object.entries(totalsByCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([key, value]) => `${key}: ${"█".repeat(Math.round((value / grandTotal) * 20))} ${Math.round((value / grandTotal) * 100)}%`)
  .join("\n")}
\`\`\``;
}

/**
 * Gera comparação entre categorias
 */
function generateComparison(data: DataPoint[], activeSeries: string[]): string {
  if (activeSeries.length < 2) {
    return "⚠️ **Atenção:** Para fazer uma comparação, selecione pelo menos duas categorias no gráfico.";
  }

  const totals = activeSeries.map((series) => {
    const total = data.reduce((sum, item) => sum + (Number(item[series]) || 0), 0);
    return { series, total };
  });

  const sorted = totals.sort((a, b) => b.total - a.total);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  const ratio = highest.total / lowest.total;

  return `## Comparação entre Categorias

### Análise Comparativa:

| Categoria | Total | % do Total | Comparação |
|-----------|------:|----------:|------------|
| **${highest.series}** | $${highest.total.toLocaleString()} | ${((highest.total / totals.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}% | ${ratio.toFixed(1)}× maior |
| **${lowest.series}** | $${lowest.total.toLocaleString()} | ${((lowest.total / totals.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}% | Referência |

### Diferença entre extremos:

* Diferença absoluta: **$${(highest.total - lowest.total).toLocaleString()}**
* Diferença percentual: **${(((highest.total - lowest.total) / lowest.total) * 100).toFixed(1)}%**

> As categorias selecionadas apresentam variação significativa, com **${highest.series}** dominando o mercado.`;
}

/**
 * Gera análise de sazonalidade
 */
function generateSeasonalityAnalysis(): string {
  return `## Análise de Sazonalidade 📅

### Padrões identificados:

1. **Picos de vendas:** 
   * Fevereiro: +15% acima da média
   * Abril: +12% acima da média
   * Junho: +18% acima da média

2. **Períodos de baixa:**
   * Outubro: -8% abaixo da média
   * Novembro: -12% abaixo da média

### Padrões por categoria:

| Categoria | Padrão Sazonal | Mês de pico |
|-----------|----------------|-------------|
| **Clothing** | Alta sazonalidade | Fevereiro |
| **Electronics** | Estável | Distribuição uniforme |
| **Books** | Sazonalidade moderada | Junho |

### Recomendações:

\`\`\`
- Planejar promoções para períodos de baixa
- Aumentar estoque antes dos picos sazonais
- Criar campanhas específicas para categorias sazonais
\`\`\`

> **Insight:** A categoria "clothing" apresenta forte correlação com mudanças de estação.`;
}

/**
 * Gera resposta padrão
 */
function generateDefaultResponse(): string {
  return `## Análise de Dados

Posso ajudar você a entender melhor seus dados usando formatação **Markdown**.

### O que você gostaria de saber?

* Tendências gerais ou por categoria
* Comparações entre categorias
* Períodos de melhor/pior desempenho
* Padrões sazonais
* Resumo geral dos dados

Digite sua pergunta ou experimente digitar "Mostre um exemplo de tabela em markdown" para ver como posso formatar os dados.`;
} 