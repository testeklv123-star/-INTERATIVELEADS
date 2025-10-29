# 🚀 Como Iniciar o Backend

## Opção 1: Docker Desktop (Recomendado)

### 1️⃣ Iniciar o Docker Desktop
1. Abra o **Docker Desktop** pelo menu Iniciar do Windows
2. Aguarde até ver o ícone da baleia no canto inferior direito
3. O ícone ficará estático quando estiver pronto

### 2️⃣ Iniciar o Banco de Dados
Abra um **novo terminal PowerShell** e execute:

```powershell
cd C:\Users\User\Desktop\projetos\white-label-totem-application
docker compose up -d
```

Aguarde a mensagem:
```
✅ Container interativeleads-postgres Started
```

### 3️⃣ Executar Migrações

```powershell
cd backend
npm run migration:run
```

### 4️⃣ Iniciar o Servidor

```powershell
npm run dev
```

✅ Backend rodando em: `http://localhost:4000`

---

## Opção 2: PostgreSQL Local (Sem Docker)

### 1️⃣ Instalar PostgreSQL

Baixe e instale: https://www.postgresql.org/download/windows/

**Durante a instalação:**
- Usuário: `postgres`
- Senha: `postgres`
- Porta: `5432`

### 2️⃣ Criar o Banco de Dados

Abra o **pgAdmin** ou **psql** e execute:

```sql
CREATE DATABASE interativeleads;
```

### 3️⃣ Executar Migrações

```powershell
cd backend
npm run migration:run
```

### 4️⃣ Iniciar o Servidor

```powershell
npm run dev
```

---

## 🔍 Verificar se o Backend Está Funcionando

Abra o navegador em:
```
http://localhost:4000/health
```

Deve retornar:
```json
{"status":"ok"}
```

---

## ⚠️ Problemas Comuns

### Docker não encontrado
- **Solução:** Reinicie o terminal após abrir o Docker Desktop
- **Ou:** Reinicie o computador após instalar o Docker

### Erro: ECONNREFUSED 5432
- **Causa:** PostgreSQL não está rodando
- **Solução:** Inicie o Docker Desktop ou PostgreSQL local

### Erro: Database does not exist
- **Solução:** Execute `npm run migration:run` no diretório `backend/`

---

## 📂 Estrutura Criada

```
white-label-totem-application/
├── docker-compose.yml          ✅ Configuração PostgreSQL
├── backend/
│   ├── .env                    ✅ Variáveis de ambiente
│   ├── .env.example            ✅ Template de configuração
│   ├── src/
│   │   ├── db/
│   │   │   ├── entities/       ✅ Todas as entidades centralizadas
│   │   │   │   ├── User.entity.ts
│   │   │   │   ├── Tenant.entity.ts
│   │   │   │   └── TenantConfig.entity.ts
│   │   │   └── data-source.ts  ✅ Configuração TypeORM
│   │   └── ...
│   └── package.json
└── ...
```

---

## 🎯 Próximos Passos

1. ✅ Inicie o Docker Desktop
2. ✅ Execute: `docker compose up -d` (no diretório raiz)
3. ✅ Execute: `cd backend && npm run migration:run`
4. ✅ Execute: `npm run dev`
5. ✅ Acesse: http://localhost:4000/health

