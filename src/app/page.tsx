'use client';

import React, { useState } from 'react';
import { Despesa } from '@/types';
import { gerarDadosGraficoPizza, filtrarDespesas } from '@/utils/despesaCalculacoes';
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
  const [filtros, setFiltros] = useState({
    estado: 'all',
    cidade: 'all',
    instituto: 'all',
  });

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      {isLoading && <Carregando telaCheia />}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Controle de Despesas de Pesquisa Eleitoral
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie suas despesas de pesquisa com facilidade e visualize os dados em gráficos
          </p>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg flex items-center ${
              showForm
                ? 'bg-blue-600 text-white shadow-xl scale-105 border-2 border-blue-400'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
            Adicionar Despesa
            {showForm && (
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg flex items-center ${
              !showForm
                ? 'bg-blue-600 text-white shadow-xl scale-105 border-2 border-blue-400'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>
            Visualizar Dados
            {!showForm && (
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Indicador de Seção Ativa */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
            <div className={`w-3 h-3 rounded-full mr-3 ${showForm ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-semibold text-gray-700">
              {showForm ? 'Modo: Adicionar/Editar Despesa' : 'Modo: Visualização de Dados'}
            </span>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {showForm ? (
          <FormularioDespesa
            onSubmit={despesaEditando ? handleAtualizarDespesa : handleAdicionarDespesa}
            initialData={despesaEditando || undefined}
            isEditing={!!despesaEditando}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Visualização de Dados e Gráficos
            </h2>

            {/* Lista de Despesas */}
            <div className="mb-8">
              <ListaDespesas
                despesas={despesas}
                onEdit={handleEditarDespesa}
                onDelete={handleExcluirDespesa}
                filtros={filtros}
                onFiltrosChange={setFiltros}
              />
            </div>

            {/* Gráficos */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Gráficos Detalhados por Pesquisa
              </h3>

              {despesas.length === 0 ? (
                <div className="text-center text-gray-600 p-8">
                  <p>Nenhum detalhe de despesa para exibir. Adicione despesas para ver os gráficos.</p>
                </div>
              ) : (
                <GraficosFiltrados
                  despesas={despesas}
                  filtros={filtros}
                />
              )}
            </div>
          </div>
        )}

        {/* Botão Cancelar Edição */}
        {despesaEditando && (
          <div className="text-center mt-4">
            <button
              onClick={handleCancelarEdicao}
              className="px-6 py-3 rounded-lg font-bold text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 shadow-lg"
            >
              Cancelar Edição
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para gráficos filtrados
function GraficosFiltrados({ despesas, filtros }: {
  despesas: Despesa[],
  filtros: { estado: string; cidade: string; instituto: string }
}) {
  const despesasFiltradas = filtrarDespesas(despesas, filtros);

  if (despesasFiltradas.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        <p>Nenhuma despesa encontrada com os filtros aplicados. Tente ajustar os filtros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {despesasFiltradas.map((despesa) => (
        <GraficoPizza
          key={despesa.id}
          dados={gerarDadosGraficoPizza(despesa)}
          titulo={`${despesa.cidade} - ${despesa.institutoPesquisa}`}
        />
      ))}
    </div>
  );
}
