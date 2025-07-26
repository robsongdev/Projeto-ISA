import { useState, useCallback } from 'react';
import { Despesa } from '@/types';
import { calcularTotalDespesas, calcularLucro } from '@/utils/despesaCalculacoes';

export const useDespesas = (initialDespesas: Despesa[] = []) => {
  const [despesas, setDespesas] = useState<Despesa[]>(initialDespesas);
  const [isLoading, setIsLoading] = useState(false);

  const adicionarDespesa = useCallback(async (despesa: Omit<Despesa, 'id' | 'createdAt' | 'updatedAt' | 'totalDespesas' | 'lucro'>) => {
    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const totalDespesas = calcularTotalDespesas(despesa as Despesa);
      const lucro = calcularLucro(despesa as Despesa);

      const novaDespesa: Despesa = {
        ...despesa,
        id: Date.now().toString(),
        totalDespesas,
        lucro,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      setDespesas(prev => [...prev, novaDespesa]);
      return novaDespesa;
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizarDespesa = useCallback(async (id: string, despesa: Partial<Despesa>) => {
    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setDespesas(prev =>
        prev.map(desp => {
          if (desp.id === id) {
            const despesaAtualizada = { ...desp, ...despesa, updatedAt: new Date() };
            // Recalcular totais se necessário
            if (despesa.valorFechado !== undefined || despesa.quantidadeQuestionario !== undefined) {
              despesaAtualizada.totalDespesas = calcularTotalDespesas(despesaAtualizada);
              despesaAtualizada.lucro = calcularLucro(despesaAtualizada);
            }
            return despesaAtualizada;
          }
          return desp;
        })
      );
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const excluirDespesa = useCallback(async (id: string) => {
    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      setDespesas(prev => prev.filter(desp => desp.id !== id));
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDespesaById = useCallback((id: string) => {
    return despesas.find(desp => desp.id === id) || null;
  }, [despesas]);

  const getTotalDespesas = useCallback(() => {
    return despesas.reduce((sum, despesa) => sum + despesa.totalDespesas, 0);
  }, [despesas]);

  const getTotalLucro = useCallback(() => {
    return despesas.reduce((sum, despesa) => sum + despesa.lucro, 0);
  }, [despesas]);

  return {
    despesas,
    isLoading,
    adicionarDespesa,
    atualizarDespesa,
    excluirDespesa,
    getDespesaById,
    getTotalDespesas,
    getTotalLucro,
  };
};