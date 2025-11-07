# 🛠️ Scripts Utilitários - InterativeLeads

Scripts para gerenciamento do banco de dados SQLite do Electron.

---

## 📜 Scripts Disponíveis

### 🌱 `seed-tenants.js`

**Popula o banco com tenants de teste**

```bash
npm run seed
```

**O que faz:**
- Insere 3 tenants de demonstração no banco SQLite
- Verifica duplicatas (não sobrescreve tenants existentes)
- Pode ser executado múltiplas vezes com segurança
- Cria configurações completas (tema, jogos, prêmios)

**Tenants inseridos:**
1. `loja_tech_sp_001` - Tech Store São Paulo (senha: `1234`)
2. `evento_tech_2025` - Tech Conference 2025 (senha: `2025`)
3. `demo_padrao` - Demo Cliente Padrão (senha: `0000`)

**Pré-requisito:**
O banco de dados deve existir. Execute `npm run electron:dev` uma vez antes.

---

### 🔄 `reset-database.js`

**Remove completamente o banco de dados**

```bash
npm run db:reset
```

**O que faz:**
- Remove o arquivo `interativeleads.db`
- Remove arquivos temporários (`.db-shm`, `.db-wal`)
- Pede confirmação antes de executar
- **⚠️ ATENÇÃO: DELETA TODOS OS DADOS!**

**Quando usar:**
- Problemas de corrupção no banco
- Quer começar do zero
- Desenvolvimento/testes

**Após resetar:**
```bash
npm run electron:dev  # Cria banco novo
npm run seed          # Popula com tenants
```

---

## 🚀 Fluxo de Trabalho Típico

### Setup Inicial

```bash
# 1. Instalar dependências
npm install

# 2. Criar banco (abre e fecha o app)
npm run electron:dev

# 3. Popular com tenants de teste
npm run seed

# 4. Usar a aplicação
npm run electron:dev
```

---

### Recomeçar do Zero

```bash
# Limpa tudo
npm run db:reset

# Popula novamente
npm run seed

# Inicia
npm run electron:dev
```

---

### Adicionar Mais Tenants

```bash
# Edite o arquivo seed-tenants.js
# Adicione um novo objeto no array demoTenants

# Execute o seed (preserva existentes)
npm run seed
```

---

## 📂 Localização do Banco

O banco SQLite fica em:

**Windows:**
```
C:\Users\[Usuario]\AppData\Roaming\InterativeLeads\interativeleads.db
```

**macOS:**
```
~/Library/Application Support/InterativeLeads/interativeleads.db
```

**Linux:**
```
~/.config/InterativeLeads/interativeleads.db
```

---

## 🔧 Desenvolvendo Seus Próprios Scripts

Os scripts usam a mesma estrutura do Electron:

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { getDatabasePath } = require('./utils'); // Função helper

const db = new sqlite3.Database(getDatabasePath());

// Suas operações aqui
db.run('INSERT INTO ...', [], (err) => {
  // ...
});

db.close();
```

---

## 📚 Documentação Completa

Veja o guia detalhado: **[GUIA_SEED_TENANTS.md](../GUIA_SEED_TENANTS.md)**

---

## 💡 Dicas

1. **Sempre faça backup** antes de `npm run db:reset`
2. Execute `npm run seed` após criar um banco novo
3. Use `demo_padrao` (senha `0000`) para testes rápidos
4. Personalize tenants via painel administrativo do app

---

## ❓ Troubleshooting

### "Banco de dados não encontrado"
→ Execute `npm run electron:dev` primeiro

### "Tenants não aparecem após seed"
→ Reinicie o Electron completamente

### "Cannot find module 'sqlite3'"
→ Execute `npm install`

---

**🔗 Links Úteis:**
- [Guia Completo de Seed](../GUIA_SEED_TENANTS.md)
- [README Principal](../README.md)
- [Documentação Electron](../README_ELECTRON.md)

