'use client';

import React from 'react';
import { GraficoPizzaData } from '@/types';

export interface GraficoPizzaProps {
  dados: GraficoPizzaData[];
  titulo?: string;
  largura?: number;
  altura?: number;
}

export default function GraficoPizza({ dados, titulo, largura = 300, altura = 300 }: GraficoPizzaProps) {
  if (!dados || dados.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-xl font-semibold">Nenhum dado para exibir</p>
          <p className="text-gray-400">Adicione despesas para visualizar o gráfico.</p>
        </div>
      </div>
    );
  }

  const total = dados.reduce((sum, item) => sum + item.valor, 0);
  let currentAngle = 0;

  const calcularPath = (valor: number, raio: number) => {
    const angulo = (valor / total) * 360;
    const anguloInicio = currentAngle;
    const anguloFim = currentAngle + angulo;

    const x1 = raio * Math.cos((anguloInicio - 90) * Math.PI / 180);
    const y1 = raio * Math.sin((anguloInicio - 90) * Math.PI / 180);
    const x2 = raio * Math.cos((anguloFim - 90) * Math.PI / 180);
    const y2 = raio * Math.sin((anguloFim - 90) * Math.PI / 180);

    const largeArcFlag = angulo > 180 ? 1 : 0;

    const path = [
      `M ${raio + x1} ${raio + y1}`,
      `A ${raio} ${raio} 0 ${largeArcFlag} 1 ${raio + x2} ${raio + y2}`,
      'L 150 150',
      'Z'
    ].join(' ');

    currentAngle += angulo;
    return path;
  };

  const raio = Math.min(largura, altura) / 2 - 20;
  const centroX = largura / 2;
  const centroY = altura / 2;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
      {titulo && (
        <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          {titulo}
        </h3>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Gráfico */}
        <div className="relative">
          <svg
            width={largura}
            height={altura}
            className="transition-all duration-500 hover:scale-105"
          >
            <g transform={`translate(${centroX}, ${centroY})`}>
              {dados.map((item, index) => (
                <path
                  key={index}
                  d={calcularPath(item.valor, raio)}
                  fill={item.cor}
                  stroke="#fff"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Legenda */}
        <div className="space-y-3 min-w-[200px]">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Legenda</h4>
          {dados.map((item, index) => {
            const percentual = ((item.valor / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">
                    {percentual}%
                  </div>
                  <div className="text-xs text-gray-500">
                    R$ {item.valor.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="text-center">
              <div className="text-sm font-medium opacity-90">Total</div>
              <div className="text-xl font-bold">
                R$ {total.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}