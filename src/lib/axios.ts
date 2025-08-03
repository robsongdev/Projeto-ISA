import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuração base do Axios para Supabase
const createAxiosInstance = (): AxiosInstance => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const instance = axios.create({
    baseURL: `${supabaseUrl}/rest/v1`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
  });

  // Interceptor para requisições
  instance.interceptors.request.use(
    (config) => {
      // Adicionar headers necessários para Supabase
      config.headers.set('apikey', supabaseAnonKey);
      config.headers.set('Authorization', `Bearer ${supabaseAnonKey}`);

      console.log('Requisição enviada:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });

      return config;
    },
    (error) => {
      console.error('Erro na requisição:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor para respostas
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('Resposta recebida:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('Erro na resposta:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
      });
      return Promise.reject(error);
    }
  );

  return instance;
};

export const supabaseAxios = createAxiosInstance();

// Tipos para respostas do Supabase
export interface SupabaseResponse<T> {
  data: T;
  error: string | null;
}

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Função helper para tratar erros do Supabase
export const handleSupabaseError = (error: unknown): string => {
  // Verificar se é um erro do Axios
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }

  // Verificar se é um erro com mensagem
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }

  return 'Erro interno do servidor';
};

// Função helper para fazer requisições GET
export const supabaseGet = async <T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<SupabaseResponse<T>> => {
  try {
    const response = await supabaseAxios.get<T>(endpoint, { params });
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    return { data: null as T, error: errorMessage };
  }
};

// Função helper para fazer requisições POST
export const supabasePost = async <T>(
  endpoint: string,
  data?: unknown
): Promise<SupabaseResponse<T>> => {
  try {
    const response = await supabaseAxios.post<T>(endpoint, data);
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    return { data: null as T, error: errorMessage };
  }
};

// Função helper para fazer requisições PUT
export const supabasePut = async <T>(
  endpoint: string,
  data?: unknown
): Promise<SupabaseResponse<T>> => {
  try {
    const response = await supabaseAxios.put<T>(endpoint, data);
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    return { data: null as T, error: errorMessage };
  }
};

// Função helper para fazer requisições PATCH
export const supabasePatch = async <T>(
  endpoint: string,
  data?: unknown
): Promise<SupabaseResponse<T>> => {
  try {
    const response = await supabaseAxios.patch<T>(endpoint, data);
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    return { data: null as T, error: errorMessage };
  }
};

// Função helper para fazer requisições DELETE
export const supabaseDelete = async <T>(
  endpoint: string
): Promise<SupabaseResponse<T>> => {
  try {
    const response = await supabaseAxios.delete<T>(endpoint);
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    return { data: null as T, error: errorMessage };
  }
};