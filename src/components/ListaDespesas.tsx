'use client';

import React, { useState, useMemo } from 'react';
import { Despesa, ESTADOS_CIDADES_MAP, INSTITUTOS_DE_PESQUISA } from '@/types';
import { formatarMoeda, filtrarDespesas } from '@/utils/despesaCalculacoes';

interface ListaDespesasProps {
  despesas: Despesa[];
  onEdit: (despesa: Despesa) => void;
  onDelete: (id: string) => void;
  onView?: (despesa: Despesa) => void;
  filtros?: { estado: string; cidade: string; instituto: string; registro: string };
  onFiltrosChange?: (filtros: { estado: string; cidade: string; instituto: string; registro: string }) => void;
}

export default function ListaDespesas({ despesas, onEdit, onDelete, onView, filtros: filtrosExternos, onFiltrosChange }: ListaDespesasProps) {
  const [filtrosInternos, setFiltrosInternos] = useState({
    estado: 'all',
    cidade: 'all',
    instituto: 'all',
    registro: 'all',
  });

  // Usar filtros externos se fornecidos, senão usar internos
  const filtros = filtrosExternos || filtrosInternos;
  const setFiltros = onFiltrosChange || setFiltrosInternos;

  const handleFiltroChange = (campo: keyof typeof filtros, valor: string) => {

    const novosFiltros = {
      ...filtros,
      [campo]: valor,
    };

    // Se o estado foi alterado, resetar a cidade para "all"
    if (campo === 'estado') {
      novosFiltros.cidade = 'all';
    }

    // Se a cidade foi alterada, validar se ela existe no estado atual
    if (campo === 'cidade' && valor !== 'all' && novosFiltros.estado !== 'all') {
      const cidadesDoEstado = ESTADOS_CIDADES_MAP[novosFiltros.estado] || [];
      if (!cidadesDoEstado.includes(valor)) {
        novosFiltros.cidade = 'all';
      }
    }

    setFiltros(novosFiltros);
  };

  const despesasFiltradas = useMemo(() => {
    const resultado = filtrarDespesas(despesas, filtros);
    return resultado;
  }, [despesas, filtros]);

  const totalDespesas = useMemo(() => {
    const total = despesasFiltradas.reduce((total, despesa) => total + despesa.totalDespesas, 0);
    return total;
  }, [despesasFiltradas]);

  const cidadesDisponiveis = useMemo(() => {
    if (filtros.estado === 'all') return [];
    const cidades = ESTADOS_CIDADES_MAP[filtros.estado] || [];
    return cidades;
  }, [filtros.estado]);

  // Validar se a cidade selecionada existe no estado atual
  const cidadeValida = useMemo(() => {
    if (filtros.estado === 'all' || filtros.cidade === 'all') return true;
    const valida = cidadesDisponiveis.includes(filtros.cidade);
    return valida;
  }, [filtros.estado, filtros.cidade, cidadesDisponiveis]);

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="all">Todos os Estados</option>
                {Object.keys(ESTADOS_CIDADES_MAP).map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Cidade</label>
              <select
                value={cidadeValida ? filtros.cidade : 'all'}
                onChange={(e) => handleFiltroChange('cidade', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                disabled={filtros.estado === 'all'}
              >
                <option value="all">Todas as Cidades</option>
                {cidadesDisponiveis.map((cidade) => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Instituto</label>
              <select
                value={filtros.instituto}
                onChange={(e) => handleFiltroChange('instituto', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="all">Todos os Institutos</option>
                {INSTITUTOS_DE_PESQUISA.map(instituto => (
                  <option key={instituto} value={instituto}>{instituto}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Registro</label>
              <select
                value={filtros.registro}
                onChange={(e) => handleFiltroChange('registro', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="all">Todos os Registros</option>
                <option value="sim">Registrados</option>
                <option value="nao">Não Registrados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Data</th>
                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Local</th>
                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Instituto</th>
                 <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">Registro</th>
                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Contratante</th>
                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Valor Fechado</th>
                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Total Despesas</th>
                 <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Lucro</th>
                 <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {despesasFiltradas.map((despesa, index) => (
                <tr
                  key={despesa.id}
                  className={`transition-all duration-200 hover:bg-blue-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                     <div className="font-medium">
                       {(() => {
                         const dataInicio = new Date(despesa.dataInicio);
                         const dataTermino = new Date(despesa.dataTermino);

                         const mesInicio = dataInicio.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                         const mesTermino = dataTermino.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

                         // Se as datas são do mesmo mês e ano, mostrar apenas uma vez
                         if (mesInicio === mesTermino) {
                           return mesInicio;
                         }

                         // Se são meses diferentes, mostrar o período
                         return `${mesInicio} - ${mesTermino}`;
                       })()}
                     </div>
                     <div className="text-gray-500 text-xs">
                       {new Date(despesa.dataInicio).toLocaleDateString('pt-BR')} a {new Date(despesa.dataTermino).toLocaleDateString('pt-BR')}
                     </div>
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                     <div className="font-medium">{despesa.cidade}</div>
                     <div className="text-gray-500 text-xs">{despesa.estado}</div>
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                     {despesa.institutoPesquisa}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-center">
                    {despesa.estaRegistrado === 'sim' ? (
                      <div className="flex justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </td>
                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                     {despesa.temContratante === 'sim' && despesa.nomeContratante ? despesa.nomeContratante : 'Consumo próprio'}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                     {formatarMoeda(despesa.valorFechado)}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-red-600">
                     {formatarMoeda(despesa.totalDespesas)}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
                     {formatarMoeda(despesa.lucro)}
                   </td>
                   <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                                             {onView && (
                         <button
                           onClick={() => onView(despesa)}
                           className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                           title="Visualizar Detalhes"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                             <circle cx="12" cy="12" r="3" />
                           </svg>
                         </button>
                       )}
                       <button
                         onClick={() => onEdit(despesa)}
                         className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                         title="Editar"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                       </button>
                       <button
                         onClick={() => onDelete(despesa.id!)}
                         className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                         title="Excluir"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumo */}
        {despesasFiltradas.length > 0 && (
          <div className="p-6 bg-gray-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-lg font-semibold mb-2 md:mb-0">
                Total de Despesas: {despesasFiltradas.length}
              </div>
              <div className="text-2xl font-bold">
                Total Geral: {formatarMoeda(totalDespesas)}
              </div>
            </div>
          </div>
        )}

        {/* Mensagem quando não há dados */}
        {despesasFiltradas.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-500 text-lg">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl font-semibold mb-2">Nenhuma despesa encontrada</p>
              <p className="text-gray-400">Tente ajustar os filtros ou adicionar uma nova despesa.</p>
            </div>
          </div>
        )}
      </div>
  );
}