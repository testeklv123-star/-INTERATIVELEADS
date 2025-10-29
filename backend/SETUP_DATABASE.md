# 🗄️ Configurar Banco de Dados PostgreSQL

## Opção 1: Via pgAdmin (Recomendado - Interface Gráfica)

### 1️⃣ Abrir pgAdmin
- Procure por "pgAdmin 4" no menu Iniciar do Windows
- Digite a senha master que você configurou na instalação

### 2️⃣ Conectar ao Servidor
- No painel esquerdo, expanda "Servers"
- Clique com botão direito em "PostgreSQL 15" (ou sua versão)
- Se pedir senha, use: `postgres` (ou a senha que você configurou)

### 3️⃣ Criar o Banco de Dados
- Clique com botão direito em "Databases"
- Selecione "Create" → "Database..."
- Em "Database", digite: `interativeleads`
- Clique em "Save"

✅ Banco criado! Pule para "Próximos Passos" abaixo.

---

## Opção 2: Via Linha de Comando (psql)

### 1️⃣ Abrir PowerShell como Administrador

### 2️⃣ Adicionar PostgreSQL ao PATH (se necessário)

Execute para encontrar a instalação:
```powershell
Get-ChildItem "C:\Program Files\" -Filter psql.exe -Recurse -ErrorAction SilentlyContinue
```

Anote o caminho e adicione ao PATH temporariamente:
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\XX\bin"
```
(Substitua XX pela versão encontrada)

### 3️⃣ Criar o Banco

```powershell
psql -U postgres -c "CREATE DATABASE interativeleads;"
```

Quando pedir senha, digite: `postgres` (ou sua senha)

---

## Próximos Passos

Após criar o banco de dados:

```powershell
# 1. Volte para o diretório backend
cd C:\Users\User\Desktop\projetos\white-label-totem-application\backend

# 2. Execute as migrações
npm run migration:run

# 3. Inicie o servidor
npm run dev
```

✅ Backend rodando em: http://localhost:4000

---

## ⚠️ Problema: "Database does not exist"

Se ainda aparecer este erro:
1. Verifique se o banco foi criado no pgAdmin
2. Confirme que a conexão está correta no arquivo `backend/.env`:
   ```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/interativeleads
   ```
3. Verifique se o serviço PostgreSQL está rodando:
   - Abra "Serviços" no Windows
   - Procure por "postgresql"
   - Status deve ser "Em execução"

---

## 🔍 Verificar se funcionou

Após iniciar o backend, acesse:
```
http://localhost:4000/health
```

Deve retornar:
```json
{"status":"ok"}
```

