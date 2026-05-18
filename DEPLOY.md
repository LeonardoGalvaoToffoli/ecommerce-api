# Deploy

Pipeline atual: push em `main` -> CI roda testes -> Deploy builda imagens, sobe pro
GitHub Container Registry (GHCR), conecta via SSH na VPS e faz `docker compose pull && up -d`.

## 1. Pre-requisitos na VPS

- Docker + docker compose plugin (`docker compose version` deve responder)
- Um usuario de deploy (recomendo `deploy`, sem sudo passwordless)
- Pasta da aplicacao, ex: `/opt/camisaria`

```bash
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy
sudo mkdir -p /opt/camisaria
sudo chown deploy:deploy /opt/camisaria
```

## 2. Conteudo da pasta de deploy

Na VPS, em `/opt/camisaria/`, deixe:

```
.env                       <- baseado em .env.production.example
docker-compose.prod.yml    <- mesmo do repo
```

Para o primeiro setup:

```bash
sudo -u deploy bash
cd /opt/camisaria
cp ~/repo/.env.production.example .env   # ajuste valores
cp ~/repo/docker-compose.prod.yml .
```

Ou simplesmente clone o repo e use os arquivos de la — mas o `.env` voce **nao**
deve commitar.

## 3. Chave SSH e secrets do GitHub

Na sua maquina, gere uma chave dedicada pro deploy:

```bash
ssh-keygen -t ed25519 -C "github-deploy-camisaria" -f ~/.ssh/camisaria_deploy -N ""
```

- Copie a parte publica (`~/.ssh/camisaria_deploy.pub`) para
  `/home/deploy/.ssh/authorized_keys` na VPS
- Garanta as permissoes: `chmod 600 authorized_keys` e dono `deploy:deploy`

Crie um Personal Access Token (classic) com escopo `read:packages` no GitHub
para a VPS conseguir baixar imagens do GHCR (mesmo em repo publico, vale a pena
para evitar rate-limit).

### Secrets do repositorio (Settings -> Secrets and variables -> Actions)

| Secret | Valor |
| --- | --- |
| `VPS_HOST` | IP ou DNS da VPS |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` (opcional, default 22) |
| `VPS_SSH_KEY` | conteudo de `camisaria_deploy` (a chave privada) |
| `VPS_APP_DIR` | `/opt/camisaria` |
| `GHCR_READ_USER` | seu username do GitHub |
| `GHCR_READ_TOKEN` | o PAT com `read:packages` |

## 4. Tornar as imagens do GHCR publicas (opcional)

Por padrao as imagens nascem privadas. Pra evitar manter o PAT na VPS:

1. GitHub -> seu perfil -> Packages
2. Abra `ecommerce-api-backend` -> Package settings -> Change visibility -> Public
3. Idem para `ecommerce-api-frontend`

Se fizer isso, voce pode remover `GHCR_READ_USER`/`GHCR_READ_TOKEN` dos secrets
e remover o passo `docker login` do `deploy.yml`.

## 5. Primeira subida manual (smoke test)

Antes de soltar o GH Actions, valide na VPS:

```bash
sudo -u deploy bash
cd /opt/camisaria

# autentica no GHCR (usa o PAT)
echo "$GHCR_READ_TOKEN" | docker login ghcr.io -u "$GHCR_READ_USER" --password-stdin

# baixa e sobe
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# verifica
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

Acesse `http://<IP-DA-VPS>` — o frontend deve carregar e o front faz proxy
`/api/*` pro backend pela rede interna do compose.

## 6. HTTPS

Quando tiver um dominio apontando pra VPS, recomendo colocar um Caddy ou
Traefik na frente do `frontend` cuidando de TLS. Exemplo rapido com Caddy:

```yaml
# Adicione um servico no docker-compose.prod.yml
caddy:
  image: caddy:2-alpine
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile
    - caddy_data:/data
    - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

`Caddyfile`:

```
camisaria.seu-dominio.com {
  reverse_proxy frontend:80
}
```

E remova a porta `80` do servico `frontend` (deixa so `expose: ["80"]`).

## 7. Rollback rapido

Cada commit gera tag `<sha-curto>`. Para voltar a versao:

```bash
cd /opt/camisaria
export BACKEND_IMAGE=ghcr.io/leonardogalvaotoffoli/ecommerce-api-backend:<sha-anterior>
export FRONTEND_IMAGE=ghcr.io/leonardogalvaotoffoli/ecommerce-api-frontend:<sha-anterior>
docker compose -f docker-compose.prod.yml up -d
```
