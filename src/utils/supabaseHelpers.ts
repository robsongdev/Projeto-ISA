import { Despesa } from '@/types';
import { Database } from '@/lib/supabase';

type DespesaRow = Database['public']['Tables']['despesas']['Row'];
type DespesaInsert = Database['public']['Tables']['despesas']['Insert'];
type DespesaUpdate = Database['public']['Tables']['despesas']['Update'];

// Converter de Despesa (frontend) para DespesaInsert (Supabase)
export function despesaToInsert(despesa: Despesa): DespesaInsert {
  return {
    data_inicio: despesa.dataInicio,
    data_termino: despesa.dataTermino,
    estado: despesa.estado,
    cidade: despesa.cidade,
    instituto_pesquisa: despesa.institutoPesquisa,
    esta_registrado: despesa.estaRegistrado,
    numero_registro: despesa.numeroRegistro || null,
    tem_contratante: despesa.temContratante,
    nome_contratante: despesa.nomeContratante || null,
    numero_pesquisadores: despesa.numeroPesquisadores,
    nomes_pesquisadores: despesa.nomesPesquisadores,
    valor_fechado: despesa.valorFechado,
    quantidade_questionario: despesa.quantidadeQuestionario,
    valor_questionario: despesa.valorQuestionario,
    quantidade_diaria_carro: despesa.quantidadeDiariaCarro,
    valor_diaria_carro: despesa.valorDiariaCarro,
    quantidade_diaria_alimentacao: despesa.quantidadeDiariaAlimentacao,
    valor_diaria_alimentacao: despesa.valorDiariaAlimentacao,
    hospedagem: despesa.hospedagem,
    gasolina: despesa.gasolina,
    custo_sistema: despesa.custoSistema,
    moto_taxi: despesa.motoTaxi,
    custo_estatistico: despesa.custoEstatistico,
    outros_custos: despesa.outrosCustos,
    total_despesas: despesa.totalDespesas,
    lucro: despesa.lucro,
  };
}

// Converter de DespesaRow (Supabase) para Despesa (frontend)
export function rowToDespesa(row: DespesaRow): Despesa {
  return {
    id: row.id,
    dataInicio: row.data_inicio,
    dataTermino: row.data_termino,
    estado: row.estado,
    cidade: row.cidade,
    institutoPesquisa: row.instituto_pesquisa,
    estaRegistrado: row.esta_registrado,
    numeroRegistro: row.numero_registro || undefined,
    temContratante: row.tem_contratante,
    nomeContratante: row.nome_contratante || undefined,
    numeroPesquisadores: row.numero_pesquisadores,
    nomesPesquisadores: row.nomes_pesquisadores,
    valorFechado: row.valor_fechado,
    quantidadeQuestionario: row.quantidade_questionario,
    valorQuestionario: row.valor_questionario,
    quantidadeDiariaCarro: row.quantidade_diaria_carro,
    valorDiariaCarro: row.valor_diaria_carro,
    quantidadeDiariaAlimentacao: row.quantidade_diaria_alimentacao,
    valorDiariaAlimentacao: row.valor_diaria_alimentacao,
    hospedagem: row.hospedagem,
    gasolina: row.gasolina,
    custoSistema: row.custo_sistema,
    motoTaxi: row.moto_taxi,
    custoEstatistico: row.custo_estatistico,
    outrosCustos: row.outros_custos,
    totalDespesas: row.total_despesas,
    lucro: row.lucro,
    criadoEm: row.criado_em ? new Date(row.criado_em) : undefined,
    atualizadoEm: row.atualizado_em ? new Date(row.atualizado_em) : undefined,
  };
}

// Converter de Despesa (frontend) para DespesaUpdate (Supabase)
export function despesaToUpdate(despesa: Partial<Despesa>): DespesaUpdate {
  const update: DespesaUpdate = {};

  if (despesa.dataInicio !== undefined) update.data_inicio = despesa.dataInicio;
  if (despesa.dataTermino !== undefined) update.data_termino = despesa.dataTermino;
  if (despesa.estado !== undefined) update.estado = despesa.estado;
  if (despesa.cidade !== undefined) update.cidade = despesa.cidade;
  if (despesa.institutoPesquisa !== undefined) update.instituto_pesquisa = despesa.institutoPesquisa;
  if (despesa.estaRegistrado !== undefined) update.esta_registrado = despesa.estaRegistrado;
  if (despesa.numeroRegistro !== undefined) update.numero_registro = despesa.numeroRegistro || null;
  if (despesa.temContratante !== undefined) update.tem_contratante = despesa.temContratante;
  if (despesa.nomeContratante !== undefined) update.nome_contratante = despesa.nomeContratante || null;
  if (despesa.numeroPesquisadores !== undefined) update.numero_pesquisadores = despesa.numeroPesquisadores;
  if (despesa.nomesPesquisadores !== undefined) update.nomes_pesquisadores = despesa.nomesPesquisadores;
  if (despesa.valorFechado !== undefined) update.valor_fechado = despesa.valorFechado;
  if (despesa.quantidadeQuestionario !== undefined) update.quantidade_questionario = despesa.quantidadeQuestionario;
  if (despesa.valorQuestionario !== undefined) update.valor_questionario = despesa.valorQuestionario;
  if (despesa.quantidadeDiariaCarro !== undefined) update.quantidade_diaria_carro = despesa.quantidadeDiariaCarro;
  if (despesa.valorDiariaCarro !== undefined) update.valor_diaria_carro = despesa.valorDiariaCarro;
  if (despesa.quantidadeDiariaAlimentacao !== undefined) update.quantidade_diaria_alimentacao = despesa.quantidadeDiariaAlimentacao;
  if (despesa.valorDiariaAlimentacao !== undefined) update.valor_diaria_alimentacao = despesa.valorDiariaAlimentacao;
  if (despesa.hospedagem !== undefined) update.hospedagem = despesa.hospedagem;
  if (despesa.gasolina !== undefined) update.gasolina = despesa.gasolina;
  if (despesa.custoSistema !== undefined) update.custo_sistema = despesa.custoSistema;
  if (despesa.motoTaxi !== undefined) update.moto_taxi = despesa.motoTaxi;
  if (despesa.custoEstatistico !== undefined) update.custo_estatistico = despesa.custoEstatistico;
  if (despesa.outrosCustos !== undefined) update.outros_custos = despesa.outrosCustos;
  if (despesa.totalDespesas !== undefined) update.total_despesas = despesa.totalDespesas;
  if (despesa.lucro !== undefined) update.lucro = despesa.lucro;

  return update;
}