'use client';

import React, { useState } from 'react';
import { Despesa } from '@/types';
import { gerarDadosGraficoPizza, filtrarDespesas } from '@/utils/despesaCalculacoes';
import ListaDespesas from '@/components/ListaDespesas';
import GraficoPizza from '@/components/GraficoPizza';
import Carregando from '@/components/Carregando';
import Link from 'next/link';
import { useDespesasCompartilhadas } from '@/hooks/useDespesasCompartilhadas';

export default function Home() {
  const { despesas, isLoading, excluirDespesa } = useDespesasCompartilhadas();
  const [filtros, setFiltros] = useState({
    estado: 'all',
    cidade: 'all',
    instituto: 'all',
    registro: 'all',
  });

  const handleEditarDespesa = (despesa: Despesa) => {
    // Redirecionar para a página de edição
    window.location.href = `/despesas?edit=${despesa.id}`;
  };

  const handleVisualizarDespesa = (despesa: Despesa) => {
    console.log('Página principal - Visualizando despesa:', despesa);
    console.log('Página principal - ID da despesa:', despesa.id);
    // Redirecionar para a página de visualização detalhada
    window.location.href = `/despesas/${despesa.id}`;
  };

  const handleExcluirDespesa = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      await excluirDespesa(id);
    }
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
            Resumo de Despesas
          </h1>
          <p className="text-xl text-gray-600">
            Visão geral das despesas de pesquisa com gráficos compactos
          </p>
        </div>

        {/* Botão Adicionar */}
        <div className="flex justify-center mb-6">
          <Link
            href="/despesas"
            className="px-8 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <path d="M15 3h6v6"/>
              <path d="M10 14L21 3"/>
            </svg>
            Adicionar Nova Despesa
          </Link>
        </div>

        {/* Indicador de Modo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
            <div className="w-3 h-3 rounded-full mr-3 bg-green-500"></div>
            <span className="text-sm font-semibold text-gray-700">
              Modo: Resumo de Dados
            </span>
          </div>
        </div>

                {/* Conteúdo Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Visualização de Dados e Gráficos
          </h2>

          {/* Lista de Despesas */}
          <div className="mb-8">
            <ListaDespesas
              despesas={despesas}
              onEdit={handleEditarDespesa}
              onView={handleVisualizarDespesa}
              onDelete={handleExcluirDespesa}
              filtros={filtros}
              onFiltrosChange={setFiltros}
            />
          </div>

          {/* Gráficos */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Gráficos Resumidos por Pesquisa
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
      </div>
    </div>
  );
}

// Componente para gráficos filtrados
function GraficosFiltrados({ despesas, filtros }: {
  despesas: Despesa[],
  filtros: { estado: string; cidade: string; instituto: string; registro: string }
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
