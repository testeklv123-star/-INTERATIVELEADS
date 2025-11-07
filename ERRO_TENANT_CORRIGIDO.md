# ✅ Erro ao Carregar Tenant - CORRIGIDO!

## 🔴 Problema Identificado

O banco de dados SQLite estava **faltando campos obrigatórios** que o `TenantConfig` TypeScript espera.

### **Estrutura Esperada (TenantConfig):**
```typescript
interface TenantConfig {
  tenant_id: string;
  brand_name: string;
  theme: Theme;           // ✅ TINHA
  content: Content;       // ❌ FALTAVA!
  games_config: GamesConfig; // ✅ TINHA
  form_fields: FormFields;   // ❌ FALTAVA!
  behavior: Behavior;        // ❌ FALTAVA!
}
```

### **Estrutura no Banco (ANTES):**
```sql
CREATE TABLE tenants (
  tenant_id TEXT,
  brand_name TEXT,
  admin_password TEXT,
  theme TEXT,          -- ✅ OK
  games_config TEXT    -- ✅ OK
  -- ❌ content - FALTAVA
  -- ❌ form_fields - FALTAVA
  -- ❌ behavior - FALTAVA
);
```

**Resultado:** O frontend recebia um tenant **incompleto** e quebrava ao tentar acessar propriedades inexistentes.

---

## ✅ Correções Aplicadas

### **1. Estrutura do Banco Atualizada**

