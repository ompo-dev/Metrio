import api from './api';
import { WebhookDados } from './webhooks';

export interface WebhookAnalyticPeriod {
  inicio: string;
  fim: string;
  total_recebidos: number;
  dados_por_dia: {
    [data: string]: number;
  };
}

export interface WebhookTopInsight {
  tipo: string;
  valor: string | number;
  contagem: number;
  percentual: number;
}

export const WebhookAnalyticsService = {
  // Busca dados analíticos para um período específico
  getAnalyticsForPeriod: async (webhookId: number, dataInicio: string, dataFim: string): Promise<WebhookAnalyticPeriod> => {
    // Buscar dados brutos do período
    const startDate = `${dataInicio}T00:00:00Z`;
    const endDate = `${dataFim}T23:59:59Z`;
    
    const response = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&data_hora_recebimento_gte=${startDate}&data_hora_recebimento_lte=${endDate}`
    );
    
    const dados = response.data;
    const dadosPorDia: {[data: string]: number} = {};
    
    // Agrupar dados por dia
    dados.forEach(dado => {
      const data = dado.data_hora_recebimento.substring(0, 10); // pegar apenas YYYY-MM-DD
      if (!dadosPorDia[data]) {
        dadosPorDia[data] = 0;
      }
      dadosPorDia[data]++;
    });
    
    return {
      inicio: dataInicio,
      fim: dataFim,
      total_recebidos: dados.length,
      dados_por_dia: dadosPorDia
    };
  },
  
  // Analisar campos específicos nos dados para gerar insights
  getFieldAnalytics: async (webhookId: number, field: string, limit = 5): Promise<WebhookTopInsight[]> => {
    const response = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=1000`
    );
    
    const dados = response.data;
    const fieldValues: { [key: string]: number } = {};
    
    // Contar valores para o campo específico
    dados.forEach(dado => {
      if (dado.dados && dado.dados[field] !== undefined) {
        const value = String(dado.dados[field]);
        if (!fieldValues[value]) {
          fieldValues[value] = 0;
        }
        fieldValues[value]++;
      }
    });
    
    // Calcular total
    const total = Object.values(fieldValues).reduce((sum: number, val) => sum + val, 0);
    
    // Formatar resultado
    const result: WebhookTopInsight[] = Object.entries(fieldValues)
      .map(([valor, contagem]) => ({
        tipo: field,
        valor,
        contagem,
        percentual: parseFloat(((contagem / total) * 100).toFixed(2))
      }))
      .sort((a, b) => b.contagem - a.contagem)
      .slice(0, limit);
    
    return result;
  },
  
  // Busca os dispositivos mais usados (para webhooks de login)
  getTopDevices: async (webhookId: number, limit = 5): Promise<WebhookTopInsight[]> => {
    return WebhookAnalyticsService.getFieldAnalytics(webhookId, 'device', limit);
  },
  
  // Busca as localizações mais comuns (para webhooks de login)
  getTopLocations: async (webhookId: number, limit = 5): Promise<WebhookTopInsight[]> => {
    return WebhookAnalyticsService.getFieldAnalytics(webhookId, 'location', limit);
  },
  
  // Busca métodos de pagamento mais usados (para webhooks de compras)
  getTopPaymentMethods: async (webhookId: number, limit = 5): Promise<WebhookTopInsight[]> => {
    return WebhookAnalyticsService.getFieldAnalytics(webhookId, 'paymentMethod', limit);
  },
  
  // Função utilitária para calcular média de um campo numérico
  calculateAverage: async (webhookId: number, field: string): Promise<number> => {
    const response = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=1000`
    );
    
    const dados = response.data;
    let sum = 0;
    let count = 0;
    
    dados.forEach(dado => {
      if (dado.dados && typeof dado.dados[field] === 'number') {
        sum += dado.dados[field];
        count++;
      }
    });
    
    return count > 0 ? sum / count : 0;
  },
  
  // Função genérica para buscar insights personalizados com base no tipo de webhook
  getCustomInsights: async (webhookId: number): Promise<any> => {
    // Primeiro, determinar o tipo de webhook pelo seu ID
    const webhookResponse = await api.get(`/webhooks/${webhookId}`);
    const webhook = webhookResponse.data;
    
    if (!webhook) {
      throw new Error('Webhook não encontrado');
    }
    
    // Retornar diferentes insights com base no nome_tecnico do webhook
    switch (webhook.nome_tecnico) {
      case 'login_monitor': {
        // Para webhooks de login
        const dados = await api.get<WebhookDados[]>(
          `/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=1000`
        );
        
        // Calcular taxa de sucesso de login
        let sucessos = 0;
        let falhas = 0;
        
        dados.data.forEach(dado => {
          if (dado.dados && dado.dados.success !== undefined) {
            if (dado.dados.success === true) {
              sucessos++;
            } else {
              falhas++;
            }
          }
        });
        
        const total = sucessos + falhas;
        const taxaSucesso = total > 0 ? (sucessos / total) * 100 : 0;
        
        return {
          dispositivos: await WebhookAnalyticsService.getTopDevices(webhookId),
          localizacoes: await WebhookAnalyticsService.getTopLocations(webhookId),
          taxa_sucesso: parseFloat(taxaSucesso.toFixed(2)),
          total_logins: total,
          sucessos,
          falhas
        };
      }
      
      case 'purchase_tracker': {
        // Para webhooks de compras
        const valorMedioCompra = await WebhookAnalyticsService.calculateAverage(webhookId, 'totalValue');
        
        // Buscar produtos mais vendidos
        const dados = await api.get<WebhookDados[]>(
          `/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=1000`
        );
        
        // Contar produtos
        const produtosCounts: { [id: string]: { id: number, name: string, count: number } } = {};
        
        dados.data.forEach(dado => {
          if (dado.dados && Array.isArray(dado.dados.products)) {
            dado.dados.products.forEach((produto: any) => {
              const id = String(produto.id);
              if (!produtosCounts[id]) {
                produtosCounts[id] = { 
                  id: produto.id, 
                  name: produto.name, 
                  count: 0 
                };
              }
              produtosCounts[id].count += produto.quantity || 1;
            });
          }
        });
        
        const produtosPopulares = Object.values(produtosCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        return {
          metodos_pagamento: await WebhookAnalyticsService.getTopPaymentMethods(webhookId),
          valor_medio_compra: parseFloat(valorMedioCompra.toFixed(2)),
          produtos_populares: produtosPopulares,
          total_compras: dados.data.length
        };
      }
      
      case 'user_navigation': {
        // Para webhooks de navegação
        const tempoMedio = await WebhookAnalyticsService.calculateAverage(webhookId, 'timeSpent');
        
        // Buscar páginas mais visitadas
        const paginas = await WebhookAnalyticsService.getFieldAnalytics(webhookId, 'page');
        
        return {
          paginas_populares: paginas,
          tempo_medio_navegacao: parseFloat(tempoMedio.toFixed(2)),
          dispositivos: await WebhookAnalyticsService.getTopDevices(webhookId)
        };
      }
      
      case 'new_registrations': {
        // Para webhooks de cadastros
        const fontesCadastro = await WebhookAnalyticsService.getFieldAnalytics(webhookId, 'source');
        const planos = await WebhookAnalyticsService.getFieldAnalytics(webhookId, 'plan');
        
        // Calcular taxa de consentimento de marketing
        const dados = await api.get<WebhookDados[]>(
          `/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=1000`
        );
        
        let consentimentos = 0;
        let total = 0;
        
        dados.data.forEach(dado => {
          if (dado.dados && dado.dados.marketingConsent !== undefined) {
            total++;
            if (dado.dados.marketingConsent === true) {
              consentimentos++;
            }
          }
        });
        
        const taxaMarketing = total > 0 ? (consentimentos / total) * 100 : 0;
        
        return {
          fontes_cadastro: fontesCadastro,
          planos_populares: planos,
          taxa_marketing: parseFloat(taxaMarketing.toFixed(2)),
          total_cadastros: total
        };
      }
      
      default:
        // Para outros tipos de webhook, fazer análise básica
        const dados = await api.get<WebhookDados[]>(
          `/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=1000`
        );
        
        return {
          total_recebidos: dados.data.length,
          campos_disponiveis: webhook.campos_esperados ? Object.keys(webhook.campos_esperados) : []
        };
    }
  }
}; 