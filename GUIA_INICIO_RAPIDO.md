# 🚀 Guia de Início Rápido - InterativeLeads Offline-First

## ⚡ Início em 5 Minutos

### Pré-requisitos

- Docker e Docker Compose instalados
- Porta 80 e 5000 disponíveis

### Passo 1: Configurar Supabase (Apenas uma vez)

1. Acesse: https://rtodbbiugsrhupmyarut.supabase.co
2. Vá em **SQL Editor**
3. Execute o script em `backend/supabase-setup.sql`

### Passo 2: Iniciar a Aplicação

```bash
# Na raiz do projeto
docker-compose up --build
```

Aguarde até ver:

```
✅ Servidor rodando em: http://localhost:5000
✅ Banco de dados SQLite local inicializado
✅ Cliente Supabase inicializado
⏰ Configurando sincronização automática a cada 30 segundos
```

### Passo 3: Acessar o Totem

Abra seu navegador em: **http://localhost**

### Passo 4: Testar Captura de Lead

1. Preencha o formulário com:
   - Nome: "João Silva"
   - Email: "joao@teste.com"
   - Telefone: "(11) 98765-4321"
2. Clique em "Enviar"
3. Veja a mensagem de sucesso! ✅

### Passo 5: Verificar Sincronização

```bash
# Ver logs de sincronização
docker-compose logs -f backend-local | findstr "🔄"

# Ver estatísticas
curl http://localhost:5000/api/leads/stats
```

### Passo 6: Verificar no Supabase

1. Acesse: https://rtodbbiugsrhupmyarut.supabase.co
2. Vá em **Table Editor** → **leads**
3. Veja seu lead sincronizado! 🎉

## 🧪 Testando Modo Offline

### Simular Perda de Conexão

1. Pare o backend: `docker-compose stop backend-local`
2. Tente enviar um lead no frontend
3. Veja que ainda funciona (salva localmente)
4. Reinicie: `docker-compose start backend-local`
5. Aguarde 30 segundos
6. Verifique no Supabase - o lead foi sincronizado!

## 📊 Comandos Úteis

```bash
# Ver todos os leads locais
curl http://localhost:5000/api/leads

# Ver estatísticas de sincronização
curl http://localhost:5000/api/sync/stats

# Disparar sincronização manual
curl -X POST http://localhost:5000/api/sync/trigger

# Parar aplicação
docker-compose down

# Reiniciar aplicação
docker-compose restart

# Ver logs em tempo real
docker-compose logs -f
```

## 🎯 Estrutura de Dados

### Lead no SQLite Local

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@teste.com",
  "phone": "(11) 98765-4321",
  "created_at": "2025-11-07T23:00:00.000Z",
  "sync_status": "PENDING",
  "synced_at": null,
  "error_message": null
}
```

### Lead no Supabase (após sincronização)

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@teste.com",
  "phone": "(11) 98765-4321",
  "created_at": "2025-11-07T23:00:30.000Z"
}
```

## 🔍 Verificação de Saúde

### Backend

```bash
curl http://localhost:5000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "Servidor offline-first rodando",
  "timestamp": "2025-11-07T23:00:00.000Z"
}
```

### Frontend

Abra: http://localhost

Deve ver:
- ✅ Formulário carregado
- ✅ Status: "Sistema online" (bolinha verde)

## 🐛 Problemas Comuns

### Porta 80 já está em uso

**Solução**: Edite `docker-compose.yml` e mude a porta:

```yaml
frontend:
  ports:
    - "8080:80"  # Usar porta 8080 no host
```

Acesse: http://localhost:8080

### Porta 5000 já está em uso

**Solução**: Edite `docker-compose.yml` e mude a porta:

```yaml
backend-local:
  ports:
    - "5001:5000"  # Usar porta 5001 no host
```

E atualize `frontend-web/js/script.js`:

```javascript
const API_URL = 'http://localhost:5001';
```

### Erro ao conectar com Supabase

**Verificar**:
1. Credenciais no `.env` estão corretas?
2. Tabela `leads` existe no Supabase?
3. RLS está configurado corretamente?

**Solução**: Execute novamente o `backend/supabase-setup.sql`

### Leads não sincronizam

**Verificar logs**:

```bash
docker-compose logs backend-local | findstr "sync"
```

**Causas comuns**:
- Sem conexão com internet
- Credenciais Supabase inválidas
- RLS bloqueando INSERT

## 📱 Testando em Dispositivos Móveis

1. Descubra seu IP local:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```

2. Acesse do celular: `http://SEU_IP:80`

3. Certifique-se de que o firewall permite conexões na porta 80

## 🎨 Personalizando o Frontend

### Alterar Cores

Edite `frontend-web/css/styles.css`:

```css
body {
    background: linear-gradient(135deg, #SEU_COR_1 0%, #SUA_COR_2 100%);
}
```

### Alterar Logo

Edite `frontend-web/index.html`:

```html
<h1 class="brand-title">Seu Nome</h1>
<p class="brand-subtitle">Seu Slogan</p>
```

### Adicionar Campos ao Formulário

1. Edite `frontend-web/index.html` (adicionar input)
2. Edite `frontend-web/js/script.js` (coletar dados)
3. Edite `backend/src-offline-first/models/leadModelLocal.js` (adicionar coluna)
4. Edite `backend/src-offline-first/models/leadModelSupabase.js` (enviar campo)
5. Adicione coluna no Supabase:
   ```sql
   ALTER TABLE leads ADD COLUMN novo_campo TEXT;
   ```

## 🚀 Deploy em Servidor

### 1. Copiar projeto para servidor

```bash
scp -r . usuario@servidor:/caminho/do/projeto
```

### 2. Conectar via SSH

```bash
ssh usuario@servidor
cd /caminho/do/projeto
```

### 3. Iniciar em background

```bash
docker-compose up -d
```

### 4. Configurar domínio (opcional)

Use nginx como proxy reverso:

```nginx
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:80;
    }

    location /api {
        proxy_pass http://localhost:5000; # Port standardized to 5000
    }
}
```

## 📊 Monitoramento em Produção

### Ver status dos containers

```bash
docker-compose ps
```

### Ver uso de recursos

```bash
docker stats
```

### Backup do banco local

```bash
# Criar backup
docker cp interativeleads-backend:/app/data/kiosk.db ./backup/kiosk-$(date +%Y%m%d).db

# Restaurar backup
docker cp ./backup/kiosk-20251107.db interativeleads-backend:/app/data/kiosk.db
docker-compose restart backend-local
```

## 🎉 Pronto!

Sua aplicação offline-first está rodando! 

**Próximos passos**:
- Personalize o frontend com sua marca
- Configure um domínio próprio
- Implemente autenticação para rotas admin
- Configure backups automáticos

**Dúvidas?** Consulte o `README_OFFLINE_FIRST.md` completo.

---

**Desenvolvido com ❤️ para totems resilientes**

