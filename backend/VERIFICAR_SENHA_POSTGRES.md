# 🔐 Verificar/Resetar Senha do PostgreSQL

A autenticação está falhando. Vamos confirmar a senha:

## Opção 1: Verificar via pgAdmin (Mais Fácil)

### 1️⃣ Abrir pgAdmin 4
- Procure "pgAdmin 4" no menu Iniciar
- Abra o aplicativo

### 2️⃣ Tentar Conectar
- No painel esquerdo, clique em "Servers"
- Clique em "PostgreSQL 15" (ou sua versão)
- **ELE VAI PEDIR A SENHA!**

### 3️⃣ Três Possibilidades:

**A) Se a senha `Nenus123@` funcionar:**
- Ótimo! O problema pode ser com caracteres especiais na URL
- Tente mudar a senha para algo simples:  `postgres123` (sem caracteres especiais)

**B) Se a senha não funcionar:**
- Você precisa lembrar qual senha usou na instalação
- Ou pode resetar (veja Opção 2 abaixo)

**C) Se conectar sem pedir senha:**
- O PostgreSQL está em modo "trust"
- Use `.env` sem senha (veja abaixo)

---

## Opção 2: Resetar a Senha (Se não lembrar)

### Windows:

1. Abra "Serviços" (services.msc)
2. Procure por "postgresql-x64-XX"
3. Clique com botão direito → Parar

4. Navegue até a pasta de dados do PostgreSQL:
   ```
   C:\Program Files\PostgreSQL\XX\data\
   ```

5. Abra o arquivo `pg_hba.conf` com bloco de notas

6. Encontre as linhas que terminam com `scram-sha-256` ou `md5`
   
7. Troque por `trust` (temporariamente):
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   # IPv6 local connections:
   host    all             all             ::1/128                 trust
   ```

8. Salve o arquivo

9. Volte em "Serviços" e inicie o PostgreSQL novamente

10. Agora abra pgAdmin e conecte (não pedirá senha)

11. Clique com botão direito em "postgres" (em Login/Group Roles)

12. Properties → Definition → Password

13. Defina uma senha SIMPLES: `postgres` ou `postgres123`

14. Salve

15. Volte ao `pg_hba.conf` e mude `trust` de volta para `scram-sha-256`

16. Reinicie o PostgreSQL nos Serviços

---

## Opção 3: Usar Senha Simples (Recomendado para Dev)

Se quiser evitar problemas com caracteres especiais (`@`, `#`, `$`, etc):

**Defina uma senha simples: `postgres` ou `postgres123`**

Isso evita problemas de URL encoding.

---

## Depois de Confirmar/Resetar a Senha:

Atualize o arquivo `backend/.env`:

```powershell
# Se a senha for "postgres":
$content = "NODE_ENV=development`nPORT=4000`nDATABASE_URL=postgres://postgres:postgres@localhost:5432/interativeleads`nJWT_SECRET=dev-jwt-secret-change-me-in-production-32chars-minimum`nJWT_REFRESH_SECRET=dev-jwt-refresh-secret-change-me-prod-32chars-min`nJWT_ACCESS_EXPIRES_IN=15m`nJWT_REFRESH_EXPIRES_IN=7d`nCORS_ORIGIN=http://localhost:5173,http://localhost:3000"; $content | Set-Content -Path .env

# Teste novamente:
node test-connection.js
```

Se o teste funcionar (`✅ Conexão bem-sucedida!`), execute:
```powershell
npm run migration:run
npm run dev
```

---

## ⚡ Atalho Rápido:

Se quiser ir direto ao ponto:

1. Abra pgAdmin
2. Redefina a senha do postgres para: `postgres`
3. Execute no PowerShell (no diretório backend/):

```powershell
$content = "NODE_ENV=development`nPORT=4000`nDATABASE_URL=postgres://postgres:postgres@localhost:5432/interativeleads`nJWT_SECRET=dev-jwt-secret-change-me-in-production-32chars-minimum`nJWT_REFRESH_SECRET=dev-jwt-refresh-secret-change-me-prod-32chars-min`nJWT_ACCESS_EXPIRES_IN=15m`nJWT_REFRESH_EXPIRES_IN=7d`nCORS_ORIGIN=http://localhost:5173,http://localhost:3000"; $content | Set-Content -Path .env

node test-connection.js
npm run migration:run
npm run dev
```

✅ Pronto!

