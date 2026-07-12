# Auge Motos

Sistema de gestão para concessionária de motos — controle de inventário, clientes, vendas e projeções financeiras.

**Desenvolvido por Balica's System.**  
Uso permitido apenas mediante licença válida.  
Consulte o arquivo [LICENSE](./LICENSE) para mais informações.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (Turbopack) |
| UI | React 19 + shadcn/ui + Radix |
| Estilo | Tailwind CSS 4 + tw-animate-css |
| Formulários | React Hook Form + Zod |
| Banco | PostgreSQL + Prisma 7 |
| Autenticação | Better Auth |
| Gráficos | Recharts |
| Animação | Framer Motion |
| Estado | Zustand + Immer |
| Tabelas | TanStack Table |
| Ícones | Lucide React |

## Pré-requisitos

- [Bun](https://bun.sh) 1.2+
- PostgreSQL 15+
- Node.js 20+

## Configuração

```bash
# 1. Clone e instale dependências
git clone <repo-url>
cd moto-status-single
bun install

# 2. Copie e configure variáveis de ambiente
cp .env.example .env
```

Edite `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/moto_status?sslmode=require"
BETTER_AUTH_SECRET="<generate-a-secret>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

```bash
# 3. Sincronize o schema com o banco
bunx prisma db push

# 4. Popule dados iniciais (opcional)
bun run db:seed

# 5. Inicie o servidor de desenvolvimento
bun run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---|---|
| `bun run dev` | Servidor de desenvolvimento |
| `bun run build` | Build de produção |
| `bun run start` | Inicia build de produção |
| `bun run lint` | Verifica lint (Biome) |
| `bun run format` | Formata código |
| `bun run db:seed` | Popula banco com dados de exemplo |
| `bunx prisma studio` | Abre interface do banco |

## Estrutura

```
src/
├── app/
│   ├── (auth)/                 # Login e registro
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/            # Área autenticada
│   │   ├── _components/        # DashboardLayout (sidebar + header)
│   │   ├── dashboard/          # Abas do dashboard
│   │   │   ├── _components/    # StatsCard, gráficos, skeletons
│   │   │   ├── _services/      # Queries e hooks
│   │   │   ├── _types/         # Schemas e tipos
│   │   │   ├── sales/          # Vendas
│   │   │   ├── stock/          # Estoque
│   │   │   ├── clients/        # Clientes
│   │   │   └── projections/    # Projeções financeiras
│   │   ├── management/
│   │   │   ├── inventory/      # CRUD de motos
│   │   │   └── clients/        # CRUD de clientes
│   │   ├── settings/users/     # Gerenciamento de usuários
│   │   └── account/profile/    # Perfil do usuário
│   │
│   └── (legal)/                # Termos e Privacidade (público)
│       ├── terms/
│       └── privacy/
│
├── components/
│   ├── ui/                     # shadcn/ui (button, card, dialog, etc.)
│   ├── cookie-consent.tsx      # Banner LGPD
│   └── footer.tsx              # Rodapé com copyright
│
├── lib/
│   ├── auth.ts                 # Configuração Better Auth
│   ├── db.ts                   # Cliente Prisma
│   ├── createStore.ts          # Utilitário Zustand + persist
│   └── stores/
│       └── cookie-store.ts     # Estado de consentimento de cookies
│
└── generated/prisma/           # Tipos gerados automaticamente
```

## Funcionalidades

### Dashboard (5 abas)

| Aba | Descrição |
|---|---|
| **Visão Geral** | Cards de resumo, alertas (atrasadas, emplacamento, motos paradas), status de chegada/emplacamento, vendas recentes, timeline de atividades |
| **Vendas** | Gráficos de vendas por vendedor e por cidade |
| **Estoque** | Previsão de chegadas, modelos mais vendidos, motos paradas |
| **Clientes** | Aquisição ao longo do tempo, clientes recentes, média de motos por cliente, clientes sem faturamento |
| **Projeções** | Valor em estoque vs vendido, preço médio, distribuição por ano |

### Gestão de Inventário

- Cadastro completo de motocicletas (modelo, chassi, ano, preço)
- Status de previsão de chegada (no prazo, atrasado, sem informação)
- Status de emplacamento (sem placa, emplacando, emplacado)
- Tabela com busca, filtros por status, paginação
- Preview e formulário em dialog

### Gestão de Clientes

- Cadastro com nome, email, telefone, cidade, vendedor
- Busca textual com filtros
- Preview e formulário em dialog

### Autenticação

- Login e registro com email/senha
- Roles: `admin` e `user`
- Sessão gerenciada por Better Auth
- Proteção de rotas via layout server-side

### Conformidade

- **Termos de Uso** (`/terms`) — condições de licenciamento, propriedade intelectual, responsabilidades
- **Política de Privacidade** (`/privacy`) — LGPD, dados coletados, finalidade, direitos do titular
- **Banner de Cookies** — consentimento com opções Necessários, Analytics e Marketing

## Licença

Este software é propriedade exclusiva da **Balica's System**.  
Todos os direitos reservados.  
O uso é permitido apenas mediante licença válida.

Veja [LICENSE](./LICENSE) para termos completos.
