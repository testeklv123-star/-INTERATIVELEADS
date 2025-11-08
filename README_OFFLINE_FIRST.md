# 🚀 InterativeLeads - Sistema Offline-First para Totems

## 📋 Visão Geral

Este projeto foi refatorado para implementar uma **arquitetura offline-first** robusta, ideal para totems e quiosques interativos. O sistema captura leads localmente em um banco SQLite e sincroniza automaticamente com um banco de dados central Supabase quando há conexão disponível.

## 🎯 Características Principais

✅ **Captura Offline**: Leads são salvos localmente mesmo sem internet  
✅ **Sincronização Automática**: Job agendado sincroniza a cada 30 segundos  
✅ **Arquitetura MVC**: Backend organizado e profissional  
✅ **Docker Ready**: Deploy com um único comando  
✅ **Feedback UX Aprimorado**: Mensagens claras para o usuário  
✅ **Persistência de Dados**: SQLite local com sincronização Supabase  

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    TOTEM (Frontend Web)                     │
│                    Nginx + HTML/CSS/JS                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST /api/leads
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Offline-First (Node.js)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers → Services → Models                     │   │
│  │  • leadController.js                                 │   │
│  │  • syncService.js (node-cron)                       │   │
│  │  • leadModelLocal.js (SQLite)                       │   │
│  │  • leadModelSupabase.js (Supabase)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────┐         ┌──────────────────────┐
│  SQLite Local    │         │  Supabase (Cloud)    │
│  (kiosk.db)      │  sync   │  PostgreSQL          │
│  • PENDING       │ ──────> │  • leads table       │
│  • SYNCED        │         │  • RLS policies      │
│  • ERROR         │         └──────────────────────┘
└──────────────────┘
```

## 📁 Estrutura do Projeto

```
white-label-totem-application/
├── backend/
│   ├── src-offline-first/           # Novo backend offline-first
│   │   ├── config/
│   │   │   ├── databaseLocal.js     # Configuração SQLite
│   │   │   └── supabaseClient.js    # Cliente Supabase
│   │   ├── controllers/
│   │   │   └── leadController.js    # Lógica de requisições
│   │   ├── models/
│   │   │   ├── leadModelLocal.js    # Model SQLite
│   │   │   └── leadModelSupabase.js # Model Supabase
│   │   ├── routes/
│   │   │   ├── leadRoutes.js        # Rotas de leads
│   │   │   └── syncRoutes.js        # Rotas de sync
│   │   ├── services/
│   │   │   └── syncService.js       # Serviço de sincronização
│   │   └── server.js                # Servidor Express
│   ├── data/                        # Banco SQLite (persistido)
│   ├── Dockerfile                   # Docker do backend
│   ├── .env                         # Variáveis de ambiente
│   └── .env.example                 # Template de variáveis
│
├── frontend-web/                    # Frontend web standalone
│   ├── css/
│   │   └── styles.css               # Estilos do totem
│   ├── js/
│   │   └── script.js                # Lógica do formulário
│   ├── index.html                   # Página principal
│   ├── nginx.conf                   # Configuração nginx
│   └── Dockerfile                   # Docker do frontend
│
├── docker-compose.yml               # Orquestração dos containers
└── README_OFFLINE_FIRST.md          # Esta documentação
```

## 🔧 Configuração do Supabase

### Passo 1: Executar SQL no Supabase

Acesse o [SQL Editor do Supabase](https://rtodbbiugsrhupmyarut.supabase.co) e execute:

```sql
-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT com anon key
CREATE POLICY "Permitir INSERT de leads para usuários anônimos"
ON leads FOR INSERT TO anon WITH CHECK (true);
```

### Passo 2: Verificar Credenciais

As credenciais já estão configuradas no `.env`:

- **URL**: `https://rtodbbiugsrhupmyarut.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 Como Executar

### Opção 1: Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up --build
```

Pronto! A aplicação estará disponível em:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Opção 2: Desenvolvimento Local

#### Backend:

```bash
cd backend
npm install
npm run offline:dev
```

#### Frontend:

Abra `frontend-web/index.html` em um navegador ou use um servidor local:

```bash
cd frontend-web
npx serve .
```

## 📊 Endpoints da API

### POST /api/leads
Cria um novo lead no banco local.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "(11) 98765-4321"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Lead salvo localmente. Será sincronizado em instantes.",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321",
    "created_at": "2025-11-07T23:00:00.000Z",
    "sync_status": "PENDING"
  }
}
```

### GET /api/leads
Lista todos os leads (admin/debug).

