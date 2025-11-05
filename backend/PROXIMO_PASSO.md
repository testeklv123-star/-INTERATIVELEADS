# ✅ BACKEND QUASE PRONTO! Último Passo:

## 📋 O Que Foi Feito

✅ **Todas as importações de entidades corrigidas**
✅ **Entidade User movida para `src/db/entities/`**
✅ **DataSource atualizado com todas as entidades**
✅ **Problema `import type` corrigido**
✅ **PostgreSQL instalado e rodando**
✅ **Docker Compose configurado**
✅ **Documentação completa criada**

---

## 🎯 O QUE VOCÊ PRECISA FAZER AGORA (2 minutos)

### Passo 1: Configurar a Senha do PostgreSQL

Crie o arquivo `.env` dentro da pasta `backend/`:

**Via VSCode/Cursor:**
1. Abra a pasta `backend/`
2. Crie novo arquivo: `.env`
3. Cole o conteúdo abaixo:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:SUA_SENHA_AQUI@localhost:5432/interativeleads
JWT_SECRET=dev-jwt-secret-change-me-in-production-32chars-minimum
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-change-me-prod-32chars-min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5000
```

4. **IMPORTANTE:** Substitua `SUA_SENHA_AQUI` pela senha que você configurou ao instalar o PostgreSQL

**Exemplo com senha "postgres":**
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/interativeleads
```

---

### Passo 2: Criar o Banco de Dados

**Opção A - Via pgAdmin (Recomendado):**
1. Abra **pgAdmin 4** (procure no menu Iniciar)
2. Digite sua senha master
3. No painel esquerdo: Servers → PostgreSQL
4. Clique com botão direito em "Databases"
5. Create → Database...
6. Database name: `interativeleads`
7. Clique em "Save"

**Opção B - Via Linha de Comando:**
```powershell
# Abra um NOVO PowerShell
psql -U postgres
# Digite sua senha quando pedir
# No prompt do postgres, execute:
CREATE DATABASE interativeleads;
\q
```

---

### Passo 3: Iniciar o Backend

```powershell
# No PowerShell (diretório backend/):
npm run migration:run
npm run dev
```

---

## ✅ Como Saber se Funcionou?

Você deve ver no terminal:

```
✅ Conectado ao PostgreSQL via TypeORM
API InterativeLeads rodando na porta 4000
```

Acesse no navegador:
```
http://localhost:4000/health
```

Deve retornar:
```json
{"status":"ok"}
```

---

## 🆘 Problemas?

### Erro: "password authentication failed"
→ A senha no `.env` está errada. Confira `CONFIGURAR_SENHA.md`

### Erro: "database interativeleads does not exist"
→ Você esqueceu de criar o banco. Veja Passo 2 acima

### Erro: "ECONNREFUSED"
→ PostgreSQL não está rodando. Abra "Serviços" do Windows e inicie o serviço `postgresql-x64-XX`

---

## 📁 Arquivos Importantes Criados

```
backend/
├── .env                         ← VOCÊ PRECISA CRIAR ESTE
├── .env.example                 ← Template (já criado)
├── .gitignore                   ← Ignora .env no git
├── README.md                    ← Documentação completa
├── SETUP_DATABASE.md            ← Guia detalhado do banco
├── CONFIGURAR_SENHA.md          ← Guia de senha
├── PROXIMO_PASSO.md             ← Este arquivo
└── create-database.sql          ← Script SQL alternativo
```

**Na raiz do projeto:**
```
├── docker-compose.yml           ← PostgreSQL via Docker
├── start-backend.bat            ← Atalho para iniciar tudo
├── stop-backend.bat             ← Atalho para parar
└── INICIAR_BACKEND.md           ← Guia completo
```

---

## 🚀 Depois que Funcionar

Com o backend rodando, você terá:

- ✅ API REST em `http://localhost:4000`
- ✅ Health check em `/health`
- ✅ Rotas de autenticação em `/auth/*`
- ✅ Rotas de tenants em `/tenants/*`
- ✅ Banco PostgreSQL configurado
- ✅ TypeORM com migrações funcionando
- ✅ Hot-reload (altera código e recarrega automaticamente)

---

## 📞 Resumo Ultra-Rápido

```powershell
# 1. Criar backend/.env com sua senha do postgres
# 2. Criar banco "interativeleads" no pgAdmin
# 3. Executar:
cd backend
npm run migration:run
npm run dev
```

**FIM! Backend rodando! 🎉**

