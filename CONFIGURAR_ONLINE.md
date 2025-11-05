# 🌐 Como Configurar o Modo Online - Passo a Passo

**InterativeLeads Desktop v1.0.1**

---

## 🚀 Início Rápido (3 minutos)

### **Passo 1: Instalar JSON Server**

```bash
npm install -g json-server
```

**OU se preferir local no projeto:**
```bash
npm install json-server --save-dev
```

### **Passo 2: Iniciar o Servidor**

#### **Opção A: Usando o script .bat (Windows)**
```bash
# Clique duplo em:
server\start-server.bat
```

#### **Opção B: Comando manual**
```bash
cd server
json-server --watch db.json --port 5000 --host 0.0.0.0
```

**Resultado:**
```
✔ JSON Server is running on port 5000
Resources:
  http://localhost:5000/tenants

Home:
  http://localhost:5000
```

### **Passo 3: Configurar o App**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API REST
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_KEY=teste123
REACT_APP_TENANT_MODE=hybrid

# Google API (já fornecida)
REACT_APP_GOOGLE_API_KEY=AIzaSyD2noDRV51booHWgU0E984idWo7sl76TSI

# Debug
REACT_APP_DEBUG=true
```

### **Passo 4: Rebuild o App**

```bash
npm run build
```

### **Passo 5: Testar!**

```bash
# Rodar em modo dev
npm run electron:dev
```

**Ao iniciar:**
1. Digite o Tenant ID: `teste_online_001`
2. Veja nos logs: `✅ [Hybrid] Configuração carregada do servidor online`
3. O título será: **"🌐 MODO ONLINE FUNCIONANDO!"**

---

## 📊 Tenants Disponíveis no Servidor

| Tenant ID | Nome | Senha Admin | Observação |
|-----------|------|-------------|------------|
| `loja_tech_sp_001` | Tech Store São Paulo | 1234 | Título diz "(ONLINE)" |
| `evento_tech_2025` | Tech Conference 2025 | 2025 | Título diz "(ONLINE)" |
| `teste_online_001` | Loja Teste Online | 1234 | **Novo! Para testes** |

---

## 🔍 Verificar se Está Funcionando

### **1. Testar API diretamente:**

```bash
# Listar todos os tenants
curl http://localhost:5000/tenants

# Buscar tenant específico
curl http://localhost:5000/tenants/teste_online_001

# Via navegador
http://localhost:5000/tenants
```

### **2. Ver logs do App:**

Abra o DevTools (Ctrl+Shift+I) e procure:

```
🔀 [Hybrid] Tentando buscar tenant do servidor online...
✅ [Hybrid] API online disponível, buscando configuração...
✅ [Hybrid] Configuração carregada do servidor online
```

### **3. Verificar tela inicial:**

Se o título tiver **(ONLINE)** ou **🌐 MODO ONLINE**, funcionou!

---

## 🎨 Adicionar Novo Tenant no Servidor

### **Método 1: Editar db.json**

```json
{
  "tenants": [
    // ... tenants existentes ...
    {
      "tenant_id": "minha_loja_001",
      "brand_name": "Minha Loja",
      "active": true,
      "theme": { /* ... */ },
      "content": {
        "welcome_title": "Bem-vindo à Minha Loja!",
        // ...
      },
      // ... resto da config
    }
  ]
}
```

**Reinicie o servidor** após editar!

### **Método 2: Via API POST**

```bash
curl -X POST http://localhost:5000/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "nova_loja_001",
    "brand_name": "Nova Loja",
    "active": true,
    ...
  }'
```

### **Método 3: Via Postman/Insomnia**

1. **POST** `http://localhost:5000/tenants`
2. Body: JSON com a configuração
3. Send

---

## 🔄 Testar Modo Híbrido

### **Teste 1: Online → Offline**

```bash
1. Servidor ON + App rodando
2. Digite: teste_online_001
3. Veja título: "🌐 MODO ONLINE FUNCIONANDO!"
4. PARE o servidor (Ctrl+C)
5. Feche e reabra o app
6. Digite: teste_online_001 novamente
7. App deve funcionar com dados locais salvos!
```

### **Teste 2: Atualizar Remotamente**