**Response:**
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "stats": {
      "PENDING": 5,
      "SYNCED": 120,
      "ERROR": 2
    }
  }
}
```

### GET /api/leads/stats
Retorna estatísticas de sincronização.

### GET /api/sync/stats
Retorna estatísticas detalhadas do serviço de sincronização.

### POST /api/sync/trigger
Dispara sincronização manual.

### GET /health
Health check do servidor.

## 🔄 Como Funciona a Sincronização

1. **Captura Local**: Lead é salvo no SQLite com `sync_status = 'PENDING'`
2. **Job Agendado**: A cada 30 segundos, o `syncService` executa
3. **Verificação de Conexão**: Testa conexão com Supabase
4. **Sincronização**: 
   - Busca leads com status `PENDING`
   - Tenta inserir no Supabase
   - **Sucesso**: Atualiza para `SYNCED` + timestamp
   - **Erro**: Atualiza para `ERROR` + mensagem de erro
5. **Retry**: Leads com erro serão tentados novamente na próxima execução

## 🗃️ Esquema do Banco SQLite Local

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sync_status TEXT DEFAULT 'PENDING',  -- PENDING | SYNCED | ERROR
  synced_at DATETIME,
  error_message TEXT
);
```

## 🎨 Melhorias de UX no Frontend

✅ **Mensagens Claras**: 
- Sucesso: "Obrigado! Seus dados foram salvos localmente e serão sincronizados em instantes."
- Erro: "Ocorreu uma falha ao salvar seus dados. Por favor, tente novamente."

✅ **Indicador de Status**: 
- 🟢 Online: Sistema conectado
- 🔴 Offline: Dados salvos localmente

✅ **Validação em Tempo Real**: Feedback imediato de erros

✅ **Loading States**: Botão desabilitado durante envio

✅ **Animações Suaves**: Transições e feedbacks visuais

## 🔒 Segurança

- ✅ **RLS no Supabase**: Row Level Security configurado
- ✅ **Anon Key**: Chave pública para INSERT apenas
- ✅ **Validação de Dados**: Backend valida todos os inputs
- ✅ **CORS**: Configurado para aceitar requisições do frontend
- ✅ **Helmet.js**: Headers de segurança (se necessário)

## 📝 Variáveis de Ambiente

Arquivo `.env` no backend:

```env
# Configuração do Supabase
SUPABASE_URL=https://rtodbbiugsrhupmyarut.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Porta do servidor local
PORT=5000

# Intervalo de sincronização (em segundos)
SYNC_INTERVAL_SECONDS=30
```

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar logs
docker-compose logs backend-local

# Verificar se a porta 3001 está livre
netstat -ano | findstr :3001
```

### Sincronização não funciona

```bash
# Verificar logs de sincronização
docker-compose logs -f backend-local | grep "🔄"

# Testar conexão com Supabase
curl http://localhost:3001/api/sync/stats
```

### Frontend não conecta ao backend

1. Verificar se o backend está rodando: `http://localhost:3001/health`
2. Verificar CORS no backend
3. Verificar URL da API no `frontend-web/js/script.js`

## 📦 Persistência de Dados

O banco SQLite é persistido em um volume Docker:

```yaml
volumes:
  - ./backend/data:/app/data
```

Isso garante que os dados não sejam perdidos ao reiniciar os containers.

## 🚢 Deploy em Produção

### 1. Configurar Variáveis de Ambiente

Edite o `docker-compose.yml` ou use um arquivo `.env`:

```env
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_aqui
```

### 2. Executar em Background

```bash
docker-compose up -d
```

### 3. Monitorar Logs

```bash
docker-compose logs -f
```

### 4. Backup do Banco Local

```bash
# Copiar banco SQLite
docker cp interativeleads-backend:/app/data/kiosk.db ./backup/
```

## 📈 Monitoramento

### Verificar Status

```bash
# Status dos containers
docker-compose ps

# Estatísticas de sincronização
curl http://localhost:3001/api/sync/stats

# Estatísticas de leads
curl http://localhost:3001/api/leads/stats
```

### Logs em Tempo Real

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend-local

# Apenas frontend
docker-compose logs -f frontend
```

## 🎯 Próximos Passos

- [ ] Implementar autenticação para rotas admin
- [ ] Adicionar dashboard de monitoramento
- [ ] Implementar retry exponencial para sincronização
- [ ] Adicionar métricas com Prometheus
- [ ] Implementar backup automático do SQLite
- [ ] Adicionar testes unitários e de integração

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `docker-compose logs`
2. Consulte a documentação do Supabase
3. Verifique a seção de Troubleshooting acima

## 📄 Licença

Este projeto é parte do InterativeLeads White-Label Totem Application.

---

**Desenvolvido com ❤️ para totems resilientes e offline-first**

