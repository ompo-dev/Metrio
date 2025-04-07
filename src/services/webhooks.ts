import api from './api';

// Interface para os campos esperados do webhook
export interface WebhookCamposEsperados {
  [key: string]: string; // Cada chave é o nome do campo e o valor é o tipo (string, number, date, array, etc)
}

export interface Webhook {
  id: number;
  nome: string;
  descricao: string;
  endpoint: string;
  nome_tecnico: string;
  key: string;
  businessId: number;
  status: 'active' | 'inactive';
  tipo: 'recebimento';
  data_criacao: string;
  campos_esperados: WebhookCamposEsperados;
}

export interface WebhookDados {
  id: number;
  webhook_id: number;
  data_hora_recebimento: string;
  dados: any; // Dados dinâmicos recebidos do webhook
}

export const WebhooksService = {
  // Operações de Webhook
  
  // Buscar todos os webhooks
  getAll: async (): Promise<Webhook[]> => {
    const response = await api.get<Webhook[]>('/webhooks');
    return response.data;
  },

  // Buscar um webhook pelo ID
  getById: async (id: number): Promise<Webhook> => {
    const response = await api.get<Webhook>(`/webhooks/${id}`);
    return response.data;
  },

  // Buscar webhooks por empresa
  getByBusiness: async (businessId: number): Promise<Webhook[]> => {
    const response = await api.get<Webhook[]>(`/webhooks?businessId=${businessId}`);
    return response.data;
  },

  // Criar um novo webhook
  create: async (webhook: Omit<Webhook, 'id'>): Promise<Webhook> => {
    const response = await api.post<Webhook>('/webhooks', webhook);
    return response.data;
  },

  // Atualizar um webhook existente
  update: async (id: number, webhook: Partial<Webhook>): Promise<Webhook> => {
    const response = await api.put<Webhook>(`/webhooks/${id}`, webhook);
    return response.data;
  },

  // Deletar um webhook
  delete: async (id: number): Promise<void> => {
    await api.delete(`/webhooks/${id}`);
  },

  // Buscar dados recebidos de um webhook
  getDadosByWebhook: async (webhookId: number, limit = 100): Promise<WebhookDados[]> => {
    const response = await api.get<WebhookDados[]>(`/webhook_dados?webhook_id=${webhookId}&_sort=data_hora_recebimento&_order=desc&_limit=${limit}`);
    return response.data;
  },

  // Buscar todos os dados recebidos de webhooks
  getAllDados: async (limit = 100): Promise<WebhookDados[]> => {
    const response = await api.get<WebhookDados[]>(`/webhook_dados?_sort=data_hora_recebimento&_order=desc&_limit=${limit}`);
    return response.data;
  },

  // Buscar dados recebidos de um webhook por data
  getDadosByDate: async (webhookId: number, date: string): Promise<WebhookDados[]> => {
    // Assumindo que a data está no formato YYYY-MM-DD
    const startDate = `${date}T00:00:00Z`;
    const endDate = `${date}T23:59:59Z`;
    
    const response = await api.get<WebhookDados[]>(
      `/webhook_dados?webhook_id=${webhookId}&data_hora_recebimento_gte=${startDate}&data_hora_recebimento_lte=${endDate}`
    );
    return response.data;
  },

  // Receber novos dados para um webhook (simulação do recebimento)
  receberDados: async (webhookId: number, dados: any): Promise<WebhookDados> => {
    const novoDado: Omit<WebhookDados, 'id'> = {
      webhook_id: webhookId,
      data_hora_recebimento: new Date().toISOString(),
      dados
    };
    
    const response = await api.post<WebhookDados>('/webhook_dados', novoDado);
    return response.data;
  }
}; 