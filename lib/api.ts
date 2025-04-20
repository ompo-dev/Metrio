import axios from "axios";
import { toast } from "sonner";
import { WebhookCreateInput, WebhookUpdateInput } from "@/app/lib/webhooks";

// Criar instância do Axios com configurações base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "", // Usa a URL base da API se estiver definida
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // timeout de 10 segundos
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Aqui podemos adicionar tokens de autenticação ou outros headers globais
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros global
    const errorMessage =
      error.response?.data?.error || "Ocorreu um erro na requisição";

    // Não mostrar toast para erros 401 não autorizados (tratados pelo NextAuth)
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// API de Webhooks
export const webhooksApi = {
  // Criar um novo webhook
  create: async (webhookData: WebhookCreateInput) => {
    const response = await api.post("/api/webhooks", webhookData);
    return response.data;
  },

  // Listar webhooks de um projeto
  getByProject: async (projectId: string) => {
    const response = await api.get(`/api/webhooks?projectId=${projectId}`);
    return response.data;
  },

  // Buscar webhook por id
  getById: async (id: string) => {
    const response = await api.get(`/api/webhooks/${id}`);
    return response.data;
  },

  // Atualizar webhook
  update: async (id: string, data: WebhookUpdateInput) => {
    const response = await api.put(`/api/webhooks/${id}`, data);
    return response.data;
  },

  // Atualizar webhook parcialmente
  patch: async (id: string, data: Partial<WebhookUpdateInput>) => {
    const response = await api.patch(`/api/webhooks/${id}`, data);
    return response.data;
  },

  // Excluir webhook
  delete: async (id: string) => {
    const response = await api.delete(`/api/webhooks/${id}`);
    return response.data;
  },

  // Ativar/desativar webhook usando o PATCH
  toggleActive: async (id: string, isActive: boolean) => {
    return await webhooksApi.patch(id, { isActive });
  },
};

export default api;
