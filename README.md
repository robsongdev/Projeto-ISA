# Isa - Controle de Despesas de Pesquisa Eleitoral

Aplicação moderna para salvar dados de pesquisa eleitoral, com funcionalidades de listagem, filtro, edição, exclusão e exibição em gráfico de pizza.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **TailwindCSS** - Framework CSS utilitário
- **ESLint & Prettier** - Padronização de código
- **Axios & React Query** - Preparado para integração futura com APIs

## 📁 Estrutura do Projeto

```
isa/
├── src/
│   ├── app/                 # Rotas e páginas principais
│   │   ├── page.tsx        # Página principal da aplicação
│   │   ├── layout.tsx      # Layout base
│   │   └── globals.css     # Estilos globais
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ExpenseForm.tsx # Formulário de despesas
│   │   ├── ExpenseList.tsx # Listagem com filtros
│   │   ├── PieChart.tsx    # Gráfico de pizza
│   │   └── Loader.tsx      # Componente de carregamento
│   ├── services/           # Serviços e integrações
│   │   └── api.ts         # Estrutura para APIs futuras
│   ├── hooks/             # Hooks customizados
│   │   └── useExpenses.ts # Hook para gerenciar despesas
│   ├── utils/             # Funções utilitárias
│   │   └── expenseCalculations.ts # Cálculos de despesas
│   └── types/             # Definições de tipos TypeScript
│       └── index.ts       # Interfaces e tipos
├── public/                # Arquivos estáticos
└── package.json           # Dependências e scripts
```

## ✨ Funcionalidades Implementadas

### ✅ Etapa 1 - Estrutura Base
- [x] Projeto Next.js com TypeScript
- [x] Configuração TailwindCSS
- [x] ESLint e Prettier configurados
- [x] Estrutura de pastas escalável
- [x] Git configurado para versionamento

### ✅ Etapa 2 - Componentes Principais
- [x] **Formulário de Despesas** - Adicionar/editar despesas com validação
- [x] **Listagem com Filtros** - Visualizar, filtrar, editar e excluir despesas
- [x] **Gráfico de Pizza** - Visualização dos dados de despesas
- [x] **Loader** - Componente de carregamento
- [x] **Dados Simulados** - Estado local para demonstração

### ✅ Etapa 3 - Funcionalidades
- [x] **CRUD Completo** - Criar, ler, atualizar e excluir despesas
- [x] **Filtros Dinâmicos** - Por estado, cidade e instituto
- [x] **Cálculos Automáticos** - Total de despesas e lucro
- [x] **Validação de Formulários** - Campos obrigatórios e validações
- [x] **Interface Responsiva** - Funciona em desktop e mobile

## 🎯 Dados Gerenciados

A aplicação gerencia os seguintes dados de pesquisa:

- **Informações Básicas**: Data início/fim, estado, cidade, instituto
- **Registro**: Se a pesquisa é registrada e número do registro
- **Contratante**: Se há contratante e nome
- **Pesquisadores**: Quantidade e nomes dos pesquisadores
- **Valores**: Valor fechado, questionários, diárias, hospedagem, etc.
- **Cálculos**: Total de despesas e lucro calculados automaticamente

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd isa

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificar código com ESLint
npm run format   # Formatar código com Prettier
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📊 Estados e Cidades Suportados

- **Maranhão (MA)** - 217 cidades
- **Piauí (PI)** - 224 cidades  
- **Bahia (BA)** - 417 cidades
- **Ceará (CE)** - 184 cidades

## 🎨 Interface

A aplicação possui uma interface moderna e intuitiva:

- **Design Responsivo** - Adapta-se a diferentes tamanhos de tela
- **Navegação Simples** - Botões para alternar entre formulário e visualização
- **Filtros Intuitivos** - Dropdowns interconectados para estado/cidade
- **Gráficos Visuais** - Gráficos de pizza com legendas e cores
- **Feedback Visual** - Loaders e confirmações de ações

## 🔮 Próximas Etapas

### Etapa 2 - Integração com Backend
- [ ] Configurar Firebase ou banco de dados
- [ ] Implementar autenticação
- [ ] Migrar dados simulados para persistência real
- [ ] Adicionar React Query para cache e sincronização

### Etapa 3 - Funcionalidades Avançadas
- [ ] Exportação de dados (PDF, Excel)
- [ ] Gráficos adicionais (barras, linha)
- [ ] Relatórios e dashboards
- [ ] Notificações e alertas
- [ ] Backup e sincronização

### Etapa 4 - Deploy e Produção
- [ ] Configurar CI/CD
- [ ] Deploy no Vercel/Netlify
- [ ] Monitoramento e analytics
- [ ] Testes automatizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ para controle eficiente de despesas de pesquisa eleitoral**
