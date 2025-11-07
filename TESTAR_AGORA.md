# 🧪 Como Testar as Correções

## ⚡ Teste Rápido (2 minutos)

### **Passo 1: Feche tudo**
Se o app estiver rodando, **feche completamente** (Ctrl+C no terminal ou Alt+F4 no app).

---

### **Passo 2: Inicie novamente**
```bash
npm run electron:dev
```

**O que você deve ver no terminal:**
```
[ELECTRON] 🚀 Iniciando aplicação Electron...
[ELECTRON] ✅ Conectado ao banco de dados SQLite.
[ELECTRON] ✅ Tabelas verificadas/criadas com sucesso.
[ELECTRON] ℹ️  Banco já contém 1 tenant(s). Pulando inserção padrão.
[ELECTRON] ✅ IPC handlers configurados!
```

✅ **Se aparecer "Banco já contém 1 tenant(s)"** = **FUNCIONOU!**

---

### **Passo 3: Veja a tela do app**

Na janela do Electron, você deve ver:

```
┌─────────────────────────────────────┐
│   Selecione um Tenant               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏪 Tech Store SP            │   │
│  │ ID: loja_tech_sp_001        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

✅ **Se aparecer 1 tenant** = **SUCESSO TOTAL!** 🎉

---

### **Passo 4: Teste a persistência**

1. **Feche o app** (Ctrl+C ou Alt+F4)
2. **Abra novamente**: `npm run electron:dev`
3. **Verifique:** O tenant ainda deve estar lá!

✅ **Se o tenant permanecer** = **PERSISTÊNCIA FUNCIONANDO!** 🎉

---

## 🎮 Teste Completo (5 minutos)

### **Adicionar mais tenants:**

```bash
# 1. Com o app fechado, execute:
npm run seed

# Você verá:
# ✅ Inserido: "Tech Store São Paulo" (ID: loja_tech_sp_001)
#    Senha admin: 1234
# ✅ Inserido: "Tech Conference 2025" (ID: evento_tech_2025)
#    Senha admin: 2025
# ✅ Inserido: "Demo - Cliente Padrão" (ID: demo_padrao)
#    Senha admin: 0000

# 2. Inicie o app:
npm run electron:dev
```

**Agora você deve ver 3 tenants disponíveis!** 🎉

---

## 🐛 Troubleshooting

### ❌ Ainda mostra "Nenhum tenant encontrado"

**Verifique o console do Electron:**

```
[ELECTRON] 🔍 [BACKEND] get-all-tenants chamado
[ELECTRON] ✅ [BACKEND] Query executada. Encontrados 0 tenant(s)
[ELECTRON] ⚠️  [BACKEND] ATENÇÃO: Nenhum tenant encontrado no banco!
```

**Se aparecer "Encontrados 0 tenant(s)":**
```bash
npm run seed
```

---

### ❌ Erro no console do Browser

1. Abra o DevTools no Electron: **F12**
2. Vá na aba **Console**
3. Procure por erros em vermelho
4. Se houver erro tipo:
   ```
   ❌ Erro ao buscar tenants
   ```
   
   **Solução:**
   ```bash
   # Reinicie o app completamente
   # Ctrl+C e depois:
   npm run electron:dev
   ```

---

### ❌ Tenant aparece mas não entra

**Debug:**
1. Abra F12 (DevTools)
2. No Console, digite:
   ```javascript
   window.electronAPI.getTenant('loja_tech_sp_001')
     .then(console.log)
     .catch(console.error)
   ```
3. Deve retornar:
   ```json
   {
     "success": true,
     "data": {
       "tenant_id": "loja_tech_sp_001",
       "brand_name": "Tech Store SP",
       "theme": {...},
       "games_config": {...}
     }
   }
   ```

---

## 📊 Checklist de Validação

Execute esta checklist para garantir que tudo está funcionando:

- [ ] **App inicia sem erros**
- [ ] **Console mostra "Banco já contém X tenant(s)"**
- [ ] **Tela mostra pelo menos 1 tenant**
- [ ] **Consigo clicar no tenant e entrar**
- [ ] **Ao fechar e abrir, tenant permanece**
- [ ] **`npm run seed` adiciona mais tenants**
- [ ] **Após seed, vejo 3+ tenants na tela**
- [ ] **F12 não mostra erros em vermelho**

**Se todos os itens estiverem ✅ = SISTEMA 100% FUNCIONAL!** 🎉

---

## 🎯 Testes de Fluxo Completo

### **Teste 1: Criar Novo Tenant via Interface**

1. Inicie o app
2. Clique em "Criar Novo Tenant"
3. Preencha:
   - ID: `meu_teste_001`
   - Nome: `Meu Teste`
   - Senha: `9999`
4. Clique em "Criar"
5. Feche o app
6. Abra novamente
7. ✅ **Verificar:** Novo tenant deve aparecer!

---

### **Teste 2: Entrar e Usar o Sistema**

1. Selecione um tenant
2. Navegue pelas telas
3. Acesse o admin (⚙️ no canto)
4. Digite a senha (veja `SUCESSO_CORRECOES.txt`)
5. ✅ **Verificar:** Tudo deve funcionar normalmente

---

### **Teste 3: Resetar e Recriar**

```bash
# 1. Limpar tudo
npm run db:reset
# (Confirme com 's')

# 2. Recriar
npm run electron:dev
# (Aguarde abrir, depois feche)

# 3. Adicionar tenants
npm run seed

# 4. Usar
npm run electron:dev

# ✅ Deve ter 3 tenants
```

---

## 📝 Logs Esperados

### **Console do Electron (Terminal)**

```
[ELECTRON] 🚀 Iniciando aplicação Electron...
[ELECTRON] ⏳ Inicializando banco de dados...
[ELECTRON] 📂 Diretório de dados do usuário: C:\Users\...\InterativeLeads
[ELECTRON] 💾 Caminho do banco de dados: ...\interativeleads.db
[ELECTRON] ✅ Conectado ao banco de dados SQLite.
[ELECTRON] ✅ Tabelas verificadas/criadas com sucesso.
[ELECTRON] ℹ️  Banco já contém 1 tenant(s). Pulando inserção padrão.
[ELECTRON] 🎉 Banco de dados inicializado com sucesso.
[ELECTRON] 🔌 Registrando IPC handlers...
[ELECTRON] ✅ IPC handlers configurados!
[ELECTRON] 🪟 Criando janela principal...
[ELECTRON] ✅ Aplicação pronta!
```

### **Console do Browser (F12)**

```
🖥️ Rodando no Electron Desktop
Platform: win32
Electron: 39.x.x
🔍 [TenantService] listTenants chamado
✅ [TenantService] Retornando 1 tenant(s)
```

---

## 🎉 Sucesso!

Se você chegou até aqui e tudo está funcionando, **parabéns!**

O sistema multi-tenant está **100% operacional**! 🚀

---

**📚 Documentação:**
- `CORRECOES_APLICADAS.md` - Detalhes técnicos
- `GUIA_SEED_TENANTS.md` - Como usar seeds
- `SUCESSO_CORRECOES.txt` - Resumo visual

