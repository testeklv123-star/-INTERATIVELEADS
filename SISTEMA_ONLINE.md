# 🌐 Sistema de Gerenciamento Online de Tenants

**InterativeLeads Desktop v1.0.0**

Sistema para criar e gerenciar perfis de lojas/clientes remotamente, validados mesmo com o app instalado.

---

## 📋 Visão Geral

O InterativeLeads agora suporta **dois modos de operação:**

### **Modo 1: Local/Mock** (Padrão)
- ✅ Funciona offline
- ✅ Tenants pré-configurados no código
- ✅ Ideal para testes e desenvolvimento
- ❌ Requer recompilação para adicionar novos tenants

### **Modo 2: Online/Híbrido** (Novo!)
- ✅ Tenants carregados de API REST
- ✅ Atualização em tempo real
- ✅ Gerenciamento via painel web
- ✅ Fallback automático para modo local
- ✅ Funciona offline após primeiro carregamento

---

## 🏗️ Arquitetura

```
┌─────────────────────┐
│   Painel Web Admin  │  ← Você cria/edita tenants aqui
│   (React/Next.js)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   API REST          │  ← Backend (Node.js/Express/etc)
│   /api/tenants      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Banco de Dados    │  ← MongoDB/PostgreSQL/MySQL
│   (tenants)         │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│ App Electron        │  ← Busca config do servidor
│ (Totem)             │     Fallback para local
└─────────────────────┘
```

---

## 🚀 Configuração Rápida

### **Passo 1: Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL da sua API
REACT_APP_API_URL=https://sua-api.com/api

# Chave de API (para autenticação)
REACT_APP_API_KEY=sua-chave-secreta-aqui

# Modo de operação (hybrid, online, local)
REACT_APP_TENANT_MODE=hybrid
```

### **Passo 2: Usar API de Exemplo (Desenvolvimento)**

Para testes rápidos, você pode usar serviços gratuitos:

#### **Opção A: JSON Server (Local)**
```bash
# Instalar JSON Server
npm install -g json-server

# Criar arquivo db.json
echo '{"tenants": []}' > db.json

# Rodar servidor
json-server --watch db.json --port 5000
```

Depois configure:
```env
REACT_APP_API_URL=http://localhost:5000
```

#### **Opção B: Firebase (Gratuito)**
```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2noDRV51booHWgU0E984idWo7sl76TSI", // Use a chave fornecida!
  projectId: "seu-projeto",
  // ... outras configs
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

#### **Opção C: Supabase (Gratuito)**
```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_KEY=sua-chave-anon
```

---

## 📊 Estrutura da API

### **Endpoints Necessários:**

#### **GET /api/tenants/:id**
Buscar um tenant específico

**Request:**
```http
GET /api/tenants/loja_tech_sp_001
Authorization: Bearer sua-chave-api
```

**Response:**
```json
{
  "tenant_id": "loja_tech_sp_001",
  "brand_name": "Tech Store São Paulo",
  "active": true,
  "theme": { ... },
  "games_config": { ... },
  "form_fields": { ... },
  "behavior": { ... }
}
```

#### **GET /api/tenants/:id/validate**
Validar se tenant existe e está ativo

**Response:**
```json
{
  "valid": true,
  "active": true,
  "tenant_id": "loja_tech_sp_001"
}
```

#### **GET /api/tenants**
Listar todos os tenants

**Response:**
```json
[
  {
    "id": "loja_tech_sp_001",
    "name": "Tech Store São Paulo",
    "active": true
  },
  {
    "id": "evento_tech_2025",
    "name": "Tech Conference 2025",
    "active": true
  }
]
```

#### **POST /api/tenants**
Criar novo tenant

**Request:**
```json
{
  "tenant_id": "nova_loja_001",
  "brand_name": "Nova Loja",
  "theme": { ... },
  "games_config": { ... }
}
```

#### **PUT /api/tenants/:id**
Atualizar tenant

**Request:**
```json
{
  "theme": {
    "colors": {
      "primary": "#FF0000"
    }
  }
}
```

#### **DELETE /api/tenants/:id**
Deletar tenant

#### **GET /api/health**
Verificar status da API

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

## 💻 Exemplo de Backend (Node.js + Express)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (token === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Não autorizado' });
  }
};

// Banco de dados simulado (use MongoDB/PostgreSQL em produção)
let tenants = [
  {
    tenant_id: 'loja_tech_sp_001',
    brand_name: 'Tech Store São Paulo',
    active: true,
    // ... resto da config
  }
];

// Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.get('/api/tenants', authMiddleware, (req, res) => {
  res.json(tenants.map(t => ({
    id: t.tenant_id,
    name: t.brand_name,
    active: t.active
  })));
});

app.get('/api/tenants/:id', authMiddleware, (req, res) => {
  const tenant = tenants.find(t => t.tenant_id === req.params.id);
  if (tenant) {
    res.json(tenant);
  } else {
    res.status(404).json({ error: 'Tenant não encontrado' });
  }
});

app.get('/api/tenants/:id/validate', authMiddleware, (req, res) => {
  const tenant = tenants.find(t => t.tenant_id === req.params.id);
  res.json({
    valid: !!tenant,
    active: tenant?.active || false,
    tenant_id: req.params.id
  });
});

app.post('/api/tenants', authMiddleware, (req, res) => {
  const newTenant = req.body;
  tenants.push(newTenant);
  res.status(201).json(newTenant);
});

