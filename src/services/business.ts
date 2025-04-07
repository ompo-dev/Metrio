import api from './api';

export interface Business {
  id: number;
  nome: string;
  email: string;
  usuarioId: number;
}

export const BusinessService = {
  // Buscar todas as empresas
  getAll: async (): Promise<Business[]> => {
    const response = await api.get<Business[]>('/business');
    return response.data;
  },

  // Buscar uma empresa pelo ID
  getById: async (id: number): Promise<Business> => {
    const response = await api.get<Business>(`/business/${id}`);
    return response.data;
  },

  // Buscar empresas por usuário
  getByUsuario: async (usuarioId: number): Promise<Business[]> => {
    const response = await api.get<Business[]>(`/business?usuarioId=${usuarioId}`);
    return response.data;
  },

  // Criar uma nova empresa
  create: async (business: Omit<Business, 'id'>): Promise<Business> => {
    const response = await api.post<Business>('/business', business);
    return response.data;
  },

  // Atualizar uma empresa existente
  update: async (id: number, business: Partial<Business>): Promise<Business> => {
    const response = await api.put<Business>(`/business/${id}`, business);
    return response.data;
  },

  // Deletar uma empresa
  delete: async (id: number): Promise<void> => {
    await api.delete(`/business/${id}`);
  }
}; 