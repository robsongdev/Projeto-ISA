# Guia de Migração para Supabase

## 🚀 Etapa 3 Concluída: Migração dos Hooks e Serviços

### 📁 Novos Arquivos Criados

#### Serviços (Padrão Controller)
- `src/services/despesas/index.ts` - Classe estática DespesasService com métodos CRUD
- `src/services/despesas/types.d.ts` - Tipos TypeScript para o serviço
- `src/services/despesas/enums.ts` - Enums para valores específicos
- `src/lib/supabase.ts` - Configuração do cliente Supabase com tipos TypeScript
- `src/lib/axios.ts` - Configuração do Axios para Supabase com interceptors
- `src/utils/supabaseHelpers.ts` - Utilitários para conversão de dados

#### Hooks
- `src/hooks/useDespesasController.ts` - Hook principal usando o novo padrão de serviço

#### Componentes
- `src/components/ErrorBoundary.tsx` - Tratamento de erros
- `src/components/ErrorMessage.tsx` - Exibição de mensagens de erro

### 🔄 Como Migrar os Componentes

#### 1. Substituir o hook antigo pelo novo (Padrão Controller)

**Antes (localStorage):**
```tsx
import { useDespesasCompartilhadas } from '@/hooks/useDespesasCompartilhadas';

function MeuComponente() {
  const { despesas, adicionarDespesa, atualizarDespesa, excluirDespesa } = useDespesasCompartilhadas();
  // ...
}
```

**Depois (Padrão Controller + Axios + Supabase):**
```tsx
import { useDespesasController } from '@/hooks/useDespesasController';

function MeuComponente() {
  const {
    despesas,
    isLoading,
    error,
    adicionarDespesa,
    atualizarDespesa,
    excluirDespesa,
    limparErro
  } = useDespesasController(5000); // Polling a cada 5 segundos

  // Tratar erros
  if (error) {
    return <ErrorMessage error={error} onClose={limparErro} />;
  }

  // ...
}
```

#### 2. Para sincronização com polling

```tsx
import { useDespesasController } from '@/hooks/useDespesasController';

function MeuComponente() {
  const {
    despesas,
    isLoading,
    error,
    filtrarDespesas,
    iniciarPolling,
    pararPolling
  } = useDespesasController(3000); // Polling a cada 3 segundos

  // Filtrar localmente (mais rápido)
  const despesasFiltradas = filtrarDespesas({
    estado: 'PI',
    instituto: 'Piauí Vox'
  });

  // Controlar polling manualmente se necessário
  const handleTogglePolling = () => {
    // Lógica para pausar/retomar polling
  };

  // ...
}
```

#### 3. Adicionar tratamento de erros

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/ErrorMessage';

function App() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <ErrorMessage error={error} onClose={limparErro} />
        {/* Resto do conteúdo */}
      </div>
    </ErrorBoundary>
  );
}
```

### 🎯 Diferenças Principais

#### Hook Antigo (localStorage)
- ✅ Simples de usar
- ✅ Sem configuração
- ❌ Dados apenas locais
- ❌ Sem sincronização
- ❌ Perda de dados ao limpar cache

#### Hook Novo (Padrão Controller + Axios + Supabase)
- ✅ Dados persistentes na nuvem
- ✅ Sincronização via polling configurável
- ✅ Backup automático
- ✅ Compartilhamento entre dispositivos
- ✅ Tratamento de erros robusto
- ✅ Logs detalhados de requisições
- ✅ Interceptors para debugging
- ✅ Padrão de serviço consistente (classe estática)
- ✅ Tipos TypeScript bem definidos
- ✅ Enums para valores específicos
- ⚠️ Requer configuração inicial

### 🔧 Configuração Necessária

1. **Variáveis de ambiente** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

2. **Tabela no Supabase**:
Execute o script `supabase-schema.sql` no SQL Editor do Supabase.

### 📊 Funcionalidades Adicionais

#### Busca com Filtros no Servidor
```tsx
const { buscarComFiltros } = useDespesasController();

// Buscar no servidor (mais preciso)
await buscarComFiltros({
  estado: 'PI',
  cidade: 'Teresina',
  instituto: 'Piauí Vox',
  registro: 'sim'
});
```

#### Sincronização com Polling
```tsx
// Com useDespesasController, as mudanças são sincronizadas via polling
// Configurável por intervalo (padrão: 5 segundos)
const { despesas } = useDespesasController(3000); // 3 segundos
```

#### Tratamento de Erros
```tsx
const { error, limparErro } = useDespesasController();

if (error) {
  return (
    <ErrorMessage
      error={error}
      onClose={limparErro}
      className="mb-4"
    />
  );
}
```

### 🏗️ Estrutura do Novo Padrão

#### Serviço (Classe Estática)
```tsx
// src/services/despesas/index.ts
export class DespesasService {
  static async getAll(): Promise<IDespesasResponse> { /* ... */ }
  static async getById(id: string): Promise<IDespesaResponse> { /* ... */ }
  static async create(props: ICreateDespesaProps): Promise<IDespesaResponse> { /* ... */ }
  static async update(id: string, props: IUpdateDespesaProps): Promise<IDespesaResponse> { /* ... */ }
  static async delete(id: string): Promise<{ error: string | null }> { /* ... */ }
  static async getWithFilters(filters: IDespesaFilters): Promise<IDespesasResponse> { /* ... */ }
}
```

#### Tipos
```tsx
// src/services/despesas/types.d.ts
export interface IDespesasResponse {
  data: Despesa[] | null;
  error: string | null;
}

export type ICreateDespesaProps = Omit<Despesa, 'id' | 'criadoEm' | 'atualizadoEm' | 'totalDespesas' | 'lucro'>;
export type IUpdateDespesaProps = Partial<Despesa>;
```

#### Enums
```tsx
// src/services/despesas/enums.ts
export enum RegistroEnum {
  SIM = 'sim',
  NAO = 'nao'
}
```

### 🚀 Próximos Passos

1. **Configurar o Supabase** seguindo `SUPABASE_SETUP.md`
2. **Migrar os componentes** um por vez usando `useDespesasController`
3. **Testar a funcionalidade** com dados reais
4. **Implementar sincronização em tempo real** se necessário

### 📝 Exemplo de Migração Completa

```tsx
// Antes
import { useDespesasCompartilhadas } from '@/hooks/useDespesasCompartilhadas';

export default function ListaDespesas() {
  const { despesas, excluirDespesa } = useDespesasCompartilhadas();

  return (
    <div>
      {despesas.map(despesa => (
        <div key={despesa.id}>
          {despesa.cidade} - {despesa.valorFechado}
          <button onClick={() => excluirDespesa(despesa.id!)}>
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}

// Depois
import { useDespesasController } from '@/hooks/useDespesasController';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Carregando } from '@/components/Carregando';

export default function ListaDespesas() {
  const {
    despesas,
    isLoading,
    error,
    excluirDespesa,
    limparErro
  } = useDespesasController(5000); // Polling a cada 5 segundos

  if (isLoading) return <Carregando />;
  if (error) return <ErrorMessage error={error} onClose={limparErro} />;

  return (
    <div>
      {despesas.map(despesa => (
        <div key={despesa.id}>
          {despesa.cidade} - {despesa.valorFechado}
          <button onClick={() => excluirDespesa(despesa.id!)}>
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}
```