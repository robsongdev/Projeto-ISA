'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { GraficoPizzaData } from '@/types';

export interface GraficoPizzaProps {
  dados: GraficoPizzaData[];
  titulo?: string;
}

export default function GraficoPizza({ dados, titulo }: GraficoPizzaProps) {
  if (!dados || dados.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
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

  // Formatar dados para Recharts
  const chartData = dados.map(item => ({
    name: item.label,
    value: item.valor,
    color: item.cor,
    percentual: ((item.valor / total) * 100).toFixed(1)
  }));

  // Tipos para Recharts
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        percentual: string;
      };
    }>;
  }

  interface LegendProps {
    payload?: Array<{
      value: string;
      color: string;
      payload: {
        name: string;
        value: number;
        percentual: string;
      };
    }>;
  }

  // Customizar tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            Valor: <span className="font-semibold">R$ {data.value.toLocaleString('pt-BR')}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentual: <span className="font-semibold">{data.percentual}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

    // Customizar legenda
  const CustomLegend = ({ payload }: LegendProps) => {
    return (
      <div className="w-full">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Detalhamento dos Custos</h4>

        {/* Grid de itens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {payload?.map((entry, index: number) => {
            const data = chartData[index];
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {entry.value}
                  </span>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-sm font-bold text-gray-800">
                    {data.percentual}%
                  </div>
                  <div className="text-xs text-gray-500">
                    R$ {data.value.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium opacity-90">Total Geral</div>
            <div className="text-xl font-bold">
              R$ {total.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    );
  };

    return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
      {titulo && (
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {titulo}
        </h3>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
        {/* Gráfico */}
        <div className="relative flex-shrink-0 w-full max-w-[280px] h-[280px] mx-auto lg:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda Customizada */}
        <div className="flex-1 w-full lg:w-auto">
          <CustomLegend payload={chartData.map((item, index) => ({
            value: item.name,
            color: item.color,
            payload: item
          }))} />
        </div>
      </div>
    </div>
  );
}