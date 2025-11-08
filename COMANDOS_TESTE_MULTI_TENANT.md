# ⚡ Comandos Rápidos - Teste Multi-Tenant

## 🚀 Iniciar Backend

```powershell
cd backend
npm run offline:dev
```

---

## 🧪 Testes Básicos

### 1. Health Check
```powershell
curl http://localhost:5000/health
```

### 2. Listar todos os tenants
```powershell
curl http://localhost:5000/api/tenants
```

### 3. Ver tenant atual
```powershell
curl http://localhost:5000/api/tenants/current
```

---

## 🏢 Gerenciar Tenants

### Criar novo tenant
```powershell
curl -X POST http://localhost:5000/api/tenants `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Loja ABC\",\"slug\":\"loja-abc\"}'
```

### Buscar tenant específico
```powershell
curl http://localhost:5000/api/tenants/loja-abc
```

### Mudar tenant atual
```powershell
curl -X POST http://localhost:5000/api/tenants/set-current `
  -H "Content-Type: application/json" `
  -d '{\"slug\":\"loja-abc\"}'
```

---

## 👥 Gerenciar Leads

### Criar lead
```powershell
curl -X POST http://localhost:5000/api/leads `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"João Silva\",\"email\":\"joao@teste.com\",\"phone\":\"11987654321\"}'
```

### Ver estatísticas
```powershell
curl http://localhost:5000/api/leads/stats
```

### Forçar sincronização
```powershell
curl -X POST http://localhost:5000/api/sync/now
```

---

## 📊 Verificar no SQLite

### Ver leads com tenants
```powershell
sqlite3 backend/data/kiosk.db "SELECT id, name, email, tenant_slug, sync_status FROM leads;"
```

### Ver tenant atual
```powershell
sqlite3 backend/data/kiosk.db "SELECT * FROM current_tenant;"
```

---

## 🔍 Verificar no Supabase (SQL Editor)

### Ver todos os tenants
```sql
SELECT * FROM tenants ORDER BY created_at DESC;
```

### Ver leads com nome do tenant
```sql
SELECT 
  l.id,
  l.name as lead_name,
  l.email,
  t.name as tenant_name,
  t.slug as tenant_slug,
  l.created_at
FROM leads l
JOIN tenants t ON l.tenant_id = t.id
ORDER BY l.created_at DESC;
```

### Contar leads por tenant
```sql
SELECT 
  t.name,
  t.slug,
  COUNT(l.id) as total_leads
FROM tenants t
LEFT JOIN leads l ON l.tenant_id = t.id
GROUP BY t.id, t.name, t.slug
ORDER BY total_leads DESC;
```

---

## 🧪 Teste Completo Multi-Tenant

### Script de teste completo (PowerShell)
```powershell
# 1. Criar dois tenants
Write-Host "1. Criando tenant 'Loja A'..."
curl -X POST http://localhost:5000/api/tenants `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Loja A\",\"slug\":\"loja-a\"}'

Write-Host "`n2. Criando tenant 'Loja B'..."
curl -X POST http://localhost:5000/api/tenants `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Loja B\",\"slug\":\"loja-b\"}'

# 2. Configurar para Loja A
Write-Host "`n3. Configurando tenant atual para 'Loja A'..."
curl -X POST http://localhost:5000/api/tenants/set-current `
  -H "Content-Type: application/json" `
  -d '{\"slug\":\"loja-a\"}'

# 3. Criar lead para Loja A
Write-Host "`n4. Criando lead para Loja A..."
curl -X POST http://localhost:5000/api/leads `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Maria da Loja A\",\"email\":\"maria@lojaa.com\",\"phone\":\"11999999999\"}'

# 4. Trocar para Loja B
Write-Host "`n5. Configurando tenant atual para 'Loja B'..."
curl -X POST http://localhost:5000/api/tenants/set-current `
  -H "Content-Type: application/json" `
  -d '{\"slug\":\"loja-b\"}'

# 5. Criar lead para Loja B
Write-Host "`n6. Criando lead para Loja B..."
curl -X POST http://localhost:5000/api/leads `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"João da Loja B\",\"email\":\"joao@lojab.com\",\"phone\":\"11888888888\"}'

# 6. Aguardar sincronização
Write-Host "`n7. Aguardando 35 segundos para sincronização..."
Start-Sleep -Seconds 35

# 7. Ver resultados
Write-Host "`n8. Verificando estatísticas..."
curl http://localhost:5000/api/leads/stats

Write-Host "`n✅ Teste completo! Verifique no Supabase:"
Write-Host "   https://rtodbbiugsrhupmyarut.supabase.co"
```

Salve esse script como `teste-multi-tenant.ps1` e execute:
```powershell
.\teste-multi-tenant.ps1
```

---

## 🎯 Resultado Esperado

Após executar o teste completo, você deve ver no Supabase:

**Tenants:**
- Loja A (slug: loja-a)
- Loja B (slug: loja-b)

**Leads:**
- Maria da Loja A → vinculada à Loja A
- João da Loja B → vinculado à Loja B

---

## 🛠️ Utilitários

### Limpar banco SQLite (recomeçar do zero)
```powershell
# Parar o servidor (Ctrl+C)
Remove-Item backend/data/kiosk.db*
# Reiniciar o servidor
cd backend
npm run offline:dev
```

### Ver logs em tempo real
```powershell
# Logs já aparecem no terminal onde o servidor está rodando
# Para ver apenas erros, use:
npm run offline:dev 2>&1 | Select-String -Pattern "error|erro|❌"
```

---

## 📝 Notas

- Todos os comandos `curl` assumem que o servidor está em `http://localhost:5000`
- A sincronização automática ocorre a cada 30 segundos
- Use `\` no PowerShell para quebrar linhas longas
- Use aspas duplas escapadas `\"` dentro de JSON no PowerShell

---

## 🎉 Pronto!

Agora você tem todos os comandos necessários para testar seu sistema multi-tenant!

