'use client';

import { useState, useEffect } from 'react';
import { Despesa } from '@/types';

// Dados simulados para demonstração
const mockDespesas: Despesa[] = [
  {
    id: '1',
    dataInicio: '2024-01-15',
    dataTermino: '2024-01-20',
    estado: 'PI',
    cidade: 'Teresina',
    institutoPesquisa: 'Piauí Vox',
    estaRegistrado: 'sim',
    numeroRegistro: 'BR-00001/2024',
    temContratante: 'sim',
    nomeContratante: 'Partido ABC',
    numeroPesquisadores: 3,
    nomesPesquisadores: ['João Silva', 'Maria Santos', 'Pedro Costa'],
    valorFechado: 5000.00,
    quantidadeQuestionario: 1.5,
    valorQuestionario: 10.00,
    quantidadeDiariaCarro: 2.0,
    valorDiariaCarro: 150.00,
    quantidadeDiariaAlimentacao: 3.0,
    valorDiariaAlimentacao: 80.00,
    hospedagem: 300.00,
    gasolina: 200.00,
    custoSistema: 100.00,
    motoTaxi: 50.00,
    custoEstatistico: 400.00,
    outrosCustos: 75.00,
    totalDespesas: 1585.00,
    lucro: 3415.00,
    criadoEm: new Date('2024-01-15'),
    atualizadoEm: new Date('2024-01-15'),
  },
  {
    id: '2',
    dataInicio: '2024-02-10',
    dataTermino: '2024-02-15',
    estado: 'MA',
    cidade: 'São Luís',
    institutoPesquisa: 'Estimativa',
    estaRegistrado: 'nao',
    temContratante: 'nao',
    numeroPesquisadores: 2,
    nomesPesquisadores: ['Ana Oliveira', 'Carlos Lima'],
    valorFechado: 3500.00,
    quantidadeQuestionario: 1.0,
    valorQuestionario: 12.00,
    quantidadeDiariaCarro: 1.5,
    valorDiariaCarro: 120.00,
    quantidadeDiariaAlimentacao: 2.5,
    valorDiariaAlimentacao: 70.00,
    hospedagem: 250.00,
    gasolina: 150.00,
    custoSistema: 80.00,
    motoTaxi: 40.00,
    custoEstatistico: 300.00,
    outrosCustos: 60.00,
    totalDespesas: 1045.00,
    lucro: 2455.00,
    criadoEm: new Date('2024-02-10'),
    atualizadoEm: new Date('2024-02-10'),
  },
];

export function useDespesasCompartilhadas() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    // Para debug: limpar localStorage temporariamente
    localStorage.removeItem('despesas');

    // Simular carregamento de dados do localStorage ou API
    const dadosSalvos = localStorage.getItem('despesas');

    if (dadosSalvos) {
      try {
        const despesasSalvas = JSON.parse(dadosSalvos) as Despesa[];
        setDespesas(despesasSalvas);
      } catch (error) {
        console.error('Erro ao carregar despesas:', error);
        setDespesas(mockDespesas);
      }
    } else {
      setDespesas(mockDespesas);
    }
  }, []);

  const adicionarDespesa = (despesa: Despesa) => {
    setIsLoading(true);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const novaDespesa = {
          ...despesa,
          id: Date.now().toString(),
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        };

        const novasDespesas = [...despesas, novaDespesa];
        setDespesas(novasDespesas);
        localStorage.setItem('despesas', JSON.stringify(novasDespesas));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const atualizarDespesa = (despesa: Despesa) => {
    setIsLoading(true);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const despesasAtualizadas = despesas.map(desp =>
          desp.id === despesa.id
            ? { ...despesa, atualizadoEm: new Date() }
            : desp
        );
        setDespesas(despesasAtualizadas);
        localStorage.setItem('despesas', JSON.stringify(despesasAtualizadas));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const excluirDespesa = (id: string) => {
    setIsLoading(true);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const despesasFiltradas = despesas.filter(desp => desp.id !== id);
        setDespesas(despesasFiltradas);
        localStorage.setItem('despesas', JSON.stringify(despesasFiltradas));
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  const obterDespesaPorId = (id: string) => {
    const despesa = despesas.find(desp => desp.id === id) || null;
    return despesa;
  };

  return {
    despesas,
    isLoading,
    adicionarDespesa,
    atualizarDespesa,
    excluirDespesa,
    obterDespesaPorId,
  };
}