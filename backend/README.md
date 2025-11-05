# Backend InterativeLeads

API central para gerenciamento white-label do InterativeLeads.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 20+
- Docker Desktop (ou PostgreSQL local)

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente (já criado)
# Arquivo .env já está configurado com valores de desenvolvimento

# 3. Iniciar banco de dados
# No diretório raiz do projeto:
docker compose up -d

# 4. Executar migrações
npm run migration:run

# 5. Iniciar servidor
npm run dev
```

✅ Backend rodando em `http://localhost:4000`

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts              # Configuração de ambiente
│   ├── db/
│   │   ├── entities/           # ✅ Entidades TypeORM centralizadas
│   │   │   ├── User.entity.ts
│   │   │   ├── Tenant.entity.ts
│   │   │   └── TenantConfig.entity.ts
│   │   ├── migrations/         # Migrações do banco
│   │   ├── connection.ts
│   │   └── data-source.ts      # ✅ DataSource do TypeORM
│   ├── modules/
│   │   ├── auth/               # Autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts  # ✅ Importa de db/entities
│   │   │   └── index.ts            # ✅ Importa de db/entities
│   │   └── tenant/             # Gerenciamento de tenants
│   │       ├── tenant.controller.ts
│   │       ├── tenant.service.ts
│   │       ├── tenant.repository.ts # ✅ Importa de db/entities
│   │       └── index.ts             # ✅ Importa de db/entities
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   └── authorization.ts
│   ├── errors/
│   │   └── appError.ts
│   ├── utils/
│   │   └── jwt.ts
│   └── index.ts                # Entry point
├── .env                        # ✅ Variáveis de ambiente (não commitar)
├── .env.example                # ✅ Template de configuração
├── .gitignore                  # ✅ Ignora .env e node_modules
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com hot-reload

# Build
npm run build            # Compila TypeScript para JavaScript
npm start                # Inicia servidor de produção (após build)

# Type checking
npm run typecheck        # Verifica tipos sem compilar

# Testes
npm test                 # Executa testes
npm run test:watch       # Executa testes em modo watch

# Migrações
npm run migration:generate    # Gera nova migração
npm run migration:run        # Executa migrações pendentes
npm run migration:revert     # Reverte última migração
```

---

## 🗄️ Banco de Dados

### Configuração

O banco está configurado em `.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/interativeleads
```

### Entidades

Todas as entidades estão centralizadas em `src/db/entities/`:

- **User** - Usuários do sistema
- **Tenant** - Clientes/empresas
- **TenantConfig** - Configurações de cada tenant (tema, jogos, etc)

### Migrações

Migrações estão em `src/db/migrations/`. Para criar uma nova:

```bash
npm run migration:generate
```

---

## 🔐 Autenticação

O sistema usa JWT com refresh tokens:

- **Access Token:** 15 minutos (default)
- **Refresh Token:** 7 dias (default)

### Endpoints

```
POST /auth/login          # Login
POST /auth/refresh        # Refresh token
POST /auth/register       # Registro (se habilitado)
```

---

## 🏢 Multi-Tenant

Cada tenant tem configurações isoladas:

```typescript
{
  tenant_id: "loja_tech_sp_001",
  display_name: "Loja Tech SP",
  config: {
    theme: { /* cores, logos */ },
    form_settings: { /* campos do formulário */ }
  }
}
```

### Endpoints

```
GET    /tenants/:id       # Buscar tenant
POST   /tenants           # Criar tenant
PATCH  /tenants/:id       # Atualizar tenant
DELETE /tenants/:id       # Deletar tenant
```

---

## 🌍 Variáveis de Ambiente

Arquivo `.env.example` contém todos os valores necessários:

```env
# Server
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL=postgres://user:pass@host:port/db

# JWT (MUDE EM PRODUÇÃO!)
JWT_SECRET=secret-com-no-minimo-32-caracteres
JWT_REFRESH_SECRET=refresh-secret-32-chars-min

# CORS
CORS_ORIGIN=http://localhost:5000
```

⚠️ **IMPORTANTE:** Gere secrets fortes para produção!

---

## 🐛 Troubleshooting

### Erro: Cannot find module 'entities/...'
✅ **Resolvido!** Todas as entidades foram movidas para `src/db/entities/`

### Erro: ECONNREFUSED ::1:5432
**Causa:** PostgreSQL não está rodando

**Solução:**
```bash
# No diretório raiz:
docker compose up -d

# Ou inicie o PostgreSQL local
```

### Erro: import type quebra decorators
✅ **Resolvido!** Removido `import type` das entidades usadas em decorators

### Docker não encontrado
1. Abra o Docker Desktop
2. Aguarde inicializar completamente
3. Reinicie o terminal
4. Execute `docker compose up -d` novamente

---

## 📊 Health Check

Verifique se o backend está funcionando:

```bash
curl http://localhost:4000/health
```

Resposta esperada:
```json
{"status":"ok"}
```

---

## 🚀 Deploy (Produção)

### 1. Build

```bash
npm run build
```

### 2. Variáveis de Ambiente

Configure no servidor:
- `NODE_ENV=production`
- `DATABASE_URL=<url_do_banco_producao>`
- `JWT_SECRET=<secret_forte_gerado>`
- `JWT_REFRESH_SECRET=<outro_secret_forte>`
- `CORS_ORIGIN=<dominio_do_frontend>`

### 3. Executar Migrações

```bash
npm run migration:run
```

### 4. Iniciar

```bash
npm start
```

---

## 📝 Licença

Proprietary - InterativeLeads © 2025