```bash
1. App rodando com tenant configurado
2. Edite db.json:
   - Mude "welcome_title" para outro texto
3. Salve (servidor recarrega automaticamente)
4. Feche e reabra o app
5. Nova configuração é carregada!
```

---

## 🌍 Usar Servidor Real (Produção)

### **Opção 1: Heroku (Gratuito)**

```bash
# 1. Criar conta no Heroku
# 2. Instalar Heroku CLI
heroku login

# 3. Criar app
heroku create meu-interativeleads-api

# 4. Deploy
git push heroku main

# 5. URL: https://meu-interativeleads-api.herokuapp.com
```

**Configure no .env.local:**
```env
REACT_APP_API_URL=https://meu-interativeleads-api.herokuapp.com
```

### **Opção 2: Firebase**

```javascript
// Use Firestore Database
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();
const docRef = doc(db, 'tenants', tenantId);
const docSnap = await getDoc(docRef);
```

### **Opção 3: Supabase**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'sua-chave-anon'
);

const { data } = await supabase
  .from('tenants')
  .select('*')
  .eq('tenant_id', tenantId)
  .single();
```

---

## 🐛 Troubleshooting

### **Erro: "json-server: command not found"**

```bash
# Instalar globalmente
npm install -g json-server

# OU usar via npx
npx json-server --watch server/db.json --port 5000
```

### **Erro: "Porta 5000 em uso"**

```bash
# Usar outra porta
json-server --watch server/db.json --port 5001

# Atualizar .env.local
REACT_APP_API_URL=http://localhost:5001
```

### **App não conecta ao servidor**

1. **Verificar se servidor está rodando:**
   ```bash
   curl http://localhost:5000/tenants
   ```

2. **Verificar .env.local:**
   - Deve estar na **raiz** do projeto
   - Nome correto: `.env.local` (não `.env`)

3. **Rebuild:**
   ```bash
   npm run build
   npm run electron:dev
   ```

### **App sempre usa dados locais**

1. **Ver logs** para identificar o problema
2. **Verificar URL da API** no .env.local
3. **Testar API diretamente** no navegador
4. **Rebuild** após qualquer mudança no .env.local

---

## 📊 Monitorar Requisições

### **Ver logs do JSON Server:**

O servidor mostra todas as requisições:

```
GET /tenants/teste_online_001 200 15.234 ms - 2534
POST /tenants 201 8.123 ms - 2534
```

### **Ver logs do App:**

```javascript
// No console do Electron
🔀 [Hybrid] Tentando buscar tenant do servidor online...
🌐 [Online API] Buscando tenant: teste_online_001
✅ [Online API] Tenant carregado: Loja Teste Online
✅ [Hybrid] Configuração carregada do servidor online
```

---

## 🎯 Fluxo Completo

```
┌─────────────────────┐
│ 1. Servidor Rodando │
│ json-server:5000    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 2. .env.local       │
│ API_URL=localhost   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 3. npm run build    │
│ (Rebuild com config)│
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 4. electron:dev     │
│ (Testar)            │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ 5. Digite tenant ID │
│ teste_online_001    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ ✅ Funcionando!     │
│ Modo Online Ativo   │
└─────────────────────┘
```

---

## ✅ Checklist

Antes de testar:

- [ ] JSON Server instalado (`npm install -g json-server`)
- [ ] Servidor rodando (`server/start-server.bat`)
- [ ] API respondendo (`curl http://localhost:5000/tenants`)
- [ ] .env.local criado na raiz
- [ ] .env.local com URL correta
- [ ] App rebuilded (`npm run build`)
- [ ] Logs do servidor visíveis
- [ ] DevTools aberto no app

---

## 🎉 Pronto!

Agora você tem:

✅ Servidor de teste local  
✅ 3 tenants pré-configurados  
✅ Modo híbrido funcionando  
✅ Validação online ativa  

**Teste agora:**

```bash
# Terminal 1: Servidor
cd server
json-server --watch db.json --port 5000

# Terminal 2: App
npm run electron:dev
```

**Digite:** `teste_online_001`

**Resultado:** 🌐 **MODO ONLINE FUNCIONANDO!**

---

<div align="center">

**🌐 Sistema Online Configurado!**

Servidor de Teste + App Funcionando!

</div>

