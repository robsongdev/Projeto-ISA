'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Despesa } from '@/types';
import { DespesasService } from '@/services/despesas';
import { calcularTotalDespesas, calcularLucro } from '@/utils/despesaCalculacoes';
import { IDespesaFilters, ICreateDespesaProps, IUpdateDespesaProps } from '@/services/despesas/types';

export function useDespesasController(pollingInterval = 5000) {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar despesas iniciais
  const carregarDespesas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await DespesasService.getAll();

      if (response.error) {
        setError(response.error);
        return;
      }

      setDespesas(response.data || []);
    } catch (err) {
      setError('Erro ao carregar despesas');
      console.error('Erro ao carregar despesas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Iniciar polling para sincronização
  const iniciarPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await DespesasService.getAll();
        if (!response.error && response.data) {
          setDespesas(response.data);
        }
      } catch (err) {
        console.error('Erro no polling:', err);
      }
    }, pollingInterval);
  }, [pollingInterval]);

  // Parar polling
  const pararPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Carregar dados na inicialização e iniciar polling
  useEffect(() => {
    carregarDespesas();
    iniciarPolling();

    // Cleanup ao desmontar
    return () => {
      pararPolling();
    };
  }, [carregarDespesas, iniciarPolling, pararPolling]);

  // Adicionar nova despesa
  const adicionarDespesa = useCallback(async (props: ICreateDespesaProps) => {
    setIsLoading(true);
    setError(null);

    try {
      // Calcular totais antes de salvar
      const despesaComCalculos = {
        ...props,
        totalDespesas: calcularTotalDespesas(props as Despesa),
        lucro: calcularLucro(props as Despesa),
      };

      const response = await DespesasService.create(despesaComCalculos);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setDespesas(prev => [response.data!, ...prev]);
      }
    } catch (err) {
      setError('Erro ao adicionar despesa');
      console.error('Erro ao adicionar despesa:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar despesa
  const atualizarDespesa = useCallback(async (id: string, props: IUpdateDespesaProps) => {
    setIsLoading(true);
    setError(null);

    try {
      // Recalcular totais se necessário
      let despesaAtualizada = { ...props };
      if (props.valorFechado !== undefined ||
          props.quantidadeQuestionario !== undefined ||
          props.valorQuestionario !== undefined ||
          props.quantidadeDiariaCarro !== undefined ||
          props.valorDiariaCarro !== undefined ||
          props.quantidadeDiariaAlimentacao !== undefined ||
          props.valorDiariaAlimentacao !== undefined ||
          props.hospedagem !== undefined ||
          props.gasolina !== undefined ||
          props.custoSistema !== undefined ||
          props.motoTaxi !== undefined ||
          props.custoEstatistico !== undefined ||
          props.outrosCustos !== undefined) {

        // Buscar despesa atual para ter todos os dados
        const despesaAtual = despesas.find(d => d.id === id);
        if (despesaAtual) {
          const despesaCompleta = { ...despesaAtual, ...props };
          despesaAtualizada = {
            ...props,
            totalDespesas: calcularTotalDespesas(despesaCompleta),
            lucro: calcularLucro(despesaCompleta),
          };
        }
      }

      const response = await DespesasService.update(id, despesaAtualizada);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setDespesas(prev =>
          prev.map(desp => desp.id === id ? response.data! : desp)
        );
      }
    } catch (err) {
      setError('Erro ao atualizar despesa');
      console.error('Erro ao atualizar despesa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [despesas]);

  // Excluir despesa
  const excluirDespesa = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await DespesasService.delete(id);

      if (response.error) {
        setError(response.error);
        return;
      }

      setDespesas(prev => prev.filter(desp => desp.id !== id));
    } catch (err) {
      setError('Erro ao excluir despesa');
      console.error('Erro ao excluir despesa:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar despesa por ID
  const obterDespesaPorId = useCallback((id: string) => {
    return despesas.find(desp => desp.id === id) || null;
  }, [despesas]);

  // Buscar despesas com filtros
  const buscarComFiltros = useCallback(async (filtros: IDespesaFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await DespesasService.getWithFilters(filtros);

      if (response.error) {
        setError(response.error);
        return;
      }

      setDespesas(response.data || []);
    } catch (err) {
      setError('Erro ao buscar despesas com filtros');
      console.error('Erro ao buscar despesas com filtros:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calcular totais
  const getTotalDespesas = useCallback(() => {
    return despesas.reduce((sum, despesa) => sum + despesa.totalDespesas, 0);
  }, [despesas]);

  const getTotalLucro = useCallback(() => {
    return despesas.reduce((sum, despesa) => sum + despesa.lucro, 0);
  }, [despesas]);

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  // Filtrar despesas localmente
  const filtrarDespesas = useCallback((filtros: IDespesaFilters) => {
    return despesas.filter(despesa => {
      if (filtros.estado && despesa.estado !== filtros.estado) return false;
      if (filtros.cidade && despesa.cidade !== filtros.cidade) return false;
      if (filtros.instituto && despesa.institutoPesquisa !== filtros.instituto) return false;
      if (filtros.registro && despesa.estaRegistrado !== filtros.registro) return false;
      return true;
    });
  }, [despesas]);

  return {
    despesas,
    isLoading,
    error,
    adicionarDespesa,
    atualizarDespesa,
    excluirDespesa,
    obterDespesaPorId,
    buscarComFiltros,
    carregarDespesas,
    getTotalDespesas,
    getTotalLucro,
    limparErro,
    filtrarDespesas,
    iniciarPolling,
    pararPolling,
  };
}