```sql
CREATE TABLE IF NOT EXISTS tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT UNIQUE NOT NULL,
  brand_name TEXT NOT NULL,
  admin_password TEXT NOT NULL,
  theme TEXT NOT NULL,
  content TEXT,           -- ✅ ADICIONADO
  games_config TEXT NOT NULL,
  form_fields TEXT,       -- ✅ ADICIONADO
  behavior TEXT,          -- ✅ ADICIONADO
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### **2. Tenant Padrão Completo**

Agora o tenant padrão inclui **TODOS os campos**:

```javascript
{
  tenant_id: 'loja_tech_sp_001',
  brand_name: 'Tech Store SP',
  admin_password: '1234',
  
  // ✅ Theme completo
  theme: {
    colors: { primary, secondary, accent, ... },
    typography: { font_primary, font_secondary, ... },
    logos: { main_logo_url, center_logo_url, watermark_url },
    spacing: { border_radius, padding_base }
  },
  
  // ✅ Content adicionado
  content: {
    welcome_title: 'Bem-vindo à Tech Store!',
    welcome_subtitle: 'Participe e ganhe prêmios incríveis',
    form_title: 'Cadastre-se para jogar',
    form_subtitle: 'Seus dados são seguros conosco',
    thank_you_message: 'Obrigado por participar!',
    privacy_notice: 'Ao participar, você aceita nossa política de privacidade.'
  },
  
  // ✅ Games config completo
  games_config: {
    enabled_games: ['prize_wheel'],
    prize_wheel: { prizes: [...] },
    scratch_card: { overlay_color, prizes: [] },
    quiz: { questions: [], prize_rules: [] }
  },
  
  // ✅ Form fields adicionado
  form_fields: {
    required: ['name', 'email', 'phone'],
    optional: [],
    custom_field: { enabled: false, label: '', type: 'text', options: [] }
  },
  
  // ✅ Behavior adicionado
  behavior: {
    inactivity_timeout: 30,
    auto_return_home: true,
    show_lead_count: false,
    collect_photo: false,
    admin_password: '1234'
  }
}
```

---

### **3. Handler get-tenant com Valores Padrão**

Adicionado **fallback robusto** para campos que possam não existir:

```javascript
ipcMain.handle('get-tenant', async (event, tenantId) => {
  const tenant = await getQuery('SELECT * FROM tenants WHERE tenant_id = ?', [tenantId]);
  
  const tenantData = {
    tenant_id: tenant.tenant_id,
    brand_name: tenant.brand_name,
    theme: JSON.parse(tenant.theme || '{}'),
    
    // ✅ Valores padrão se não existir
    content: tenant.content ? JSON.parse(tenant.content) : {
      welcome_title: 'Bem-vindo!',
      welcome_subtitle: 'Participe e ganhe prêmios',
      form_title: 'Cadastre-se',
      form_subtitle: 'Preencha seus dados',
      thank_you_message: 'Obrigado!',
      privacy_notice: 'Política de privacidade.'
    },
    
    games_config: JSON.parse(tenant.games_config || '{}'),
    
    // ✅ Valores padrão se não existir
    form_fields: tenant.form_fields ? JSON.parse(tenant.form_fields) : {
      required: ['name', 'email'],
      optional: ['phone'],
      custom_field: { enabled: false, label: '', type: 'text', options: [] }
    },
    
    // ✅ Valores padrão se não existir
    behavior: tenant.behavior ? JSON.parse(tenant.behavior) : {
      inactivity_timeout: 30,
      auto_return_home: true,
      show_lead_count: false,
      collect_photo: false,
      admin_password: tenant.admin_password || '1234'
    }
  };
  
  return { success: true, data: tenantData };
});
```

**Benefício:** Mesmo que o banco tenha dados antigos (sem os novos campos), o sistema funciona com valores padrão!

---

### **4. Handler save-tenant Atualizado**

```javascript
ipcMain.handle('save-tenant', async (event, config) => {
  const theme = JSON.stringify(config.theme);
  const content = JSON.stringify(config.content || {});      // ✅
  const gamesConfig = JSON.stringify(config.games_config);
  const formFields = JSON.stringify(config.form_fields || {}); // ✅
  const behavior = JSON.stringify(config.behavior || {});     // ✅
  
  await runQuery(
    'INSERT INTO tenants (..., content, form_fields, behavior) VALUES (...)',
    [..., content, formFields, behavior]
  );
});
```

---

### **5. Script de Seed Atualizado**

Todos os 3 tenants do seed agora incluem os campos completos:

```javascript
await runQuery(
  `INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, content, games_config, form_fields, behavior) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    tenant.tenant_id,
    tenant.brand_name,
    tenant.admin_password,
    JSON.stringify(tenant.theme),
    JSON.stringify(tenant.content),      // ✅
    JSON.stringify(tenant.games_config),
    JSON.stringify(tenant.form_fields),  // ✅
    JSON.stringify(tenant.behavior)      // ✅
  ]
);
```

---

## 🎯 Como Testar

### **Passo 1: Limpar banco antigo**

```bash
npm run db:reset
```

(Confirme com 's')

---

### **Passo 2: Iniciar o app**

```bash
npm run electron:dev
```

**Logs esperados:**
```
[ELECTRON] ✅ Conectado ao banco de dados SQLite.
[ELECTRON] ✅ Tabelas verificadas/criadas com sucesso.
[ELECTRON] 🎉 Tenant padrão "Tech Store SP" inserido com sucesso!
[ELECTRON]    ID: loja_tech_sp_001 | Senha: 1234
```

---

### **Passo 3: Selecionar tenant**

Na tela do app, clique em **"Tech Store SP"**

**Resultado:** ✅ **Deve carregar sem erro!**

---

### **Passo 4: Adicionar mais tenants (opcional)**

```bash
npm run seed
```

Agora você terá 3 tenants **completos** com todos os campos!

---

## 🐛 Debugging

### **Verificar estrutura retornada:**

No console do Browser (F12):

```javascript
window.electronAPI.getTenant('loja_tech_sp_001')
  .then(result => {
    console.log('✅ Tenant:', result);
    console.log('Has content?', !!result.data.content);
    console.log('Has form_fields?', !!result.data.form_fields);
    console.log('Has behavior?', !!result.data.behavior);
  });
```

**Deve retornar:**
```json
{
  "success": true,
  "data": {
    "tenant_id": "loja_tech_sp_001",
    "brand_name": "Tech Store SP",
    "theme": { ... },
    "content": {
      "welcome_title": "Bem-vindo à Tech Store!",
      "welcome_subtitle": "Participe e ganhe prêmios incríveis",
      ...
    },
    "games_config": { ... },
    "form_fields": {
      "required": ["name", "email", "phone"],
      "optional": [],
      ...
    },
    "behavior": {
      "inactivity_timeout": 30,
      "auto_return_home": true,
      ...
    }
  }
}
```

✅ **Todos os campos presentes!**

---

## 📊 Comparação

| Campo | ❌ Antes | ✅ Agora |
|-------|---------|----------|
| **tenant_id** | ✅ Sim | ✅ Sim |
| **brand_name** | ✅ Sim | ✅ Sim |
| **theme** | ✅ Sim (incompleto) | ✅ Sim (completo) |
| **content** | ❌ **NÃO** | ✅ **SIM** |
| **games_config** | ✅ Sim (básico) | ✅ Sim (completo) |
| **form_fields** | ❌ **NÃO** | ✅ **SIM** |
| **behavior** | ❌ **NÃO** | ✅ **SIM** |

---

## 🎉 Resultado

✅ **Banco de dados com estrutura completa**
✅ **Tenant padrão com todos os campos**
✅ **Handlers com fallback robusto**
✅ **Script de seed atualizado**
✅ **Compatibilidade com dados antigos** (fallback)

---

## 📝 Arquivos Modificados

```
✅ electron/database.js        - Estrutura do banco + tenant padrão
✅ electron/ipc-handlers.js    - Handlers get-tenant e save-tenant
✅ scripts/seed-tenants.js     - Script de seed completo
```

---

## 🚀 Próximos Passos

```bash
# 1. Limpar banco antigo (IMPORTANTE!)
npm run db:reset

# 2. Iniciar app (cria banco novo com estrutura correta)
npm run electron:dev

# 3. Você deve ver 1 tenant disponível
# 4. Clique nele - deve carregar SEM ERRO!

# 5. (Opcional) Adicionar mais tenants
npm run seed
```

---

**🎯 Problema resolvido! O erro ao carregar tenant foi causado por campos faltantes no banco de dados. Agora tudo está completo e funcional!** ✅

