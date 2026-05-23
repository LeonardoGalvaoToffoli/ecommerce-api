<div align="center">

# PI-ecommerce

**Plataforma full-stack de comércio eletrônico com mensageria assíncrona, segurança stateless e pipeline de entrega contínua.**

[![CI](https://github.com/LeonardoGalvaoToffoli/ecommerce-api/actions/workflows/ci.yml/badge.svg)](https://github.com/LeonardoGalvaoToffoli/ecommerce-api/actions/workflows/ci.yml)
[![Deploy](https://github.com/LeonardoGalvaoToffoli/ecommerce-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/LeonardoGalvaoToffoli/ecommerce-api/actions/workflows/deploy.yml)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

**Em produção** → [store.paglamp.com.br](https://store.paglamp.com.br)

</div>

---

## Sobre o projeto

O **PI-ecommerce** é uma plataforma de comércio eletrônico que implementa o fluxo completo de uma loja virtual de vestuário (camisaria) — do cadastro do cliente ao pós-pagamento — com o objetivo de aplicar de forma prática conceitos modernos de engenharia de software.

O sistema vai além de um CRUD: implementa **reserva atômica de estoque**, **checkout transacional**, **pagamento via PIX simulado** e um **fluxo pós-pagamento assíncrono** em que três sistemas (estoque, nota fiscal e logística) reagem em paralelo ao evento de "pedido pago".

### Por que esse projeto importa

- **Arquitetura limpa em camadas** com dependências sempre apontando para o domínio
- **Mensageria desacoplada** via RabbitMQ topic exchange — novos consumidores entram sem alterar o producer
- **Segurança stateless** com JWT + BCrypt e autorização por papéis
- **Front-end moderno por features** com separação clara entre estado servidor e estado cliente
- **Pipeline de CI/CD completo** — push em `main` testa, builda imagens Docker, publica no GHCR e faz deploy automatizado na VPS

---

## Stack tecnológica

<table>
<tr>
<td align="center" width="33%">

**Back-end**

Java 21
Spring Boot 4
Spring Security
Spring Data JPA
Spring AMQP
PostgreSQL 16
RabbitMQ 3
JWT (auth0)
BCrypt
Maven

</td>
<td align="center" width="33%">

**Front-end**

React 18
TypeScript 5
Vite 5
TailwindCSS 3
Zustand 5
TanStack Query 5
React Router 6
Axios
Radix UI
React Hook Form + Zod

</td>
<td align="center" width="33%">

**DevOps**

Docker multi-stage
GitHub Actions
GHCR (registry)
Traefik
Let's Encrypt
Nginx (frontend)
VPS Linux
docker-compose

</td>
</tr>
</table>

---

## Arquitetura

### Back-end · quatro camadas

```
src/main/java/br/com/ecommerce_api/
├── domain/              # Entidades JPA + factories (modelo puro)
│   ├── entities/        # Usuario, Produto, Variacao, Pedido, ItemPedido, Pagamento, Endereco
│   └── factories/       # ProdutoFactory
├── application/         # Casos de uso e orquestração
│   ├── services/        # UsuarioService, ProdutoService, PedidoService, EnderecoService
│   └── dtos/            # Request/Response DTOs e eventos
├── infrastructure/      # Adaptadores para o mundo externo
│   ├── repositories/    # Spring Data JPA
│   ├── security/        # SecurityConfig, SecurityFilter, TokenService
│   └── messaging/       # RabbitMQConfig, PedidoEventProducer, PedidoListeners
└── presentation/        # Camada HTTP
    ├── controllers/     # AuthController, ProdutoController, PedidoController, etc.
    └── handlers/        # GlobalExceptionHandler
```

### Front-end · arquitetura por features

```
frontend/src/
├── app/                 # Composição global
│   ├── router.tsx       # Todas as rotas com lazy loading
│   ├── providers/       # QueryClient, Toast
│   └── layouts/         # StoreLayout, AdminLayout
├── features/            # Cada domínio autocontido
│   ├── auth/            # Login, registro, JWT, authStore
│   ├── catalog/         # Home, produtos, detalhe
│   ├── cart/            # cartStore persistido, drawer
│   ├── checkout/        # Checkout PIX, sucesso
│   ├── account/         # Perfil, endereços, histórico
│   └── admin/           # Dashboard, gestão
├── shared/              # Primitivas reutilizáveis
│   ├── ui/              # Button, Input, Field, Modal, Drawer, Toast, DataTable…
│   ├── api/             # Axios com interceptors
│   └── lib/             # formatters, cn
└── styles/              # tokens.css (dark first), globals.css
```

### Mensageria · padrão pub/sub

```
Webhook PIX (POST /api/webhooks/pix)
        │
        ▼
PedidoEventProducer  ───────► Topic Exchange (pedido.events.topic)
                                       │
                       ┌───────────────┼───────────────┐
                       ▼               ▼               ▼
              pedido.estoque    pedido.notafiscal   pedido.entrega
              [ESTOQUE]         [NOTA FISCAL]        [LOGÍSTICA]
              separação         geração NF-e         solicita coleta
```

Os três consumidores processam o mesmo evento **em paralelo e de forma independente** — falha em um não afeta os outros, e novos consumidores entram sem alterar o producer.

---

## Endpoints da API

| Método | Endpoint | Acesso | Descrição |
|--------|----------|--------|-----------|
| `POST` | `/api/auth/login` | Público | Login e geração de JWT |
| `POST` | `/api/usuarios` | Público | Cadastro de cliente |
| `POST` | `/api/usuarios/admin` | ADMIN | Cadastro de administrador |
| `GET`  | `/api/usuarios/perfil` | Autenticado | Dados do usuário logado |
| `PUT`  | `/api/usuarios/perfil` | Autenticado | Atualiza nome e telefone |
| `GET`  | `/api/produtos` | Público | Vitrine paginada |
| `GET`  | `/api/produtos/destaques` | Público | Produtos em destaque |
| `GET`  | `/api/produtos/{id}` | Público | Detalhe + variações |
| `POST` | `/api/produtos` | ADMIN | Cria produto |
| `PUT`  | `/api/produtos/{id}` | ADMIN | Atualiza produto |
| `GET`  | `/api/enderecos` | Autenticado | Endereços do usuário |
| `POST` | `/api/enderecos` | Autenticado | Adiciona endereço |
| `PUT`  | `/api/enderecos/{id}` | Autenticado | Atualiza endereço |
| `POST` | `/api/pedidos/checkout` | Autenticado | Realiza checkout e gera PIX |
| `GET`  | `/api/pedidos/meus-pedidos` | Autenticado | Histórico do usuário |
| `GET`  | `/api/pedidos/{id}` | Autenticado | Detalhe do pedido |
| `POST` | `/api/webhooks/pix` | Público | Webhook do PSP |

---

## Como rodar localmente

### Pré-requisitos

- **Java 21**
- **Node.js 20+**
- **Docker** + **docker compose**
- **Maven** (ou use o wrapper `./mvnw` incluso)

### 1. Subir Postgres e RabbitMQ

```bash
# Cria um .env na raiz com:
# DB_USER=ecommerce
# DB_PASS=ecommerce
# DB_NAME=ecommerce

docker compose up -d
```

Isso sobe:
- **PostgreSQL** em `localhost:5432`
- **RabbitMQ** em `localhost:5672` (management UI em `localhost:15672` · guest/guest)

### 2. Rodar o back-end

```bash
# Na raiz do projeto
./mvnw spring-boot:run
```

A API sobe em **http://localhost:8080**.

Variáveis de ambiente opcionais:

```bash
DB_NAME=ecommerce         # default: ecommerce
DB_USER=ecommerce         # default: ecommerce
DB_PASS=ecommerce         # default: ecommerce
JWT_SECRET=meu-segredo    # default: padrao
```

### 3. Rodar o front-end

```bash
cd frontend
npm install
npm run dev
```

O front sobe em **http://localhost:5173** e faz proxy de `/api/*` para `localhost:8080` automaticamente.

---

## Testes

### Back-end (JUnit 5 + Mockito + AssertJ)

```bash
./mvnw test
```

Cobre os principais services e factories:
- `UsuarioServiceTest` — papéis corretos no cadastro, atualização de perfil
- `ProdutoServiceTest` — criação com defaults, atualização preservando variações, erros 404
- `TokenServiceTest` — geração e validação de JWT
- `ProdutoFactoryTest` — criação consistente de produtos

### Front-end (Vitest + Testing Library)

```bash
cd frontend
npm run test          # modo watch
npm run test -- --run # single-shot
npm run test:a11y     # apenas testes do design system
```

Cobre:
- `cartStore.test.ts` — adição, remoção, soma de quantidades, persistência
- `authStore.test.ts` — parser de JWT, predicado isAdminUser
- `formatters.test.ts` — moeda, status, iniciais
- `FeaturedCarousel.test.tsx` — renderização e controles

### Lint e tipos

```bash
cd frontend
npm run lint   # ESLint com plugin jsx-a11y
npm run build  # tsc --noEmit + vite build
```

---

## Pipeline CI/CD

O projeto tem **dois workflows do GitHub Actions** rodando em paralelo:

### `ci.yml` · em todo push e PR

| Job | Etapas |
|-----|--------|
| **Backend** | setup JDK 21 · `./mvnw test` · `./mvnw package` · upload do JAR |
| **Frontend** | setup Node 20 · `npm ci` · `npm run test` · `npm run build` · upload do dist |

### `deploy.yml` · apenas em push em `main`

1. **Build & push para GHCR** — Docker Buildx com cache, builda backend e frontend, gera tags `latest` e `<sha-curto>`
2. **Deploy via SSH na VPS** — conecta na VPS, exporta as novas tags, roda `docker compose pull && up -d --remove-orphans`

#### Rollback rápido

Cada commit gera uma tag versionada no GHCR. Para reverter:

```bash
cd /opt/camisaria
export BACKEND_IMAGE=ghcr.io/leonardogalvaotoffoli/ecommerce-api-backend:<sha-anterior>
export FRONTEND_IMAGE=ghcr.io/leonardogalvaotoffoli/ecommerce-api-frontend:<sha-anterior>
docker compose -f docker-compose.prod.yml up -d
```

Documentação completa de deploy em [`DEPLOY.md`](./DEPLOY.md).

---

## Segurança

- **JWT stateless** com expiração de 2 horas, assinado com HMAC-256
- **BCrypt** para hashing de senhas (salt aleatório por hash)
- **CSRF desabilitado** (API stateless, sem sessões)
- **Matriz de autorização declarativa** em `SecurityConfig`:
  - Login, cadastro público e webhook PIX → abertos
  - GET de produtos → público
  - POST/PUT de produtos → `ROLE_ADMIN`
  - Demais rotas → autenticadas
- **Guards de propriedade** — usuário só vê os próprios pedidos e endereços
- **HTTPS automático** em produção via Traefik + Let's Encrypt

---

## Design system

Front-end alimentado por **tokens semânticos** em CSS, mapeados como utilitários do Tailwind:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg-base` | `#0a0a0a` | Fundo principal |
| `--color-bg-elevated` | `#141414` | Cards e superfícies |
| `--color-fg-primary` | `#fafafa` | Texto principal |
| `--color-accent` | `#e5ff3d` | CTA e destaques |
| `--color-success` | `#22c55e` | Sucesso / pago |
| `--color-warning` | `#f59e0b` | Atenção / pendente |
| `--color-danger` | `#ef4444` | Erro / cancelado |
| `--font-sans` | `Inter` | Corpo de texto |
| `--font-display` | `Space Grotesk` | Títulos |

Biblioteca de componentes em `frontend/src/shared/ui/`: Button, IconButton, Input, Field, Select, Modal, Drawer, Toast, Skeleton, Badge, Tabs, Pagination, EmptyState, DataTable — todos acessíveis sobre **Radix UI** com foco gerenciado, ARIA correto e suporte a `prefers-reduced-motion`.

---

## Estrutura do repositório

```
ecommerce-api/
├── .github/workflows/        # CI e Deploy
├── frontend/                 # SPA React + TypeScript
│   ├── src/                  # Código-fonte (features, shared, app, styles)
│   ├── Dockerfile            # Multi-stage Node 20 + Nginx
│   ├── nginx.conf            # Proxy /api → backend
│   └── package.json
├── src/
│   ├── main/java/            # Código Java
│   ├── main/resources/       # application.properties
│   └── test/java/            # Testes JUnit
├── Dockerfile                # Multi-stage Temurin 21
├── docker-compose.yml        # Dev local (Postgres + RabbitMQ)
├── docker-compose.prod.yml   # Produção (com Traefik)
├── DEPLOY.md                 # Guia de deploy completo
├── pom.xml                   # Dependências Maven
└── README.md
```

---

## Roadmap

Funcionalidades planejadas para evoluções futuras:

- [ ] Integração real com PSP de PIX (Mercado Pago, Asaas) com validação HMAC do webhook
- [ ] Dead-letter queues no RabbitMQ com retry exponencial
- [ ] Endpoints administrativos completos (gestão de pedidos e usuários)
- [ ] Observabilidade — Prometheus + Grafana, logs centralizados via Loki, OpenTelemetry
- [ ] Cálculo dinâmico de frete (Correios / transportadoras)
- [ ] Sistema de cupons promocionais
- [ ] Recuperação de senha por e-mail
- [ ] Testes de integração com Testcontainers (Postgres + RabbitMQ efêmeros)

---

## Equipe

Projeto Integrador desenvolvido por:

- **Leonardo Galvão Toffoli** — [@LeonardoGalvaoToffoli](https://github.com/LeonardoGalvaoToffoli)
- **João Paulo Alves Farias**
- **Maria Clara Menezes**

---

## Licença

Este projeto é parte de um trabalho acadêmico de Projeto Integrador. O código está disponível para fins educacionais e de portfólio.

---

<div align="center">

**[store.paglamp.com.br](https://store.paglamp.com.br)** · **[Reportar um issue](https://github.com/LeonardoGalvaoToffoli/ecommerce-api/issues)**

</div>
