# Controle de Despesas de Pesquisa Eleitoral

Sistema para gerenciamento e visualização de despesas de pesquisa eleitoral, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### 📊 Visualização de Dados
- **Página Principal (`/`)**: Resumo geral dos dados
  - Lista de todas as despesas com filtros
  - Gráficos de pizza compactos por pesquisa
  - Filtros por estado, cidade, instituto e registro
  - Ações de editar, visualizar detalhes e excluir despesas
  - Botão de visualização detalhada para cada despesa

- **Página de Visualização Detalhada (`/despesas/[id]`)**: Análise completa de uma despesa específica
  - Gráficos maiores com mais espaço para legendas
  - Detalhamento completo de custos com valores e percentuais
  - Resumo financeiro com margem de lucro
  - Informações detalhadas da pesquisa, equipe e contratante
  - Layout otimizado para análise profunda
  - Botão para editar a despesa diretamente

### ✏️ Gerenciamento de Despesas
- **Página de Despesas (`/despesas`)**: Criação e edição
  - Formulário completo para adicionar novas despesas
  - Edição de despesas existentes via parâmetro de URL
  - Validação de dados em tempo real
  - Cálculos automáticos de totais e lucro

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página principal (resumo)
│   ├── despesas/
│   │   ├── page.tsx          # Página de criação/edição
│   │   └── [id]/
│   │       └── page.tsx      # Página de visualização detalhada
│   └── layout.tsx            # Layout principal com navegação
├── components/
│   ├── Navegacao.tsx         # Componente de navegação
│   ├── FormularioDespesa.tsx # Formulário de despesas
│   ├── ListaDespesas.tsx     # Lista com filtros
│   ├── GraficoPizza.tsx      # Gráficos de pizza
│   └── Carregando.tsx        # Componente de loading
├── hooks/
│   ├── useDespesas.ts        # Hook original
│   └── useDespesasCompartilhadas.ts # Hook para estado compartilhado
├── services/
│   └── api.ts               # Serviços de API
├── types/
│   └── index.ts             # Definições de tipos
└── utils/
    └── despesaCalculacoes.ts # Utilitários de cálculo
```

## 🔄 Fluxo de Navegação

### Resumo → Edição
1. Na página principal, clique em "Editar" em qualquer despesa
2. Será redirecionado para `/despesas?edit={id}`
3. O formulário será preenchido com os dados da despesa
4. Após salvar, retorna automaticamente para o resumo

### Resumo → Visualização Detalhada
1. Na página principal, clique no botão "Visualizar Detalhes" (ícone de olho) em qualquer despesa
2. Será redirecionado para `/despesas/{id}`
3. Visualize gráficos maiores com legendas detalhadas
4. Acesse informações completas da despesa específica

### Adicionar Nova Despesa
1. Na página principal, clique em "Adicionar Despesa"
2. Será redirecionado para `/despesas`
3. Preencha o formulário e salve
4. Retorna automaticamente para o resumo

## 🎨 Interface

### Navegação
- Barra de navegação fixa no topo
- Indicadores visuais da página ativa
- Navegação intuitiva entre visualização e gerenciamento

### Indicadores de Modo
- **🟢 Verde**: Modo de resumo
- **🟣 Roxo**: Modo de visualização detalhada (página específica)
- **🔵 Azul**: Modo de nova despesa
- **🟠 Laranja**: Modo de edição

## 💾 Persistência de Dados

- Dados salvos no localStorage do navegador
- Estado compartilhado entre páginas via hook personalizado
- Sincronização automática entre visualização e edição

## 🛠️ Tecnologias

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **React Hooks**: Gerenciamento de estado
- **Chart.js**: Gráficos interativos

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🔧 Desenvolvimento

### Estrutura de Rotas
- `/`: Página principal com resumo
- `/despesas`: Página de criação/edição
- `/despesas?edit={id}`: Edição de despesa específica
- `/despesas/{id}`: Visualização detalhada de despesa específica

### Hooks Personalizados
- `useDespesasCompartilhadas`: Gerencia estado global das despesas
- Persistência automática no localStorage
- Sincronização entre páginas

### Componentes Reutilizáveis
- `Navegacao`: Navegação entre páginas
- `FormularioDespesa`: Formulário completo
- `ListaDespesas`: Lista com filtros
- `GraficoPizza`: Gráficos interativos
