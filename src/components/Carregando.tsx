'use client';

import React from 'react';

interface LoaderProps {
  mensagem?: string;
  telaCheia?: boolean;
}

export default function Carregando({ mensagem = 'Carregando dados...', telaCheia = false }: LoaderProps) {
  if (telaCheia) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 flex items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-r-4 border-blue-500 border-purple-500"></div>
          <div className="ml-4">
            <p className="text-xl font-bold text-blue-700 animate-pulse">{mensagem}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-blue-500 border-purple-500"></div>
        <p className="ml-3 text-lg font-semibold text-blue-700">{mensagem}</p>
      </div>
    </div>
  );
}