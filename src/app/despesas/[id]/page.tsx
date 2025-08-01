'use client';

import React, { useState, useEffect } from 'react';
import { Despesa } from '@/types';
import { gerarDadosGraficoPizza } from '@/utils/despesaCalculacoes';
import GraficoPizza from '@/components/GraficoPizza';
import Carregando from '@/components/Carregando';
import Link from 'next/link';
import { useDespesasCompartilhadas } from '@/hooks/useDespesasCompartilhadas';
import { useParams, useRouter } from 'next/navigation';
import {
  FiBarChart,
  FiEdit3,
  FiMapPin,
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPercent,
  FiHome,
  FiBriefcase,
  FiFileText
} from 'react-icons/fi';

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
             <FiHome className="w-5 h-5 mr-2" />
             Voltar para Resumo
           </Link>
                     <Link
             href={`/despesas?edit=${despesa.id}`}
             className="px-6 py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 shadow-lg flex items-center"
           >
             <FiEdit3 className="w-5 h-5 mr-2" />
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
               {new Date(despesa.dataInicio).toLocaleDateString('pt-BR')} a {new Date(despesa.dataTermino).toLocaleDateString('pt-BR')} • {despesa.estado}
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
             <div className="bg-gray-50 rounded-lg p-6 shadow-lg flex items-center justify-center min-h-[500px]">
               <GraficoPizza
                 dados={gerarDadosGraficoPizza(despesa)}
                 titulo="Distribuição de Custos"
                 mostrarLegenda={false}
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
               <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg text-white">
                                   <div className="flex items-center mb-4">
                    <FiDollarSign className="w-6 h-6 mr-3" />
                    <h4 className="text-xl font-bold">Resumo Financeiro</h4>
                  </div>

                 <div className="space-y-4">
                   <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                     <span className="text-gray-200 font-medium">Valor Fechado:</span>
                     <span className="text-2xl font-bold text-white">
                       R$ {despesa.valorFechado.toLocaleString('pt-BR')}
                     </span>
                   </div>

                   <div className="flex justify-between items-center p-3 bg-red-900 bg-opacity-50 rounded-lg border border-red-700">
                     <span className="text-red-200 font-medium">Total Despesas:</span>
                     <span className="text-xl font-bold text-red-100">
                       R$ {despesa.totalDespesas.toLocaleString('pt-BR')}
                     </span>
                   </div>

                   <div className="flex justify-between items-center p-3 bg-emerald-900 bg-opacity-50 rounded-lg border border-emerald-700">
                     <span className="text-emerald-200 font-medium">Lucro:</span>
                     <span className="text-2xl font-bold text-emerald-100">
                       R$ {despesa.lucro.toLocaleString('pt-BR')}
                     </span>
                   </div>

                   <div className="flex justify-between items-center p-4 bg-amber-900 bg-opacity-50 rounded-lg border border-amber-700">
                     <span className="text-amber-200 font-medium">Margem de Lucro:</span>
                     <span className="text-3xl font-bold text-amber-100">
                       {((despesa.lucro / despesa.valorFechado) * 100).toFixed(1)}%
                     </span>
                   </div>
                 </div>

                 {/* Indicador de Performance */}
                 <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                   <div className="flex items-center justify-between">
                     <span className="text-gray-200 text-sm">Performance:</span>
                     <div className="flex items-center">
                       {((despesa.lucro / despesa.valorFechado) * 100) >= 50 ? (
                         <span className="text-emerald-300 text-sm font-bold">Excelente</span>
                       ) : ((despesa.lucro / despesa.valorFechado) * 100) >= 30 ? (
                         <span className="text-amber-300 text-sm font-bold">Boa</span>
                       ) : (
                         <span className="text-red-300 text-sm font-bold">Atenção</span>
                       )}
                       <div className="ml-2 w-3 h-3 rounded-full bg-emerald-500"></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

                                           {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg border border-blue-200">
                                 <h4 className="font-bold text-blue-900 mb-4 text-lg flex items-center">
                   <FiBriefcase className="w-5 h-5 mr-2" />
                   Dados do Projeto
                 </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-800 block mb-1">Localização:</span>
                    <span className="text-gray-800 font-medium">{despesa.cidade} - {despesa.estado}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-800 block mb-1">Instituto Responsável:</span>
                    <span className="text-gray-800 font-medium">{despesa.institutoPesquisa}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-800 block mb-1">Status de Registro:</span>
                    <span className="text-gray-800 font-medium">{despesa.estaRegistrado}</span>
                  </div>
                  {despesa.numeroRegistro && (
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="font-semibold text-blue-800 block mb-1">Número de Registro:</span>
                      <span className="text-gray-800 font-medium">{despesa.numeroRegistro}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg border border-green-200">
                                 <h4 className="font-bold text-green-900 mb-4 text-lg flex items-center">
                   <FiUsers className="w-5 h-5 mr-2" />
                   Equipe de Pesquisa
                 </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <span className="font-semibold text-green-800 block mb-1">Total de Pesquisadores:</span>
                    <span className="text-gray-800 font-medium">{despesa.numeroPesquisadores}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <span className="font-semibold text-green-800 block mb-1">Integrantes da Equipe:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {despesa.nomesPesquisadores.map((nome, index) => (
                        <li key={index} className="text-gray-800 font-medium">{nome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-lg border border-purple-200">
                                 <h4 className="font-bold text-purple-900 mb-4 text-lg flex items-center">
                   <FiUserCheck className="w-5 h-5 mr-2" />
                   Informações do Contratante
                 </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-purple-200">
                    <span className="font-semibold text-purple-800 block mb-1">Possui Contratante:</span>
                    <span className="text-gray-800 font-medium">{despesa.temContratante}</span>
                  </div>
                  {despesa.nomeContratante && (
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <span className="font-semibold text-purple-800 block mb-1">Nome do Contratante:</span>
                      <span className="text-gray-800 font-medium">{despesa.nomeContratante}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}