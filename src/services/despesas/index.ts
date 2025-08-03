import { supabaseAxios } from '@/lib/axios';
import { despesaToInsert, rowToDespesa, despesaToUpdate } from '@/utils/supabaseHelpers';
import { Database } from '@/lib/supabase';
import { Despesa } from '@/types';
import {
  IDespesasResponse,
  IDespesaResponse,
  IDespesaFilters,
  ICreateDespesaProps,
  IUpdateDespesaProps
} from './types';

type DespesaRow = Database['public']['Tables']['despesas']['Row'];

const baseUrl = 'despesas';

export class DespesasService {
  // Buscar todas as despesas
  static async getAll(): Promise<IDespesasResponse> {
    try {
      const response = await supabaseAxios.get<DespesaRow[]>(`/${baseUrl}`, {
        params: {
          select: '*',
          order: 'criado_em.desc'
        }
      });

      const despesas = response.data?.map(rowToDespesa) || [];
      return { data: despesas, error: null };
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      return { data: null, error: 'Erro ao buscar despesas' };
    }
  }

  // Buscar despesa por ID
  static async getById(id: string): Promise<IDespesaResponse> {
    try {
      const response = await supabaseAxios.get<DespesaRow>(`/${baseUrl}`, {
        params: {
          select: '*',
          id: `eq.${id}`
        }
      });

      const despesa = response.data ? rowToDespesa(response.data) : null;
      return { data: despesa, error: null };
    } catch (error) {
      console.error('Erro ao buscar despesa:', error);
      return { data: null, error: 'Erro ao buscar despesa' };
    }
  }

  // Criar nova despesa
  static async create(props: ICreateDespesaProps): Promise<IDespesaResponse> {
    try {
      // Calcular totais antes de inserir
      const despesaCompleta = {
        ...props,
        totalDespesas: 0, // Será calculado pelo trigger do banco
        lucro: 0, // Será calculado pelo trigger do banco
      } as Despesa;

      const despesaInsert = despesaToInsert(despesaCompleta);
      const response = await supabaseAxios.post<DespesaRow>(`/${baseUrl}`, despesaInsert);

      const novaDespesa = rowToDespesa(response.data);
      return { data: novaDespesa, error: null };
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      return { data: null, error: 'Erro ao criar despesa' };
    }
  }

  // Atualizar despesa
  static async update(id: string, props: IUpdateDespesaProps): Promise<IDespesaResponse> {
    try {
      const despesaUpdate = despesaToUpdate(props);
      const response = await supabaseAxios.patch<DespesaRow>(`/${baseUrl}?id=eq.${id}`, despesaUpdate);

      const despesaAtualizada = rowToDespesa(response.data);
      return { data: despesaAtualizada, error: null };
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      return { data: null, error: 'Erro ao atualizar despesa' };
    }
  }

  // Excluir despesa
  static async delete(id: string): Promise<{ error: string | null }> {
    try {
      await supabaseAxios.delete(`/${baseUrl}?id=eq.${id}`);
      return { error: null };
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      return { error: 'Erro ao excluir despesa' };
    }
  }

  // Buscar despesas com filtros
  static async getWithFilters(filters: IDespesaFilters): Promise<IDespesasResponse> {
    try {
      const params: Record<string, string> = {
        select: '*',
        order: 'criado_em.desc'
      };

      if (filters.estado) {
        params.estado = `eq.${filters.estado}`;
      }
      if (filters.cidade) {
        params.cidade = `eq.${filters.cidade}`;
      }
      if (filters.instituto) {
        params.instituto_pesquisa = `eq.${filters.instituto}`;
      }
      if (filters.registro) {
        params.esta_registrado = `eq.${filters.registro}`;
      }

      const response = await supabaseAxios.get<DespesaRow[]>(`/${baseUrl}`, { params });

      const despesas = response.data?.map(rowToDespesa) || [];
      return { data: despesas, error: null };
    } catch (error) {
      console.error('Erro ao buscar despesas com filtros:', error);
      return { data: null, error: 'Erro ao buscar despesas com filtros' };
    }
  }
}