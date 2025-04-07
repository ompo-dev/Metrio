import api from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: string;
}

export const UsuariosService = {
  // Buscar todos os usuários
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  // Buscar um usuário pelo ID
  getById: async (id: number): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  // Criar um novo usuário
  create: async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const response = await api.post<Usuario>('/usuarios', usuario);
    return response.data;
  },

  // Atualizar um usuário existente
  update: async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
    const response = await api.put<Usuario>(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Deletar um usuário
  delete: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  // Autenticação de usuário
  login: async (email: string, senha: string): Promise<Usuario | null> => {
    try {
      // Em um cenário real, isso seria uma autenticação pelo backend
      // Aqui simulamos procurando por um usuário com o email e senha fornecidos
      const response = await api.get<Usuario[]>(`/usuarios?email=${email}&senha=${senha}`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return null;
    }
  }
}; 