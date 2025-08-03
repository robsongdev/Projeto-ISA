import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      despesas: {
        Row: {
          id: string;
          data_inicio: string;
          data_termino: string;
          estado: string;
          cidade: string;
          instituto_pesquisa: string;
          esta_registrado: 'sim' | 'nao';
          numero_registro: string | null;
          tem_contratante: 'sim' | 'nao';
          nome_contratante: string | null;
          numero_pesquisadores: number;
          nomes_pesquisadores: string[];
          valor_fechado: number;
          quantidade_questionario: number;
          valor_questionario: number;
          quantidade_diaria_carro: number;
          valor_diaria_carro: number;
          quantidade_diaria_alimentacao: number;
          valor_diaria_alimentacao: number;
          hospedagem: number;
          gasolina: number;
          custo_sistema: number;
          moto_taxi: number;
          custo_estatistico: number;
          outros_custos: number;
          total_despesas: number;
          lucro: number;
          criado_em: string;
          atualizado_em: string;
        };
        Insert: {
          id?: string;
          data_inicio: string;
          data_termino: string;
          estado: string;
          cidade: string;
          instituto_pesquisa: string;
          esta_registrado: 'sim' | 'nao';
          numero_registro?: string | null;
          tem_contratante: 'sim' | 'nao';
          nome_contratante?: string | null;
          numero_pesquisadores: number;
          nomes_pesquisadores: string[];
          valor_fechado: number;
          quantidade_questionario: number;
          valor_questionario: number;
          quantidade_diaria_carro: number;
          valor_diaria_carro: number;
          quantidade_diaria_alimentacao: number;
          valor_diaria_alimentacao: number;
          hospedagem: number;
          gasolina: number;
          custo_sistema: number;
          moto_taxi: number;
          custo_estatistico: number;
          outros_custos: number;
          total_despesas: number;
          lucro: number;
          criado_em?: string;
          atualizado_em?: string;
        };
        Update: {
          id?: string;
          data_inicio?: string;
          data_termino?: string;
          estado?: string;
          cidade?: string;
          instituto_pesquisa?: string;
          esta_registrado?: 'sim' | 'nao';
          numero_registro?: string | null;
          tem_contratante?: 'sim' | 'nao';
          nome_contratante?: string | null;
          numero_pesquisadores?: number;
          nomes_pesquisadores?: string[];
          valor_fechado?: number;
          quantidade_questionario?: number;
          valor_questionario?: number;
          quantidade_diaria_carro?: number;
          valor_diaria_carro?: number;
          quantidade_diaria_alimentacao?: number;
          valor_diaria_alimentacao?: number;
          hospedagem?: number;
          gasolina?: number;
          custo_sistema?: number;
          moto_taxi?: number;
          custo_estatistico?: number;
          outros_custos?: number;
          total_despesas?: number;
          lucro?: number;
          criado_em?: string;
          atualizado_em?: string;
        };
      };
    };
  };
}