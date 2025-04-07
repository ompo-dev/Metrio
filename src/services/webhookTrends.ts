import api from './api';
import { WebhookDados } from './webhooks';

export interface WebhookTrend {
  periodo: string;
  valor: number;
}

export interface WebhookComparacaoPeriodo {
  periodo_atual: {
    inicio: string;
    fim: string;
    total: number;
  };
  periodo_anterior: {
    inicio: string;
    fim: string;
    total: number;
  };
  variacao_percentual: number;
}

export const WebhookTrendsService = {
  // Analisa tendência de um campo numérico ao longo do tempo
  getTrendField: async (
    webhookId: number, 
    field: string, 
    startDate: string, 
    endDate: string, 
    intervalo: 'dia' | 'semana' | 'mes' = 'dia'
  ): Promise<WebhookTrend[]> => {
    // Buscar dados do período
    const response = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&data_hora_recebimento_gte=${startDate}&data_hora_recebimento_lte=${endDate}`
    );
    
    const dados = response.data;
    const trendData: { [periodo: string]: { total: number, soma: number } } = {};
    
    // Agrupar por período de tempo
    dados.forEach(dado => {
      if (dado.dados && dado.dados[field] !== undefined) {
        let periodoKey: string;
        const date = new Date(dado.data_hora_recebimento);
        
        switch (intervalo) {
          case 'dia':
            periodoKey = date.toISOString().substring(0, 10); // YYYY-MM-DD
            break;
          case 'semana': {
            // Obter o primeiro dia da semana (domingo)
            const day = date.getDay();
            const diff = date.getDate() - day;
            const firstDayOfWeek = new Date(date);
            firstDayOfWeek.setDate(diff);
            periodoKey = firstDayOfWeek.toISOString().substring(0, 10);
            break;
          }
          case 'mes':
            periodoKey = date.toISOString().substring(0, 7); // YYYY-MM
            break;
        }
        
        if (!trendData[periodoKey]) {
          trendData[periodoKey] = { total: 0, soma: 0 };
        }
        
        trendData[periodoKey].total += 1;
        if (typeof dado.dados[field] === 'number') {
          trendData[periodoKey].soma += dado.dados[field];
        }
      }
    });
    
    // Calcular médias ou somas por período
    const result: WebhookTrend[] = Object.entries(trendData).map(([periodo, dados]) => ({
      periodo,
      valor: typeof field === 'string' && ['timeSpent', 'totalValue', 'duration'].includes(field) 
        ? dados.soma / dados.total // Para campos que representam médias
        : dados.total // Para campos que representam contagens
    }));
    
    // Ordenar por período
    return result.sort((a, b) => a.periodo.localeCompare(b.periodo));
  },
  
  // Compara dois períodos de tempo e retorna a variação percentual
  comparePeriods: async (
    webhookId: number,
    periodoAtualInicio: string,
    periodoAtualFim: string,
    periodoAnteriorInicio: string,
    periodoAnteriorFim: string
  ): Promise<WebhookComparacaoPeriodo> => {
    // Buscar dados do período atual
    const respostaAtual = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&data_hora_recebimento_gte=${periodoAtualInicio}&data_hora_recebimento_lte=${periodoAtualFim}`
    );
    
    // Buscar dados do período anterior
    const respostaAnterior = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&data_hora_recebimento_gte=${periodoAnteriorInicio}&data_hora_recebimento_lte=${periodoAnteriorFim}`
    );
    
    const totalAtual = respostaAtual.data.length;
    const totalAnterior = respostaAnterior.data.length;
    
    // Calcular variação percentual
    const variacao = totalAnterior === 0 
      ? 100 // Se não havia dados no período anterior, crescimento de 100%
      : ((totalAtual - totalAnterior) / totalAnterior) * 100;
    
    return {
      periodo_atual: {
        inicio: periodoAtualInicio,
        fim: periodoAtualFim,
        total: totalAtual
      },
      periodo_anterior: {
        inicio: periodoAnteriorInicio,
        fim: periodoAnteriorFim,
        total: totalAnterior
      },
      variacao_percentual: parseFloat(variacao.toFixed(2))
    };
  },
  
  // Identifica tendências de crescimento ou queda para um webhook
  getTrendStatus: async (
    webhookId: number, 
    dias: number = 30
  ): Promise<{ status: 'crescimento' | 'estabilidade' | 'queda', variacao: number }> => {
    const hoje = new Date();
    const ultimoDia = hoje.toISOString().substring(0, 10);
    
    const primeiroDia = new Date();
    primeiroDia.setDate(primeiroDia.getDate() - dias);
    const primeiroDiaStr = primeiroDia.toISOString().substring(0, 10);
    
    // Dividir em dois períodos iguais
    const metade = new Date();
    metade.setDate(metade.getDate() - Math.floor(dias / 2));
    const metadeStr = metade.toISOString().substring(0, 10);
    
    const comparacao = await WebhookTrendsService.comparePeriods(
      webhookId,
      metadeStr, 
      ultimoDia, 
      primeiroDiaStr, 
      metadeStr
    );
    
    let status: 'crescimento' | 'estabilidade' | 'queda';
    
    if (comparacao.variacao_percentual > 10) {
      status = 'crescimento';
    } else if (comparacao.variacao_percentual < -10) {
      status = 'queda';
    } else {
      status = 'estabilidade';
    }
    
    return {
      status,
      variacao: comparacao.variacao_percentual
    };
  },
  
  // Identifica os dias ou horários com maior volume de dados
  getPeakTimes: async (
    webhookId: number, 
    startDate: string, 
    endDate: string
  ): Promise<{ por_dia_semana: Record<string, number>, por_hora: Record<string, number> }> => {
    const response = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&data_hora_recebimento_gte=${startDate}&data_hora_recebimento_lte=${endDate}`
    );
    
    const dados = response.data;
    const diasSemana: Record<string, number> = {
      'domingo': 0,
      'segunda': 0,
      'terca': 0,
      'quarta': 0,
      'quinta': 0,
      'sexta': 0,
      'sabado': 0
    };
    
    const horas: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      horas[`${i.toString().padStart(2, '0')}:00`] = 0;
    }
    
    // Calcular picos
    dados.forEach(dado => {
      const date = new Date(dado.data_hora_recebimento);
      const diaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][date.getDay()];
      const hora = `${date.getHours().toString().padStart(2, '0')}:00`;
      
      diasSemana[diaSemana]++;
      horas[hora]++;
    });
    
    return {
      por_dia_semana: diasSemana,
      por_hora: horas
    };
  }
}; 