app.put('/api/tenants/:id', authMiddleware, (req, res) => {
  const index = tenants.findIndex(t => t.tenant_id === req.params.id);
  if (index !== -1) {
    tenants[index] = { ...tenants[index], ...req.body };
    res.json(tenants[index]);
  } else {
    res.status(404).json({ error: 'Tenant não encontrado' });
  }
});

app.delete('/api/tenants/:id', authMiddleware, (req, res) => {
  tenants = tenants.filter(t => t.tenant_id !== req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
```

---

## 🎨 Painel Web de Gerenciamento

Crie um painel web simples para gerenciar tenants:

```html
<!-- admin-panel.html -->
<!DOCTYPE html>
<html>
<head>
  <title>InterativeLeads - Painel Admin</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .tenant-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
    button { padding: 10px 20px; margin: 5px; cursor: pointer; }
    input, textarea { width: 100%; padding: 8px; margin: 5px 0; }
  </style>
</head>
<body>
  <h1>🎮 InterativeLeads - Gerenciar Tenants</h1>
  
  <div id="tenants-list"></div>
  
  <hr>
  
  <h2>Adicionar Novo Tenant</h2>
  <form id="add-tenant-form">
    <input id="tenant-id" placeholder="ID do Tenant (ex: loja_xyz_001)" required>
    <input id="brand-name" placeholder="Nome da Marca" required>
    <button type="submit">Adicionar</button>
  </form>

  <script>
    const API_URL = 'http://localhost:5000/api';
    const API_KEY = 'sua-chave-api';

    // Carregar tenants
    async function loadTenants() {
      const response = await fetch(`${API_URL}/tenants`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      const tenants = await response.json();
      
      const list = document.getElementById('tenants-list');
      list.innerHTML = tenants.map(t => `
        <div class="tenant-card">
          <h3>${t.name}</h3>
          <p>ID: ${t.id}</p>
          <p>Status: ${t.active ? '✅ Ativo' : '❌ Inativo'}</p>
          <button onclick="editTenant('${t.id}')">Editar</button>
          <button onclick="deleteTenant('${t.id}')">Deletar</button>
        </div>
      `).join('');
    }

    // Adicionar tenant
    document.getElementById('add-tenant-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const tenantId = document.getElementById('tenant-id').value;
      const brandName = document.getElementById('brand-name').value;
      
      await fetch(`${API_URL}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          brand_name: brandName,
          active: true,
          // ... resto da config
        })
      });
      
      alert('Tenant adicionado!');
      loadTenants();
    });

    // Deletar tenant
    async function deleteTenant(id) {
      if (confirm(`Deletar tenant ${id}?`)) {
        await fetch(`${API_URL}/tenants/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        loadTenants();
      }
    }

    // Carregar ao iniciar
    loadTenants();
  </script>
</body>
</html>
```

---

## 🔄 Fluxo de Funcionamento

### **Quando o App Inicia:**

1. Usuário digita o Tenant ID no setup
2. App tenta conectar à API online
3. **Se API disponível:**
   - Busca configuração do servidor
   - Valida tenant
   - Salva no SQLite local
   - Usa configuração online
4. **Se API indisponível:**
   - Busca do SQLite local (se já existe)
   - Ou usa configuração mock
   - Continua funcionando offline

### **Sincronização:**

- App verifica API a cada 24h
- Atualiza configurações automaticamente
- Notifica admin se houver mudanças

---

## 📱 Atualizando Configuração Remotamente

### **Cenário:**
Você tem 10 totens instalados e quer mudar a cor do tema de todos.

### **Solução:**
1. Acesse o painel web admin
2. Edite o tenant
3. Mude a cor primária
4. Salve

**Resultado:**
- Totens online: Atualizam imediatamente
- Totens offline: Atualizam na próxima conexão
- Não precisa reinstalar nada!

---

## 🔐 Segurança

### **Recomendações:**

✅ **Use HTTPS** em produção  
✅ **Autenticação JWT** ao invés de API key simples  
✅ **Rate limiting** para prevenir abuso  
✅ **Validação de dados** no backend  
✅ **Criptografia** de dados sensíveis  
✅ **Backups** regulares do banco  

---

## 📊 Banco de Dados Sugerido

### **MongoDB (Exemplo):**

```javascript
// Tenant Schema
{
  _id: ObjectId,
  tenant_id: String (unique, indexed),
  brand_name: String,
  active: Boolean,
  created_at: Date,
  updated_at: Date,
  theme: Object,
  games_config: Object,
  form_fields: Object,
  behavior: Object,
  stats: {
    total_leads: Number,
    last_sync: Date
  }
}
```

---

## 🎯 Próximos Passos

### **Para Começar:**

1. **Configure a API:**
   ```bash
   # Usar JSON Server para testes
   npm install -g json-server
   json-server --watch db.json --port 5000
   ```

2. **Configure o .env:**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_API_KEY=teste123
   ```

3. **Rebuild o app:**
   ```bash
   npm run electron:build:win
   ```

4. **Teste:**
   - Execute o app
   - Digite um tenant ID
   - Veja nos logs se está buscando da API

---

## 📚 Recursos Adicionais

- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [JSON Server](https://github.com/typicode/json-server)
- [Express.js](https://expressjs.com/)

---

<div align="center">

**🌐 Sistema Online Configurado!**

Agora você pode gerenciar todos os seus totens remotamente!

</div>

