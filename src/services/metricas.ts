import api from './api';

interface Metrica {
  id: number;
  nome: string;
  valor: number;
  periodo: string;
  data: string;
  unidade?: string;
}

export const MetricasService = {
  // Buscar todas as métricas
  getAll: async (): Promise<Metrica[]> => {
    const response = await api.get<Metrica[]>('/metricas');
    return response.data;
  },

  // Buscar uma métrica pelo ID
  getById: async (id: number): Promise<Metrica> => {
    const response = await api.get<Metrica>(`/metricas/${id}`);
    return response.data;
  },

  // Buscar métricas por período
  getByPeriodo: async (periodo: string): Promise<Metrica[]> => {
    const response = await api.get<Metrica[]>(`/metricas?periodo=${periodo}`);
    return response.data;
  },

  // Criar uma nova métrica
  create: async (metrica: Omit<Metrica, 'id'>): Promise<Metrica> => {
    const response = await api.post<Metrica>('/metricas', metrica);
    return response.data;
  },

  // Atualizar uma métrica existente
  update: async (id: number, metrica: Partial<Metrica>): Promise<Metrica> => {
    const response = await api.put<Metrica>(`/metricas/${id}`, metrica);
    return response.data;
  },

  // Deletar uma métrica
  delete: async (id: number): Promise<void> => {
    await api.delete(`/metricas/${id}`);
  }
}; 