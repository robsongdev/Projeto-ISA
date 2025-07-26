'use client';

import React, { useState } from 'react';
import { Despesa } from '@/types';
import { gerarDadosGraficoPizza } from '@/utils/despesaCalculacoes';
import FormularioDespesa from '@/components/FormularioDespesa';
import ListaDespesas from '@/components/ListaDespesas';
import GraficoPizza from '@/components/GraficoPizza';
import Carregando from '@/components/Carregando';

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

export default function Home() {
  const [despesas, setDespesas] = useState<Despesa[]>(mockDespesas);
  const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleAdicionarDespesa = (despesa: Despesa) => {
    setIsLoading(true);

    // Simular delay de processamento
    setTimeout(() => {
      const novaDespesa = {
        ...despesa,
        id: Date.now().toString(),
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      setDespesas(prev => [...prev, novaDespesa]);
      setIsLoading(false);
    }, 1000);
  };

  const handleEditarDespesa = (despesa: Despesa) => {
    setDespesaEditando(despesa);
    setShowForm(true);
  };

  const handleAtualizarDespesa = (despesa: Despesa) => {
    setIsLoading(true);

    setTimeout(() => {
      setDespesas(prev =>
        prev.map(desp =>
          desp.id === despesa.id
            ? { ...despesa, atualizadoEm: new Date() }
            : desp
        )
      );
      setDespesaEditando(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleExcluirDespesa = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      setIsLoading(true);

      setTimeout(() => {
        setDespesas(prev => prev.filter(desp => desp.id !== id));
        setIsLoading(false);
      }, 500);
    }
  };

  const handleCancelarEdicao = () => {
    setDespesaEditando(null);
  };

  // Gerar dados para o gráfico de pizza (usando a primeira despesa como exemplo)
  // const pieChartData = despesas.length > 0 ? gerarDadosGraficoPizza(despesas[0]) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 md:p-8 lg:p-10">
      {isLoading && <Carregando telaCheia />}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            Controle de Despesas de Pesquisa Eleitoral
          </h1>
          <p className="text-xl text-gray-200">
            Gerencie suas despesas de pesquisa com facilidade e visualize os dados em gráficos
          </p>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 to-purple-700 transition-all duration-300 shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
            Adicionar Despesa
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 to-teal-700 transition-all duration-300 shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>
            Visualizar Dados
          </button>
        </div>

        {/* Conteúdo Principal */}
        {showForm ? (
          <FormularioDespesa
            onSubmit={despesaEditando ? handleAtualizarDespesa : handleAdicionarDespesa}
            initialData={despesaEditando || undefined}
            isEditing={!!despesaEditando}
          />
        ) : (
          <>
            {/* Lista de Despesas */}
            <ListaDespesas
              despesas={despesas}
              onEdit={handleEditarDespesa}
              onDelete={handleExcluirDespesa}
            />

            {/* Gráficos */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Gráficos Detalhados por Pesquisa
              </h2>

              {despesas.length === 0 ? (
                <div className="text-center text-gray-200 p-8">
                  <p>Nenhum detalhe de despesa para exibir. Adicione despesas para ver os gráficos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {despesas.map((despesa) => (
                    <GraficoPizza
                      key={despesa.id}
                      dados={gerarDadosGraficoPizza(despesa)}
                      titulo={`${despesa.cidade} - ${despesa.institutoPesquisa}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Botão Cancelar Edição */}
        {despesaEditando && (
          <div className="text-center mt-4">
            <button
              onClick={handleCancelarEdicao}
              className="px-6 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-lg"
            >
              Cancelar Edição
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
