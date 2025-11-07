# 🌱 Guia de Seed de Tenants - InterativeLeads

## 📋 Problema

Ao executar o aplicativo, você vê:

```
Selecione um Tenant
Nenhum tenant encontrado
Não há tenants disponíveis para seleção.
```

## ✅ Solução Rápida (3 Passos)

### **Passo 1: Execute o Electron uma vez**

Isso cria o banco de dados vazio:

```bash
npm run electron:dev
```

Aguarde o aplicativo abrir (mesmo que mostre "nenhum tenant"). Depois **feche** o aplicativo.

---

### **Passo 2: Execute o script de seed**

Isso popula o banco com 3 tenants de teste:

```bash
npm run seed
```

Você verá algo como:

```
🌱 SEED DE TENANTS - InterativeLeads
═══════════════════════════════════════

📂 Caminho do banco: C:\Users\User\AppData\Roaming\InterativeLeads\interativeleads.db
✅ Conectado ao banco de dados

📊 Tenants existentes: 0
✅ Inserido: "Tech Store São Paulo" (ID: loja_tech_sp_001)
   Senha admin: 1234
✅ Inserido: "Tech Conference 2025" (ID: evento_tech_2025)
   Senha admin: 2025
✅ Inserido: "Demo - Cliente Padrão" (ID: demo_padrao)
   Senha admin: 0000

═══════════════════════════════════════
📊 RESUMO:
   ✅ Inseridos: 3
   ⏭️  Pulados: 0
   📦 Total no banco: 3

🎉 SUCESSO! Tenants de teste criados!
```

---

### **Passo 3: Execute novamente o aplicativo**

```bash
npm run electron:dev
```

Agora você verá os **3 tenants disponíveis** na tela de seleção! 🎉

---

## 🎮 Tenants de Teste Disponíveis

### 1. 🏪 **Tech Store São Paulo**
- **ID:** `loja_tech_sp_001`
- **Senha Admin:** `1234`
- **Tema:** Laranja/Azul (#FF6B35)
- **Jogos:** Roda da Fortuna, Raspadinha, Quiz
- **Caso de uso:** Loja de tecnologia

### 2. 🎪 **Tech Conference 2025**
- **ID:** `evento_tech_2025`
- **Senha Admin:** `2025`
- **Tema:** Roxo/Rosa (#8B5CF6)
- **Jogos:** Roda da Fortuna, Quiz
- **Caso de uso:** Evento corporativo

### 3. 🎯 **Demo - Cliente Padrão**
- **ID:** `demo_padrao`
- **Senha Admin:** `0000`
- **Tema:** Azul padrão (#3B82F6)
- **Jogos:** Roda da Fortuna
- **Caso de uso:** Template básico

---

## 🛠️ Scripts Disponíveis

### `npm run seed`
- Popula o banco com tenants de teste
- **Seguro:** Não sobrescreve tenants existentes
- Pode ser executado múltiplas vezes

### `npm run db:reset`
- **CUIDADO:** Remove TODO o banco de dados
- Pede confirmação antes de executar
- Use quando quiser começar do zero

---

## 🔧 Comandos Úteis

### 1. Começar do Zero

```bash
# Remove o banco (CUIDADO: perde tudo!)
npm run db:reset

# Cria novo banco vazio
npm run electron:dev
# (Feche após abrir)

# Popula com tenants de teste
npm run seed

# Inicia o app
npm run electron:dev
```

---

### 2. Adicionar Mais Tenants (Sem Perder Dados)

```bash
# Popula novos tenants (preserva existentes)
npm run seed

# Ou use a tela de Setup no app
# (Menu: Criar Novo Tenant)
```

---

### 3. Ver Onde Está o Banco

O banco SQLite fica em:

**Windows:**
```
C:\Users\[SeuUsuario]\AppData\Roaming\InterativeLeads\interativeleads.db
```

**macOS:**
```
~/Library/Application Support/InterativeLeads/interativeleads.db
```

**Linux:**
```
~/.config/InterativeLeads/interativeleads.db
```

Você pode abrir com ferramentas como:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Studio](https://sqlitestudio.pl/)
- VS Code Extension: SQLite Viewer

---

## 🐛 Troubleshooting

### Erro: "Banco de dados não encontrado"

**Causa:** O Electron ainda não criou o banco.

**Solução:**
```bash
npm run electron:dev
```
Aguarde abrir e feche. Depois execute `npm run seed`.

---

### Erro: "Cannot find module 'sqlite3'"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
npm install
```

---

### Tenants não aparecem após seed

**Verificar:**

1. O seed foi executado com sucesso?
   ```bash
   npm run seed
   ```

2. O banco está no lugar certo?
   - Windows: `%APPDATA%\InterativeLeads\interativeleads.db`

3. Reinicie o Electron:
   ```bash
   # Feche o app e execute novamente
   npm run electron:dev
   ```

---

### Quero criar meus próprios tenants

**Opção 1: Via Interface (Recomendado)**

1. Execute o app: `npm run electron:dev`
2. Clique em "Criar Novo Tenant"
3. Preencha os dados
4. Personalize no painel admin

**Opção 2: Editar o Script**

Edite `scripts/seed-tenants.js` e adicione um novo objeto no array `demoTenants`:

```javascript
{
  tenant_id: 'meu_cliente_001',
  brand_name: 'Minha Empresa',
  admin_password: '5678',
  theme: { /* ... */ },
  games_config: { /* ... */ }
}
```

Depois execute:
```bash
npm run seed
```

---

## 📚 Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `scripts/seed-tenants.js` | Script de seed |
| `scripts/reset-database.js` | Script de reset |
| `electron/database.js` | Gerenciador do SQLite |
| `electron/ipc-handlers.js` | Handlers de IPC |
| `services/tenantFallback.ts` | Tenants hardcoded de fallback |

---

## 🎯 Resumo

```bash
# Configuração inicial (primeira vez)
npm run electron:dev   # 1. Cria banco vazio (feche após abrir)
npm run seed          # 2. Popula com tenants de teste
npm run electron:dev   # 3. Inicia com tenants disponíveis

# Resetar tudo (recomeçar)
npm run db:reset      # Limpa banco (CUIDADO!)
npm run seed          # Popula novamente

# Adicionar mais tenants
npm run seed          # Adiciona sem apagar existentes
```

---

## 💡 Dica Profissional

Para **desenvolvimento rápido**, crie um tenant simples com senha fácil (`0000`) e use-o para testes. Mantenha os tenants demo para demonstrações a clientes.

Para **produção**, use senhas fortes e configure cada tenant via painel administrativo.

---

## 📞 Precisa de Ajuda?

1. Verifique os logs no console do Electron
2. Veja o arquivo `server.log` (se backend estiver rodando)
3. Abra uma issue no repositório

---

**🚀 Pronto! Agora você tem tenants de teste e pode começar a desenvolver!**

