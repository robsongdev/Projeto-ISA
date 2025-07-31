'use client';

import React, { useState, useEffect } from 'react';
import { Despesa } from '@/types';
import { gerarDadosGraficoPizza } from '@/utils/despesaCalculacoes';
import GraficoPizza from '@/components/GraficoPizza';
import Carregando from '@/components/Carregando';
import Link from 'next/link';
import { useDespesasCompartilhadas } from '@/hooks/useDespesasCompartilhadas';
import { useParams, useRouter } from 'next/navigation';

export default function DespesaDetalhadaPage() {
  const { obterDespesaPorId, isLoading, despesas } = useDespesasCompartilhadas();
  const [despesa, setDespesa] = useState<Despesa | null>(null);
  const [despesaNaoEncontrada, setDespesaNaoEncontrada] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params.id as string;
    console.log('Página de detalhes - ID recebido:', id);
    console.log('Página de detalhes - Params:', params);
    console.log('Página de detalhes - Despesas carregadas:', despesas.length);

    if (id && despesas.length > 0) {
      const despesaEncontrada = obterDespesaPorId(id);
      console.log('Página de detalhes - Despesa encontrada:', despesaEncontrada);

      if (despesaEncontrada) {
        setDespesa(despesaEncontrada);
        setDespesaNaoEncontrada(false);
      } else {
        console.log('Página de detalhes - Despesa não encontrada');
        setDespesaNaoEncontrada(true);
      }
    }
  }, [params.id, obterDespesaPorId, despesas]);

  if (isLoading) {
    return <Carregando telaCheia />;
  }

  if (despesaNaoEncontrada) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Despesa não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A despesa com ID &quot;{params.id}&quot; não foi encontrada no sistema.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg"
          >
            Voltar para Resumo
          </Link>
        </div>
      </div>
    );
  }

  if (!despesa) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto text-center">
          <Carregando />
          <p className="text-gray-600 mt-4">Carregando detalhes da despesa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Detalhes da Despesa
          </h1>
          <p className="text-xl text-gray-600">
            Análise completa da despesa selecionada
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-center mb-6 space-x-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 20V10"/>
              <path d="M18 20V4"/>
              <path d="M6 20v-6"/>
            </svg>
            Voltar para Resumo
          </Link>
          <Link
            href={`/despesas?edit=${despesa.id}`}
            className="px-6 py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar Despesa
          </Link>
        </div>

        {/* Indicador de Modo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
            <div className="w-3 h-3 rounded-full mr-3 bg-purple-500"></div>
            <span className="text-sm font-semibold text-gray-700">
              Modo: Visualização Detalhada
            </span>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Cabeçalho da Despesa */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {despesa.cidade} - {despesa.institutoPesquisa}
            </h2>
            <p className="text-gray-600 text-lg">
              {despesa.dataInicio} a {despesa.dataTermino} • {despesa.estado}
            </p>
            <div className="mt-4 flex justify-center space-x-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Valor Fechado: R$ {despesa.valorFechado.toLocaleString('pt-BR')}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Lucro: R$ {despesa.lucro.toLocaleString('pt-BR')}
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                Despesas: R$ {despesa.totalDespesas.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Gráfico com mais espaço */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfico */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <GraficoPizza
                dados={gerarDadosGraficoPizza(despesa)}
                titulo="Distribuição de Custos"
              />
            </div>

            {/* Legenda Detalhada */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhamento de Custos</h3>
              <div className="space-y-3">
                {(() => {
                  const dados = gerarDadosGraficoPizza(despesa);
                  const total = dados.reduce((sum, item) => sum + item.valor, 0);

                  return dados.map((item, index) => {
                    const percentual = ((item.valor / total) * 100).toFixed(1);

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded mr-3"
                            style={{ backgroundColor: item.cor }}
                          ></div>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">
                            R$ {item.valor.toLocaleString('pt-BR')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {percentual}%
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Resumo Financeiro */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Resumo Financeiro</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Fechado:</span>
                    <span className="font-bold">R$ {despesa.valorFechado.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Total Despesas:</span>
                    <span className="font-bold">R$ {despesa.totalDespesas.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-green-600 border-t pt-1">
                    <span>Lucro:</span>
                    <span className="font-bold">R$ {despesa.lucro.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-blue-600 border-t pt-1">
                    <span>Margem de Lucro:</span>
                    <span className="font-bold">
                      {((despesa.lucro / despesa.valorFechado) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Informações da Pesquisa</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Estado:</span> {despesa.estado}</div>
                <div><span className="font-medium">Cidade:</span> {despesa.cidade}</div>
                <div><span className="font-medium">Instituto:</span> {despesa.institutoPesquisa}</div>
                <div><span className="font-medium">Registrado:</span> {despesa.estaRegistrado}</div>
                {despesa.numeroRegistro && (
                  <div><span className="font-medium">Nº Registro:</span> {despesa.numeroRegistro}</div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Equipe</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Pesquisadores:</span> {despesa.numeroPesquisadores}</div>
                <div className="mt-3">
                  <span className="font-medium">Nomes:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {despesa.nomesPesquisadores.map((nome, index) => (
                      <li key={index}>{nome}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Contratante</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Tem Contratante:</span> {despesa.temContratante}</div>
                {despesa.nomeContratante && (
                  <div><span className="font-medium">Nome:</span> {despesa.nomeContratante}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}