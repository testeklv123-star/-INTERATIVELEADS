# 🔐 Configurar Senha do PostgreSQL

## O que aconteceu?

O backend tentou conectar ao PostgreSQL com a senha padrão `postgres`, mas a autenticação falhou.

**Você precisa configurar a senha correta que você usou na instalação do PostgreSQL.**

---

## Como Corrigir

### 1️⃣ Criar o arquivo `.env`

No diretório `backend/`, crie um arquivo chamado `.env` (SEM extensão .txt) com o seguinte conteúdo:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database Configuration
# ALTERE A SENHA ABAIXO PARA A SUA SENHA DO POSTGRES!
DATABASE_URL=postgres://postgres:SUA_SENHA_AQUI@localhost:5432/interativeleads

# JWT Configuration
JWT_SECRET=dev-jwt-secret-change-me-in-production-32chars-minimum
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-change-me-prod-32chars-min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5000
```

### 2️⃣ Substituir a Senha

Na linha `DATABASE_URL`, substitua `SUA_SENHA_AQUI` pela senha que você configurou durante a instalação do PostgreSQL.

**Exemplo:**
```env
# Se sua senha é "minhasenha123"
DATABASE_URL=postgres://postgres:minhasenha123@localhost:5432/interativeleads
```

---

## Criar arquivo .env via PowerShell

Se preferir criar via terminal:

```powershell
cd C:\Users\User\Desktop\projetos\white-label-totem-application\backend

# Crie o arquivo (substitua SUASENHA pela senha real)
@"
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:SUASENHA@localhost:5432/interativeleads
JWT_SECRET=dev-jwt-secret-change-me-in-production-32chars-minimum
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-change-me-prod-32chars-min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding UTF8
```

---

## ⚠️ Não sabe qual senha você usou?

### Opção 1: Resetar a senha do PostgreSQL

1. Abra o **pgAdmin 4**
2. Clique com botão direito em "PostgreSQL"
3. Properties → Connection
4. Você verá o usuário "postgres"
5. Clique com botão direito em "postgres" (em Login/Group Roles)
6. Properties → Definition
7. Defina uma nova senha (ex: `postgres`)
8. Clique em "Save"

### Opção 2: Usar autenticação trust (desenvolvimento apenas)

Edite o arquivo `pg_hba.conf`:
1. Localize: `C:\Program Files\PostgreSQL\XX\data\pg_hba.conf`
2. Mude as linhas com `md5` ou `scram-sha-256` para `trust`
3. Reinicie o PostgreSQL
4. Use `DATABASE_URL=postgres://postgres@localhost:5432/interativeleads` (sem senha)

---

## Próximos Passos

Após configurar o `.env`:

```powershell
# 1. Criar o banco (via pgAdmin ou psql)
# No pgAdmin: Databases → Create → Database → Nome: interativeleads

# 2. Executar migrações
npm run migration:run

# 3. Iniciar backend
npm run dev
```

✅ Pronto!

