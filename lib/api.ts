import axios from "axios";
import { toast } from "sonner";

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

export default api;
