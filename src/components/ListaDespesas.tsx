'use client';

import React, { useState, useMemo } from 'react';
import { Despesa, ESTADOS_CIDADES_MAP, INSTITUTOS_DE_PESQUISA } from '@/types';
import { formatarMoeda, filtrarDespesas } from '@/utils/despesaCalculacoes';

interface ListaDespesasProps {
  despesas: Despesa[];
  onEdit: (despesa: Despesa) => void;
  onDelete: (id: string) => void;
}

export default function ListaDespesas({ despesas, onEdit, onDelete }: ListaDespesasProps) {
  const [filtros, setFiltros] = useState({
    estado: 'all',
    cidade: 'all',
    instituto: 'all',
  });

  const handleFiltroChange = (campo: keyof typeof filtros, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const despesasFiltradas = useMemo(() => {
    return filtrarDespesas(despesas, filtros);
  }, [despesas, filtros]);

  const totalDespesas = useMemo(() => {
    return despesasFiltradas.reduce((total, despesa) => total + despesa.totalDespesas, 0);
  }, [despesasFiltradas]);

  const cidadesDisponiveis = useMemo(() => {
    if (filtros.estado === 'all') return [];
    return ESTADOS_CIDADES_MAP[filtros.estado] || [];
  }, [filtros.estado]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Filtros */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">Todos os Estados</option>
                {Object.keys(ESTADOS_CIDADES_MAP).map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
              <select
                value={filtros.cidade}
                onChange={(e) => handleFiltroChange('cidade', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
                disabled={filtros.estado === 'all'}
              >
                <option value="all">Todas as Cidades</option>
                {cidadesDisponiveis.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instituto</label>
              <select
                value={filtros.instituto}
                onChange={(e) => handleFiltroChange('instituto', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
              >
                <option value="all">Todos os Institutos</option>
                {INSTITUTOS_DE_PESQUISA.map(instituto => (
                  <option key={instituto} value={instituto}>{instituto}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-800 text-white sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Local</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Instituto</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Valor Fechado</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Total Despesas</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Lucro</th>
                <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Ações</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">
                      {new Date(despesa.dataInicio).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-gray-500 text-xs">
                      até {new Date(despesa.dataTermino).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{despesa.cidade}</div>
                    <div className="text-gray-500 text-xs">{despesa.estado}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {despesa.institutoPesquisa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatarMoeda(despesa.valorFechado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    {formatarMoeda(despesa.totalDespesas)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {formatarMoeda(despesa.lucro)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(despesa)}
                        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(despesa.id!)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110"
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
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
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
    </div>
  );
}