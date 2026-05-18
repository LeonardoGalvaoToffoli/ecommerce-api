# Frontend - CreatorCommerce

Frontend React + TypeScript + Vite para o backend `ecommerce-api`.

## Setup

```bash
npm install
npm run dev
```

Por padrao, o Vite roda em `http://localhost:5173` e faz proxy de `/api` para `http://localhost:8080`.

Se quiser apontar para outra API, crie `.env.local`:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Scripts

```bash
npm run dev      # ambiente local
npm run build    # typecheck + build de producao
npm run preview  # preview do build
npm run test     # Vitest
npm run lint     # ESLint
```

## Escopo implementado

- Design system base com tokens dark-first, Button, IconButton, Input, Field, Select, Modal, Drawer, Toast, Skeleton, Badge, Tabs, Pagination, EmptyState e DataTable.
- Loja publica com home, catalogo paginado, detalhe de produto, carrinho persistente e checkout PIX.
- Auth com login/cadastro usando os endpoints atuais do backend e JWT em `sessionStorage`.
- Minha Conta com perfil e historico de pedidos.
- Admin com dashboard, listagem/criacao de produto e scaffolds explicitos para pedidos/usuarios enquanto os endpoints admin nao existem no backend.
