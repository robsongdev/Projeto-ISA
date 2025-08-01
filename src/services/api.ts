// import axios from 'axios';
import { Despesa } from '@/types';

// Configuração base do Axios (comentado para esta etapa inicial)
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
//   timeout: 10000,
// });

// Interceptors para tratamento de erros (comentado para esta etapa inicial)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Serviços de despesas (preparados para integração futura)
export const despesaService = {
  // Buscar todas as despesas
  async obterTodas(): Promise<Despesa[]> {
    // TODO: Implementar quando houver backend
    // const response = await api.get<ApiResponse<Expense[]>>('/expenses');
    // return response.data.data;

    // Por enquanto, retorna array vazio
    return [];
  },

  // Buscar despesa por ID
  async obterPorId(): Promise<Despesa | null> {
    // TODO: Implementar quando houver backend
    // const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
    // return response.data.data;

    return null;
  },

  // Criar nova despesa
  async criar(despesa: Omit<Despesa, 'id' | 'createdAt' | 'updatedAt'>): Promise<Despesa> {
    // TODO: Implementar quando houver backend
    // const response = await api.post<ApiResponse<Expense>>('/expenses', expense);
    // return response.data.data;

    // Simulação para desenvolvimento
    return {
      ...despesa,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
  },

  // Atualizar despesa
  async atualizar(id: string, despesa: Partial<Despesa>): Promise<Despesa> {
    // TODO: Implementar quando houver backend
    // const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, expense);
    // return response.data.data;

    // Simulação para desenvolvimento
    return {
      ...despesa,
      id,
      updatedAt: new Date(),
    } as Despesa;
  },

  // Excluir despesa
  async excluir(id: string): Promise<void> {
    // TODO: Implementar quando houver backend
    // await api.delete(`/expenses/${id}`);

    // Simulação para desenvolvimento
  },
};

// Serviços de autenticação (preparados para Firebase)
export const authService = {
  // Login anônimo (para Firebase)
  async logarAnonimamente(): Promise<{ user: { uid: string } }> {
    // TODO: Implementar quando houver Firebase
    // return await signInAnonymously(auth);

    return { user: { uid: 'anonymous-user' } };
  },

  // Verificar estado da autenticação
  async obterUsuarioAtual(): Promise<{ uid: string } | null> {
    // TODO: Implementar quando houver Firebase
    // return auth.currentUser;

    return { uid: 'anonymous-user' };
  },
};

// export default api;