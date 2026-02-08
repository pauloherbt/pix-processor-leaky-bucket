# Leaky Bucket Challenge

Implementação de uma estratégia de **Leaky Bucket** para rate limiting, inspirada nas especificações do BACEN para o DICT (Diretório de Identificadores de Contas Transacionais) do Pix.

## 🎯 Objetivo

Simular o comportamento de rate limiting usado em sistemas financeiros reais, onde cada usuário possui um número limitado de tokens que são consumidos em operações falhas e reabastecidos ao longo do tempo.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        Request HTTP                          │
│                             │                                │
│                             ▼                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Koa Middlewares                    │    │
│  │                                                      │    │
│  │  1. bodyParser() → Parseia JSON                     │    │
│  │         │                                            │    │
│  │         ▼                                            │    │
│  │  2. authenticate() → Extrai userId do JWT           │    │
│  │         │            (não bloqueia se ausente)      │    │
│  │         ▼                                            │    │
│  │  3. withRateLimit() → Valida/refill tokens          │    │
│  │         │                                            │    │
│  │         ▼                                            │    │
│  │  4. GraphQL Handler → Processa operação             │    │
│  │         │                                            │    │
│  │         ▼                                            │    │
│  │  3. withRateLimit() ← Decrementa token se falha     │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                             │                                │
│                             ▼                                │
│                      Response HTTP                           │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Koa.js** - Framework HTTP
- **GraphQL** - API Layer
- **graphql-http** - GraphQL over HTTP spec compliant
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Jest** - Testes

## 📦 Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd leaky-bucket-challenge

# Instale as dependências
pnpm install

# Gere os tipos do GraphQL
pnpm generate

# Inicie o servidor em modo desenvolvimento
pnpm dev
```

## 📡 API GraphQL

### Endpoint
```
POST http://localhost:4000/graphql
```

### Mutations

#### Registro (público)
```graphql
mutation {
  register(email: "user@example.com", password: "123456", name: "John Doe")
}
```

#### Login (público)
```graphql
mutation {
  login(email: "user@example.com", password: "123456")
}
```
Retorna um JWT token.

#### Generate Pix (autenticado + rate limited)
```graphql
mutation {
  generatePix(key: "email@example.com", value: 100.50) {
    success
    message
  }
}
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

## 🪣 Estratégia Leaky Bucket

### Regras
| Parâmetro | Valor |
|-----------|-------|
| Tokens iniciais | 10 |
| Máximo de tokens | 10 |
| Refill rate | 1 token/hora |
| Consumo em sucesso | 0 tokens |
| Consumo em falha | 1 token |

## 📁 Estrutura do Projeto

```
src/
├── index.ts                    # Entry point, configuração Koa
├── graphql/
│   ├── index.ts                # Schema executável
│   ├── generated/
│   │   └── types.ts            # Tipos gerados pelo codegen
│   ├── resolvers/
│   │   ├── index.ts            # Agregador de resolvers
│   │   ├── create-user.ts      # Mutation register
│   │   ├── login.ts            # Mutation login
│   │   └── generate-pix.ts     # Mutation generatePix
│   └── typeDefs/
│       └── index.ts            # Schema GraphQL
└── middlewares/
    ├── auth.ts                 # Extração de JWT
    └── rate-limiter.ts         # Leaky Bucket
```

## 🔗 Referências

- [BACEN DICT API - Rate Limiting](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/API-DICT.html#section/Seguranca/Limitacao-de-requisicoes)
- [GraphQL over HTTP Spec](https://graphql.github.io/graphql-over-http/)
- [Leaky Bucket Algorithm](https://en.wikipedia.org/wiki/Leaky_bucket)

## 📝 Licença

ISC
