import { Despesa } from '@/types';

export interface IDespesasResponse {
  data: Despesa[] | null;
  error: string | null;
}

export interface IDespesaResponse {
  data: Despesa | null;
  error: string | null;
}

export interface IDespesaFilters {
  estado?: string;
  cidade?: string;
  instituto?: string;
  registro?: string;
}

export type ICreateDespesaProps = Omit<Despesa, 'id' | 'criadoEm' | 'atualizadoEm' | 'totalDespesas' | 'lucro'>;

export type IUpdateDespesaProps = Partial<Despesa>;