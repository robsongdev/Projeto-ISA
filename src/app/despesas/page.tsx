'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Despesa } from '@/types';
import FormularioDespesa from '@/components/FormularioDespesa';
import Carregando from '@/components/Carregando';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useDespesasController } from '@/hooks/useDespesasController';
import { useRouter, useSearchParams } from 'next/navigation';

function DespesasPageContent() {
  const {
    adicionarDespesa,
    atualizarDespesa,
    obterDespesaPorId,
    isLoading,
    error,
    limparErro
  } = useDespesasController();

  const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Verificar se há um ID de edição na URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const despesa = obterDespesaPorId(editId);
      if (despesa) {
        setDespesaEditando(despesa);
      }
    }
  }, [searchParams, obterDespesaPorId]);

  const handleAdicionarDespesa = async (despesa: Despesa) => {
    await adicionarDespesa(despesa);
    router.push('/');
  };

  const handleAtualizarDespesa = async (despesa: Despesa) => {
    await atualizarDespesa(despesa.id!, despesa);
    setDespesaEditando(null);
    router.push('/');
  };

  const handleCancelarEdicao = () => {
    setDespesaEditando(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      {isLoading && <Carregando telaCheia />}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            {despesaEditando ? 'Editar Despesa' : 'Nova Despesa'}
          </h1>
          <p className="text-xl text-gray-600">
            {despesaEditando
              ? 'Edite os dados da despesa selecionada'
              : 'Adicione uma nova despesa de pesquisa eleitoral'
            }
          </p>
        </div>

        {/* Indicador de Modo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
            <div className={`w-3 h-3 rounded-full mr-3 ${despesaEditando ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            <span className="text-sm font-semibold text-gray-700">
              {despesaEditando ? 'Modo: Editando Despesa' : 'Modo: Nova Despesa'}
            </span>
          </div>
        </div>

        {/* Tratamento de Erros */}
        {error && (
          <div className="mb-6">
            <ErrorMessage error={error} onClose={limparErro} />
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <FormularioDespesa
            onSubmit={despesaEditando ? handleAtualizarDespesa : handleAdicionarDespesa}
            initialData={despesaEditando || undefined}
            isEditing={!!despesaEditando}
          />
        </div>

        {/* Botão Cancelar */}
        <div className="text-center mt-4">
          <button
            onClick={handleCancelarEdicao}
            className="px-6 py-3 rounded-lg font-bold text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 shadow-lg"
          >
            {despesaEditando ? 'Cancelar Edição' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DespesasPage() {
  return (
    <Suspense fallback={<Carregando telaCheia />}>
      <DespesasPageContent />
    </Suspense>
  );
}