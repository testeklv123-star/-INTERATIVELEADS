# 🐛 Debug: Tela Branca Após Selecionar Tenant

## 🎯 Problema

Após selecionar o tenant `loja_tech_sp_001`, a tela fica em branco.

---

## ✅ Correções Aplicadas

Adicionei **logs detalhados** em todo o fluxo de carregamento:

### **1. TenantSelectionScreen**
- Log quando tenant é selecionado
- Log do estado após carregar
- Log antes de navegar

### **2. TenantStore (loadTenant)**
- Log de cada etapa do carregamento
- Log da config recebida (validação de campos)
- Log após salvar no state

### **3. TenantService (loadTenantConfig)**
- Log de cada fonte tentada (Electron → API → Fallback)
- Log de sucesso/falha de cada fonte
- Log da estrutura do tenant carregado

---

## 🧪 Como Testar com Logs

### **Passo 1: Limpar e Recriar Banco**

```bash
npm run db:reset
```

(Digite 's' para confirmar)

---

### **Passo 2: Iniciar com DevTools Aberto**

```bash
npm run electron:dev
```

**IMPORTANTE:** Assim que o app abrir, pressione **F12** para abrir o DevTools **ANTES** de clicar no tenant!

---

### **Passo 3: Selecionar Tenant e Observar Logs**

Na tela do app, clique em **"Tech Store SP"**

**No Console (F12), você deve ver esta sequência:**

```
🔵 [TenantSelection] Tenant selecionado: loja_tech_sp_001
🔵 [TenantSelection] Carregando configuração...
🔄 [TenantStore] loadTenant iniciado para: loja_tech_sp_001
📡 [TenantStore] Chamando tenantService.loadTenantConfig...
🔍 [TenantService] loadTenantConfig chamado para: loja_tech_sp_001
📂 [TenantService] Tentando carregar do Electron...
📡 [Preload] IPC invoke: get-tenant loja_tech_sp_001
🔍 [BACKEND] get-tenant chamado para ID: loja_tech_sp_001
✅ [BACKEND] Tenant encontrado: Tech Store SP
✅ [TenantService] Tenant carregado do Electron: Tech Store SP
🔍 [TenantService] Validando estrutura: {
  hasTheme: true,
  hasContent: true,
  hasGamesConfig: true,
  hasFormFields: true,
  hasBehavior: true
}
✅ [TenantStore] Config recebida: {
  tenant_id: "loja_tech_sp_001",
  brand_name: "Tech Store SP",
  hasTheme: true,
  hasContent: true,
  hasGamesConfig: true,
  hasFormFields: true,
  hasBehavior: true
}
💾 [TenantStore] Salvando no state...
🎨 [TenantStore] Aplicando tema...
💽 [TenantStore] Persistindo tenant ativo...
🎉 [TenantStore] loadTenant concluído com sucesso!
✅ [TenantSelection] Tenant carregado com sucesso!
🔵 [TenantSelection] Estado após carregar: {
  isConfigured: true,
  hasTenantConfig: true,
  brandName: "Tech Store SP"
}
🔵 [TenantSelection] Navegando para /
🎯 [App] Estado atual: {
  isFirstRun: false,
  isConfigured: true,
  isLoading: false,
  _hasHydrated: true,
  hasTenantConfig: true,
  brandName: "Tech Store SP"
}
```

---

## 🔍 Análise dos Logs

### **✅ Se todos os logs aparecerem:**

**Significado:** O tenant está carregando corretamente!

**Próximo passo:** Verificar se há erro no **AttractScreen**

No console, procure por:
```
❌ Erro em AttractScreen
❌ Cannot read property 'X' of undefined
```

---

### **❌ Se parar em algum ponto:**

#### **Cenário 1: Para em "Tentando carregar do Electron"**

**Log:**
```
📂 [TenantService] Tentando carregar do Electron...
⚠️ [TenantService] Tenant não encontrado no Electron
```

**Problema:** Banco vazio ou tenant não existe

**Solução:**
```bash
npm run seed
```

---

#### **Cenário 2: Erro ao buscar tenant**

**Log:**
```
❌ [BACKEND] Erro ao buscar tenant: ...
```

