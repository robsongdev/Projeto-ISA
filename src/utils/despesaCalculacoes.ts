import { Despesa, GraficoPizzaData } from '@/types';

export const calcularTotalDespesas = (despesa: Despesa): number => {
  const questionarioTotal = despesa.quantidadeQuestionario * despesa.valorQuestionario;
  const diariaCarroTotal = despesa.quantidadeDiariaCarro * despesa.valorDiariaCarro;
  const diariaAlimentacaoTotal = despesa.quantidadeDiariaAlimentacao * despesa.valorDiariaAlimentacao;

  return (
    questionarioTotal +
    diariaCarroTotal +
    diariaAlimentacaoTotal +
    despesa.hospedagem +
    despesa.gasolina +
    despesa.custoSistema +
    despesa.motoTaxi +
    despesa.custoEstatistico +
    despesa.outrosCustos
  );
};

export const calcularLucro = (despesa: Despesa): number => {
  const totalDespesas = calcularTotalDespesas(despesa);
  return despesa.valorFechado - totalDespesas;
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

export const gerarDadosGraficoPizza = (despesa: Despesa): GraficoPizzaData[] => {
  const dados: GraficoPizzaData[] = [];

  // Questionário
  const questionarioTotal = despesa.quantidadeQuestionario * despesa.valorQuestionario;
  if (questionarioTotal > 0) {
    dados.push({
      label: 'Questionário',
      valor: questionarioTotal,
      cor: '#FF0000',
    });
  }

  // Diária Carro
  const diariaCarroTotal = despesa.quantidadeDiariaCarro * despesa.valorDiariaCarro;
  if (diariaCarroTotal > 0) {
    dados.push({
      label: 'Diária Carro',
      valor: diariaCarroTotal,
      cor: '#FF6384',
    });
  }

  // Diária Alimentação
  const diariaAlimentacaoTotal = despesa.quantidadeDiariaAlimentacao * despesa.valorDiariaAlimentacao;
  if (diariaAlimentacaoTotal > 0) {
    dados.push({
      label: 'Diária Alimentação',
      valor: diariaAlimentacaoTotal,
      cor: '#36A2EB',
    });
  }

  // Hospedagem
  if (despesa.hospedagem > 0) {
    dados.push({
      label: 'Hospedagem',
      valor: despesa.hospedagem,
      cor: '#FFCE56',
    });
  }

  // Gasolina
  if (despesa.gasolina > 0) {
    dados.push({
      label: 'Gasolina',
      valor: despesa.gasolina,
      cor: '#4BC0C0',
    });
  }

  // Sistema
  if (despesa.custoSistema > 0) {
    dados.push({
      label: 'Sistema',
      valor: despesa.custoSistema,
      cor: '#9966FF',
    });
  }

  // Moto Táxi
  if (despesa.motoTaxi > 0) {
    dados.push({
      label: 'Moto Táxi',
      valor: despesa.motoTaxi,
      cor: '#FF9900',
    });
  }

  // Estatístico
  if (despesa.custoEstatistico > 0) {
    dados.push({
      label: 'Estatístico',
      valor: despesa.custoEstatistico,
      cor: '#C9CBCE',
    });
  }

  // Outros Custos
  if (despesa.outrosCustos > 0) {
    dados.push({
      label: 'Outros Custos',
      valor: despesa.outrosCustos,
      cor: '#8B4513',
    });
  }

  return dados;
};

export const filtrarDespesas = (
  despesas: Despesa[],
  filtros: { estado: string; cidade: string; instituto: string }
): Despesa[] => {
  return despesas.filter((despesa) => {
    const estadoMatch = filtros.estado === 'all' || despesa.estado === filtros.estado;
    const cidadeMatch = filtros.cidade === 'all' || despesa.cidade === filtros.cidade;
    const institutoMatch = filtros.instituto === 'all' || despesa.institutoPesquisa === filtros.instituto;

    return estadoMatch && cidadeMatch && institutoMatch;
  });
};