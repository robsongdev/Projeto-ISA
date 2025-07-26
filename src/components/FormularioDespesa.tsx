'use client';

import React, { useState, useEffect } from 'react';
import { Despesa } from '@/types';
import { ESTADOS_CIDADES_MAP, INSTITUTOS_DE_PESQUISA } from '@/types';
import { calcularTotalDespesas, calcularLucro } from '@/utils/despesaCalculacoes';

interface FormularioDespesaProps {
  onSubmit: (despesa: Despesa) => void;
  initialData?: Despesa;
  isEditing?: boolean;
}

export default function FormularioDespesa({ onSubmit, initialData, isEditing = false }: FormularioDespesaProps) {
  const [formData, setFormData] = useState<Partial<Despesa>>({
    dataInicio: '',
    dataTermino: '',
    estado: '',
    cidade: '',
    institutoPesquisa: '',
    estaRegistrado: 'nao',
    numeroRegistro: '',
    temContratante: 'nao',
    nomeContratante: '',
    numeroPesquisadores: 0,
    nomesPesquisadores: [],
    valorFechado: 0,
    quantidadeQuestionario: 0,
    valorQuestionario: 0,
    quantidadeDiariaCarro: 0,
    valorDiariaCarro: 0,
    quantidadeDiariaAlimentacao: 0,
    valorDiariaAlimentacao: 0,
    hospedagem: 0,
    gasolina: 0,
    custoSistema: 0,
    motoTaxi: 0,
    custoEstatistico: 0,
    outrosCustos: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNomePesquisadorChange = (index: number, value: string) => {
    const novosNomes = [...(formData.nomesPesquisadores || [])];
    novosNomes[index] = value;
    setFormData(prev => ({
      ...prev,
      nomesPesquisadores: novosNomes,
    }));
  };

  const removerPesquisadorField = (index: number) => {
    const novosNomes = formData.nomesPesquisadores?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({
      ...prev,
      nomesPesquisadores: novosNomes,
      numeroPesquisadores: novosNomes.length,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalDespesas = calcularTotalDespesas(formData as Despesa);
    const lucro = calcularLucro(formData as Despesa);

    const despesaCompleta: Despesa = {
      ...formData,
      totalDespesas: totalDespesas,
      lucro: lucro,
    } as Despesa;

    onSubmit(despesaCompleta);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data de Início
              </label>
              <input
                type="date"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data de Término
              </label>
              <input
                type="date"
                name="dataTermino"
                value={formData.dataTermino}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          {/* Localização */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="">Selecione um estado</option>
                {Object.keys(ESTADOS_CIDADES_MAP).map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Cidade
              </label>
              <select
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="">Selecione uma cidade</option>
                {formData.estado && ESTADOS_CIDADES_MAP[formData.estado]?.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Instituto de Pesquisa */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Instituto de Pesquisa
            </label>
            <select
              name="institutoPesquisa"
              value={formData.institutoPesquisa}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
            >
              <option value="">Selecione um instituto</option>
              {INSTITUTOS_DE_PESQUISA.map(instituto => (
                <option key={instituto} value={instituto}>{instituto}</option>
              ))}
            </select>
          </div>

          {/* Registro e Contratante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Está Registrado?</label>
              <select
                name="estaRegistrado"
                value={formData.estaRegistrado}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            {formData.estaRegistrado === 'sim' && (
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">Número do Registro</label>
                <input
                  type="text"
                  name="numeroRegistro"
                  value={formData.numeroRegistro}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Tem Contratante?</label>
              <select
                name="temContratante"
                value={formData.temContratante}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            {formData.temContratante === 'sim' && (
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">Nome do Contratante</label>
                <input
                  type="text"
                  name="nomeContratante"
                  value={formData.nomeContratante}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                />
              </div>
            )}
          </div>

          {/* Pesquisadores */}
          <div>
            <label className="text-base font-bold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Número de Pesquisadores
            </label>
            <input
              type="number"
              name="numeroPesquisadores"
              value={formData.numeroPesquisadores}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
            />
          </div>

          {/* Nomes dos Pesquisadores */}
          {(formData.numeroPesquisadores || 0) > 0 && (
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Nomes dos Pesquisadores</label>
              <div className="space-y-3">
                {Array.from({ length: formData.numeroPesquisadores || 0 }, (_, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={formData.nomesPesquisadores?.[index] || ''}
                      onChange={(e) => handleNomePesquisadorChange(index, e.target.value)}
                      placeholder={`Nome do pesquisador ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removerPesquisadorField(index)}
                      className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Valor Fechado (R$)
              </label>
              <input
                type="number"
                name="valorFechado"
                value={formData.valorFechado}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Quantidade de Questionários</label>
              <input
                type="number"
                name="quantidadeQuestionario"
                value={formData.quantidadeQuestionario}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Valor por Questionário (R$)</label>
              <input
                type="number"
                name="valorQuestionario"
                value={formData.valorQuestionario}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Quantidade de Diárias de Carro</label>
              <input
                type="number"
                name="quantidadeDiariaCarro"
                value={formData.quantidadeDiariaCarro}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Valor da Diária de Carro (R$)</label>
              <input
                type="number"
                name="valorDiariaCarro"
                value={formData.valorDiariaCarro}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Quantidade de Diárias de Alimentação</label>
              <input
                type="number"
                name="quantidadeDiariaAlimentacao"
                value={formData.quantidadeDiariaAlimentacao}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Valor da Diária de Alimentação (R$)</label>
              <input
                type="number"
                name="valorDiariaAlimentacao"
                value={formData.valorDiariaAlimentacao}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Hospedagem (R$)</label>
              <input
                type="number"
                name="hospedagem"
                value={formData.hospedagem}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Gasolina (R$)</label>
              <input
                type="number"
                name="gasolina"
                value={formData.gasolina}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Custo do Sistema (R$)</label>
              <input
                type="number"
                name="custoSistema"
                value={formData.custoSistema}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Moto-Táxi (R$)</label>
              <input
                type="number"
                name="motoTaxi"
                value={formData.motoTaxi}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Custo Estatístico (R$)</label>
              <input
                type="number"
                name="custoEstatistico"
                value={formData.custoEstatistico}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">Outros Custos (R$)</label>
            <input
              type="number"
              name="outrosCustos"
              value={formData.outrosCustos}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
            />
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isEditing ? 'Atualizar Despesa' : 'Salvar Despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}