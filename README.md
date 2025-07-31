# 🎯 Sistema de Controle de Despesas de Pesquisa Eleitoral

Um sistema moderno e intuitivo para gerenciar despesas de pesquisas eleitorais, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 📝 **Gestão de Despesas**
- Formulário completo para cadastro de despesas
- Edição e exclusão de registros existentes
- Validação de dados em tempo real
- Cálculo automático de totais e lucros

### 🔍 **Filtros Avançados**
- Filtro por estado e cidade
- Filtro por instituto de pesquisa
- Filtro por status de registro
- Busca dinâmica e responsiva
- Visualização em tempo real

### 📊 **Visualização de Dados**
- Gráfico de pizza interativo
- Análise de distribuição de custos
- Legenda detalhada com percentuais
- Exportação visual dos dados

### 🎨 **Interface Moderna**
- Design responsivo para todos os dispositivos
- Animações suaves e interativas
- Gradientes e sombras elegantes
- Ícones SVG integrados

## 🛠️ Tecnologias Utilizadas

- **Next.js 15.4.4** - Framework React para produção
- **React 19.1.0** - Biblioteca de interface do usuário
- **TypeScript 5** - Type safety e melhor desenvolvimento
- **Tailwind CSS 4** - Framework CSS utilitário
- **React Hooks** - Gerenciamento de estado
- **Recharts 3.1.0** - Biblioteca de gráficos
- **React Icons 5.5.0** - Ícones SVG
- **ESLint 9** - Linting de código
- **Prettier** - Formatação de código

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Yarn ou npm

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/isa.git
cd isa
```

2. **Instale as dependências**
```bash
yarn install
# ou
npm install
```

3. **Execute o projeto**
```bash
yarn dev
# ou
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
isa/
├── src/
│   ├── app/                 # Páginas Next.js (App Router)
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Página inicial
│   │   ├── globals.css      # Estilos globais
│   │   └── favicon.ico      # Ícone do site
│   ├── components/          # Componentes React
│   │   ├── FormularioDespesa.tsx
│   │   ├── ListaDespesas.tsx
│   │   ├── GraficoPizza.tsx
│   │   └── Carregando.tsx
│   ├── hooks/              # Custom Hooks
│   │   └── useDespesas.ts
│   ├── services/           # Serviços e APIs
│   │   └── api.ts
│   ├── types/              # Definições TypeScript
│   │   └── index.ts
│   └── utils/              # Utilitários
│       └── despesaCalculacoes.ts
├── public/                 # Arquivos estáticos
├── package.json            # Dependências do projeto
├── tsconfig.json           # Configuração TypeScript
├── tailwind.config.js      # Configuração Tailwind CSS
├── next.config.ts          # Configuração Next.js
└── .gitignore              # Arquivos ignorados pelo Git
```

## 🎯 Principais Componentes

### FormularioDespesa
Formulário completo para cadastro e edição de despesas com validação e cálculos automáticos.

### ListaDespesas
Tabela responsiva com filtros avançados e ações de edição/exclusão.

### GraficoPizza
Visualização gráfica interativa dos dados de despesas.

### Carregando
Componente de loading com animações suaves.

## 📊 Tipos de Dados

O sistema gerencia os seguintes tipos de despesas:
- **Custos de Pesquisa**: Questionários, diárias, hospedagem
- **Transporte**: Gasolina, moto-táxi, diárias de carro
- **Alimentação**: Diárias de alimentação
- **Sistema**: Custos de software e estatística
- **Outros**: Custos diversos e eventuais

## 🎨 Design System

### Cores
- **Primária**: Azul (#3B82F6)
- **Secundária**: Roxo (#8B5CF6)
- **Sucesso**: Verde (#10B981)
- **Erro**: Vermelho (#EF4444)
- **Neutro**: Cinza (#6B7280)

### Componentes
- Cards com sombra forte (`shadow-2xl`)
- Bordas arredondadas (`rounded-2xl`)
- Gradientes azul-roxo
- Animações suaves (`transition-all`)

## 🔧 Scripts Disponíveis

```bash
yarn dev          # Executa em modo desenvolvimento
yarn build        # Gera build de produção
yarn start        # Executa build de produção
yarn lint         # Executa linting
yarn format       # Formata código com Prettier
```

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- 📱 **Mobile**: 320px - 768px
- 📱 **Tablet**: 768px - 1024px
- 💻 **Desktop**: 1024px+

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para otimizar o controle de despesas de pesquisas eleitorais.

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no repositório!**
