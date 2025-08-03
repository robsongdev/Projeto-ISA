-- Script para criar a tabela de despesas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela despesas
CREATE TABLE IF NOT EXISTS despesas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_inicio DATE NOT NULL,
  data_termino DATE NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  instituto_pesquisa VARCHAR(100) NOT NULL,
  esta_registrado VARCHAR(3) CHECK (esta_registrado IN ('sim', 'nao')),
  numero_registro VARCHAR(50),
  tem_contratante VARCHAR(3) CHECK (tem_contratante IN ('sim', 'nao')),
  nome_contratante VARCHAR(200),
  numero_pesquisadores INTEGER NOT NULL,
  nomes_pesquisadores TEXT[] NOT NULL,
  valor_fechado DECIMAL(10,2) NOT NULL,
  quantidade_questionario INTEGER NOT NULL,
  valor_questionario DECIMAL(10,2) NOT NULL,
  quantidade_diaria_carro INTEGER NOT NULL,
  valor_diaria_carro DECIMAL(10,2) NOT NULL,
  quantidade_diaria_alimentacao INTEGER NOT NULL,
  valor_diaria_alimentacao DECIMAL(10,2) NOT NULL,
  hospedagem DECIMAL(10,2) NOT NULL,
  gasolina DECIMAL(10,2) NOT NULL,
  custo_sistema DECIMAL(10,2) NOT NULL,
  moto_taxi DECIMAL(10,2) NOT NULL,
  custo_estatistico DECIMAL(10,2) NOT NULL,
  outros_custos DECIMAL(10,2) NOT NULL,
  total_despesas DECIMAL(10,2) NOT NULL,
  lucro DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações (para desenvolvimento)
-- ATENÇÃO: Em produção, configure políticas mais específicas
CREATE POLICY "Permitir todas as operações" ON despesas
  FOR ALL USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_despesas_estado ON despesas(estado);
CREATE INDEX IF NOT EXISTS idx_despesas_cidade ON despesas(cidade);
CREATE INDEX IF NOT EXISTS idx_despesas_instituto ON despesas(instituto_pesquisa);
CREATE INDEX IF NOT EXISTS idx_despesas_data_inicio ON despesas(data_inicio);
CREATE INDEX IF NOT EXISTS idx_despesas_criado_em ON despesas(criado_em);

-- Função para atualizar automaticamente o campo atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente o campo atualizado_em
CREATE TRIGGER trigger_update_atualizado_em
  BEFORE UPDATE ON despesas
  FOR EACH ROW
  EXECUTE FUNCTION update_atualizado_em();