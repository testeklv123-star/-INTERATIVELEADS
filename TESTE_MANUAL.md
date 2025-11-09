# 🧪 TESTE MANUAL DO SERVIDOR

## ⚠️ Situação Atual

O servidor não está iniciando automaticamente via scripts. Vamos testar manualmente para identificar o problema.

---

## 🔍 TESTE 1: Verificar Dependências

### Passo 1: Abra um terminal novo

```bash
cd backend
```

### Passo 2: Verifique se as dependências estão instaladas

```bash
npm install
```

Aguarde a instalação completar.

---

## 🔍 TESTE 2: Testar Servidor Simples

### Passo 1: Execute o script de teste

```bash
node test-server.js
```

### O que você deve ver:

```
🔍 Testando inicialização do servidor...

✅ dotenv carregado
   PORT configurada: 5000
✅ express carregado
✅ cors carregado
✅ node-cron carregado

🔍 Testando imports de rotas...
✅ leadRoutes carregado
✅ syncRoutes carregado
✅ tenantRoutes carregado

🔍 Testando imports de serviços...
✅ syncService carregado

✅ TODOS OS IMPORTS FUNCIONARAM!

🚀 Agora testando servidor real...

╔════════════════════════════════════════════════════════════╗
║   ✅ SERVIDOR DE TESTE INICIADO COM SUCESSO!              ║
╚════════════════════════════════════════════════════════════╝

✅ Porta: 5000
✅ URL: http://localhost:5000/test
```

### Se der erro:

Copie a mensagem de erro completa e me envie.

---

## 🔍 TESTE 3: Testar Servidor Real

### Passo 1: Se o teste acima funcionou, pare com Ctrl+C

### Passo 2: Execute o servidor real

```bash
npm start
```

### O que você deve ver:

```
╔════════════════════════════════════════════════════════════╗
║   🚀 Servidor Offline-First InterativeLeads               ║
╚════════════════════════════════════════════════════════════╝

✅ Servidor rodando em: http://localhost:5000
🌐 Servidor também acessível em: http://0.0.0.0:5000
✅ Health check: http://localhost:5000/health
✅ Endpoint de leads: http://localhost:5000/api/leads
✅ Endpoint de tenants: http://localhost:5000/api/tenants
```

---

## 🔍 TESTE 4: Testar API

### Abra outro terminal (deixe o servidor rodando)

```bash
curl http://localhost:5000/api/health
```

### Resposta esperada:

```json
{
  "status": "ok",
  "message": "Servidor offline-first rodando",
  "timestamp": "2025-01-08T..."
}
```

---

## 🔍 TESTE 5: Testar Tenants

```bash
curl http://localhost:5000/api/tenants
```

### Resposta esperada:

```json
[
  {
    "id": 1,
    "name": "Tenant Exemplo",
    "slug": "tenant-exemplo",
    ...
  }
]
```

Ou array vazio `[]` se não houver tenants.

---

## 🔍 TESTE 6: Criar um Tenant

```bash
curl -X POST http://localhost:5000/api/tenants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Teste Cliente\",\"slug\":\"teste-cliente\"}"
```

### Resposta esperada:

```json
{
  "success": true,
  "tenant": {
    "id": ...,
    "name": "Teste Cliente",
    "slug": "teste-cliente",
    ...
  }
}
```

---

## 🔍 TESTE 7: Testar Painel Admin

### Passo 1: Com o servidor rodando, abra outro terminal

```bash
cd admin-panel
python -m http.server 8080
```

### Passo 2: Abra no navegador

```
http://localhost:8080
```

### Passo 3: Teste criar um tenant

1. Preencha o formulário
2. Clique em "Criar Tenant"
3. Deve aparecer na tabela

---

## ❌ POSSÍVEIS ERROS E SOLUÇÕES

### Erro: "Cannot find module 'dotenv'"

**Solução:**
```bash
cd backend
npm install
```

### Erro: "Cannot find module '@supabase/supabase-js'"

**Solução:**
```bash
cd backend
npm install @supabase/supabase-js
```

### Erro: "EADDRINUSE: address already in use"

**Solução:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <numero> /F

# Depois tente novamente
npm start
```

### Erro: "SUPABASE_URL is not defined"

**Solução:**
1. Verifique se o arquivo `.env` existe em `backend/`
2. Verifique se tem as variáveis:
   ```env
   PORT=5000
   SUPABASE_URL=sua_url
   SUPABASE_ANON_KEY=sua_chave
   ```

### Erro: "Connection refused"

**Solução:**
1. Verifique se o servidor está rodando
2. Verifique a porta no terminal
3. Tente: `curl http://127.0.0.1:5000/api/health`

---

## 📋 CHECKLIST DE TESTES

Execute na ordem e marque o que funcionar:

- [ ] `npm install` completou sem erros
- [ ] `node test-server.js` iniciou na porta 5000
- [ ] `curl http://localhost:5000/test` retornou OK
- [ ] `npm start` iniciou o servidor real
- [ ] Viu mensagem "Servidor rodando em: http://localhost:5000"
- [ ] `curl http://localhost:5000/api/health` retornou status OK
- [ ] `curl http://localhost:5000/api/tenants` retornou array
- [ ] Conseguiu criar tenant via curl
- [ ] Painel admin abriu no navegador
- [ ] Conseguiu criar tenant pelo painel
- [ ] Tenant apareceu na tabela

---

## 📊 REPORTE OS RESULTADOS

Depois de executar os testes, me informe:

1. **Qual teste falhou?** (número do teste)
2. **Qual foi o erro exato?** (copie a mensagem)
3. **O que apareceu no terminal?** (logs do servidor)

Com essas informações posso ajudar melhor!

---

## 🎯 TESTE RÁPIDO (30 segundos)

Se quiser testar rápido:

```bash
# Terminal 1
cd backend
npm start

# Terminal 2 (novo terminal)
curl http://localhost:5000/api/health

# Se retornar {"status":"ok"...} = FUNCIONOU! ✅
```

---

<div align="center">

# 🧪 EXECUTE OS TESTES AGORA!

**Comece pelo TESTE 1 e vá seguindo em ordem**

**Reporte qualquer erro que encontrar**

**Boa sorte!** 🚀

</div>

