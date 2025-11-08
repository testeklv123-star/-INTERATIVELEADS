# ⚡ Comandos Rápidos - Referência

## 🚀 Iniciar Sistema

### Backend
```powershell
cd backend
npm run offline:dev
```

### Frontend (Servidor Local)
```powershell
cd frontend-web
npx serve .
# Acesse: http://localhost:3000
```

### Docker (Tudo junto)
```powershell
docker-compose up --build
# Frontend: http://localhost
# Backend: http://localhost:5000
```

---

## 🧪 Testes da API

### Health Check
```powershell
curl http://localhost:5000/health
```

### Criar Lead
```powershell
curl -X POST http://localhost:5000/api/leads `
  -H "Content-Type: application/json" `
  -d '{"name":"Teste","email":"teste@teste.com","phone":"11999999999"}'
```

### Listar Leads
```powershell
curl http://localhost:5000/api/leads
```

### Estatísticas
```powershell
curl http://localhost:5000/api/leads/stats
```

### Status de Sincronização
```powershell
curl http://localhost:5000/api/sync/stats
```

### Disparar Sincronização Manual
```powershell
curl -X POST http://localhost:5000/api/sync/trigger
```

---

## 🗄️ SQLite

### Abrir Banco
```powershell
cd backend\data
sqlite3 kiosk.db
```

### Consultas Úteis
```sql
-- Ver todos os leads
SELECT * FROM leads;

-- Ver leads pendentes
SELECT * FROM leads WHERE sync_status = 'PENDING';

-- Ver leads sincronizados
SELECT * FROM leads WHERE sync_status = 'SYNCED';

-- Ver leads com erro
SELECT * FROM leads WHERE sync_status = 'ERROR';

-- Contar por status
SELECT sync_status, COUNT(*) FROM leads GROUP BY sync_status;

-- Últimos 10 leads
SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;

-- Sair
.quit
```

### Limpar Banco (CUIDADO!)
```powershell
Remove-Item backend\data\kiosk.db*
# Reinicie o backend para recriar
```

---

## 🐳 Docker

### Iniciar
```powershell
docker-compose up
```

### Iniciar com Build
```powershell
docker-compose up --build
```

### Iniciar em Background
```powershell
docker-compose up -d
```

### Parar
```powershell
docker-compose down
```

### Ver Logs
```powershell
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend-local

# Apenas frontend
docker-compose logs -f frontend
```

### Reiniciar
```powershell
docker-compose restart
```

### Ver Status
```powershell
docker-compose ps
```

### Remover Tudo (CUIDADO!)
```powershell
docker-compose down -v
```

---

## 📊 Monitoramento

### Ver Logs do Backend (Tempo Real)
```powershell
cd backend
npm run offline:dev
# Logs aparecem no terminal
```

### Ver Estatísticas Completas
```powershell
curl http://localhost:5000/api/leads | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Verificar Processo na Porta 5000
```powershell
netstat -ano | findstr :5000
```

### Matar Processo na Porta 5000
```powershell
# Primeiro, pegue o PID
netstat -ano | findstr :5000

# Depois, mate o processo (substitua PID)
taskkill /PID [PID] /F
```

---

## 🔧 Manutenção

### Reinstalar Dependências
```powershell
cd backend
Remove-Item -Recurse node_modules
npm install
```

### Atualizar Dependências
```powershell
cd backend
npm update
```

### Verificar Dependências Desatualizadas
```powershell
cd backend
npm outdated
```

### Limpar Cache do npm
```powershell
npm cache clean --force
```

---

## 📦 Backup

### Backup do SQLite
```powershell
# Criar backup
$date = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item backend\data\kiosk.db "backup\kiosk_$date.db"
```

### Restaurar Backup
```powershell
Copy-Item backup\kiosk_20251108.db backend\data\kiosk.db
# Reinicie o backend
```

### Backup com Docker
```powershell
docker cp interativeleads-backend:/app/data/kiosk.db ./backup/
```

---

## 🧹 Limpeza

### Limpar Logs
```powershell
Remove-Item backend\*.log
```

### Limpar Banco de Dados
```powershell
Remove-Item backend\data\kiosk.db*
```

### Limpar Docker
```powershell
docker system prune -a
```

---

## 🔍 Debug

### Ver Variáveis de Ambiente
```powershell
cd backend
Get-Content .env
```

### Testar Conexão Supabase
```powershell
curl https://rtodbbiugsrhupmyarut.supabase.co/rest/v1/
```

### Ver Estrutura do Banco
```powershell
cd backend\data
sqlite3 kiosk.db ".schema leads"
```

### Exportar Leads para CSV
```sql
-- Dentro do sqlite3
.headers on
.mode csv
.output leads.csv
SELECT * FROM leads;
.quit
```

---

## 🚨 Emergência

### Parar Tudo
```powershell
# Parar backend (Ctrl+C no terminal)

# Parar Docker
docker-compose down

# Matar processo na porta 5000
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Reset Completo
```powershell
# 1. Parar tudo
docker-compose down -v

# 2. Limpar banco
Remove-Item backend\data\kiosk.db*

# 3. Reinstalar dependências
cd backend
Remove-Item -Recurse node_modules
npm install

# 4. Reiniciar
npm run offline:dev
```

---

## 📝 Git

### Ver Status
```powershell
git status
```

### Adicionar Arquivos
```powershell
git add .
```

### Commit
```powershell
git commit -m "Implementação offline-first completa"
```

### Push
```powershell
git push origin main
```

### Reverter Alterações
```powershell
git restore [arquivo]
```

---

## 🎯 Atalhos Úteis

### Teste Completo (1 Comando)
```powershell
# Criar 5 leads de teste
for ($i=1; $i -le 5; $i++) {
  curl -X POST http://localhost:5000/api/leads `
    -H "Content-Type: application/json" `
    -d "{`"name`":`"Teste $i`",`"email`":`"teste$i@teste.com`",`"phone`":`"1199999999$i`"}"
}

# Ver estatísticas
curl http://localhost:5000/api/leads/stats
```

### Monitorar Sincronização
```powershell
# Loop infinito para ver stats
while ($true) {
  curl http://localhost:5000/api/sync/stats
  Start-Sleep -Seconds 5
}
```

### Abrir Tudo
```powershell
# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run offline:dev"

# Frontend no navegador
Start-Process "frontend-web\index.html"

# Supabase
Start-Process "https://rtodbbiugsrhupmyarut.supabase.co"
```

---

## 📚 Links Úteis

- **Supabase:** https://rtodbbiugsrhupmyarut.supabase.co
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost (com Docker) ou file:///...frontend-web/index.html
- **Health Check:** http://localhost:5000/health
- **API Docs:** Ver README_OFFLINE_FIRST.md

---

## 🆘 Ajuda Rápida

### Backend não inicia?
```powershell
cd backend
npm install
npm run offline:dev
```

### Porta 5000 ocupada?
```powershell
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Sincronização não funciona?
1. Verifique tabela no Supabase
2. Verifique `.env` no backend
3. Veja logs: `curl http://localhost:5000/api/sync/stats`

### Frontend não conecta?
1. Backend rodando? `curl http://localhost:5000/health`
2. Porta correta em `js/script.js`?
3. Abra DevTools (F12) para ver erros

---

**💡 Dica:** Salve este arquivo como favorito para referência rápida!

