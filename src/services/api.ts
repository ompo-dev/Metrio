import axios from 'axios';

// Criando uma instância do Axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001', // URL base para o JSON Server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Aqui podemos adicionar tokens, manipular headers, etc.
    console.log('Requisição enviada:', config);
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    // Manipular respostas bem-sucedidas
    console.log('Resposta recebida:', response.status);
    return response;
  },
  (error) => {
    // Manipular erros de resposta
    console.error('Erro na resposta:', error.response?.status || error.message);
    return Promise.reject(error);
  }
);

export default api; 