**Problema:** Estrutura do banco ou parsing JSON

**Solução:** Me envie o log completo do erro

---

#### **Cenário 3: Carrega mas isConfigured = false**

**Log:**
```
🔵 [TenantSelection] Estado após carregar: {
  isConfigured: false,  ← PROBLEMA AQUI
  hasTenantConfig: true,
  brandName: "Tech Store SP"
}
```

**Problema:** O `set()` do Zustand não está atualizando

**Possível causa:** Persistência do localStorage conflitando

**Solução:**
```javascript
// No console (F12):
localStorage.clear();
location.reload();
```

---

## 🎯 Pontos de Verificação

### **1. Banco de Dados**

Abra o banco manualmente:
- Caminho: `%APPDATA%\InterativeLeads\interativeleads.db`
- Ferramenta: [DB Browser for SQLite](https://sqlitebrowser.org/)
- Verificar: Se a tabela `tenants` tem 1 registro
- Verificar: Se todos os campos JSON estão preenchidos

---

### **2. LocalStorage**

No console (F12):
```javascript
// Ver o que está salvo
console.log(localStorage.getItem('tenant-storage'));

// Se estiver vazio ou inválido, limpar:
localStorage.clear();
location.reload();
```

---

### **3. Estado do Zustand**

No console (F12):
```javascript
// Ver estado completo
import { useTenantStore } from './stores/tenantStore';
console.log(useTenantStore.getState());

// Deve retornar:
{
  tenantConfig: { tenant_id: "...", brand_name: "...", ... },
  isConfigured: true,  ← DEVE SER TRUE
  isLoading: false,
  error: null,
  _hasHydrated: true
}
```

---

## 🔧 Testes Manuais

### **Teste 1: Carregar tenant manualmente**

No console (F12):
```javascript
await window.electronAPI.getTenant('loja_tech_sp_001')
  .then(result => {
    console.log('✅ Resultado:', result);
    console.log('Has data?', !!result.data);
    console.log('All fields?', {
      theme: !!result.data?.theme,
      content: !!result.data?.content,
      games_config: !!result.data?.games_config,
      form_fields: !!result.data?.form_fields,
      behavior: !!result.data?.behavior
    });
  });
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "tenant_id": "loja_tech_sp_001",
    "brand_name": "Tech Store SP",
    "theme": {...},
    "content": {...},
    "games_config": {...},
    "form_fields": {...},
    "behavior": {...}
  }
}
```

---

### **Teste 2: Verificar roteamento**

No console (F12):
```javascript
import { useNavigate } from 'react-router-dom';
console.log(window.location.pathname);

// Deve ser "/" após selecionar tenant
```

---

## 📊 Checklist de Debugging

Execute esta checklist em ordem:

- [ ] **DevTools aberto antes de clicar no tenant**
- [ ] **Todos os logs aparecem no console**
- [ ] **Nenhum erro vermelho no console**
- [ ] **isConfigured = true após carregar**
- [ ] **hasTenantConfig = true após carregar**
- [ ] **brandName aparece corretamente**
- [ ] **Navegação vai para "/" (não fica em /tenant-selection)**
- [ ] **App.tsx detecta isConfigured = true**
- [ ] **AttractScreen renderiza (sem erros)**

---

## 🎯 Próximos Passos

### **Se TODOS os logs aparecerem mas a tela ainda estiver branca:**

1. Verifique se há erro no **AttractScreen**:
   ```
   ❌ Cannot read property 'content' of undefined
   ❌ Cannot read property 'welcome_title' of undefined
   ```

2. Teste o AttractScreen manualmente:
   ```javascript
   // No console (F12):
   const store = require('./stores/tenantStore').useTenantStore;
   console.log('TenantConfig:', store.getState().tenantConfig);
   console.log('Content:', store.getState().tenantConfig?.content);
   ```

---

## 🆘 Se Ainda Não Funcionar

Me envie:

1. **Screenshot dos logs do console (F12)**
2. **Screenshot da tela em branco**
3. **Output de:**
   ```javascript
   console.log(localStorage.getItem('tenant-storage'));
   console.log(useTenantStore.getState());
   ```

---

**🚀 Teste agora com o DevTools aberto (F12) e me envie os logs!**

