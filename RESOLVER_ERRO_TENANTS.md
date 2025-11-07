# 🔧 Como Resolver: "Nenhum tenant encontrado"

## 🎯 Solução Rápida (2 Minutos)

Se você está vendo esta tela:

```
Selecione um Tenant
Nenhum tenant encontrado
Não há tenants disponíveis para seleção.
```

Execute estes 3 comandos:

```bash
# 1. Criar o banco de dados (aguarde abrir e depois feche)
npm run electron:dev

# 2. Popular com tenants de teste
npm run seed

# 3. Iniciar novamente
npm run electron:dev
```

**Pronto!** Agora você verá 3 tenants disponíveis! 🎉

---

## 📝 Passo a Passo Detalhado

### **Passo 1: Criar o Banco de Dados**

```bash
npm run electron:dev
```

**O que acontece:**
- O Electron cria o arquivo `interativeleads.db`
- As tabelas (`tenants`, `leads`, etc.) são criadas
- O app abre mostrando "nenhum tenant" (normal!)

**Ação:** Aguarde o app abrir e **feche-o** (Alt+F4 ou botão X)

---

### **Passo 2: Popular com Tenants de Teste**

```bash
npm run seed
```

**O que acontece:**
- Script conecta ao banco SQLite
- Insere 3 tenants de demonstração
- Mostra resumo na tela

**Você verá algo assim:**

```
🌱 SEED DE TENANTS - InterativeLeads
═══════════════════════════════════════

📂 Caminho do banco: C:\Users\...\interativeleads.db
✅ Conectado ao banco de dados

✅ Inserido: "Tech Store São Paulo" (ID: loja_tech_sp_001)
   Senha admin: 1234
✅ Inserido: "Tech Conference 2025" (ID: evento_tech_2025)
   Senha admin: 2025
✅ Inserido: "Demo - Cliente Padrão" (ID: demo_padrao)
   Senha admin: 0000

🎉 SUCESSO! Tenants de teste criados!
```

---

### **Passo 3: Iniciar o App Novamente**

```bash
npm run electron:dev
```

**Resultado:**
- Tela de seleção mostra **3 tenants**
- Clique em qualquer um para entrar
- Use as senhas listadas para acessar o admin

---

## 🎮 Tenants Disponíveis

Após executar `npm run seed`, você terá:

| Tenant | ID | Senha | Tema |
|--------|----|----|------|
| **Tech Store São Paulo** | `loja_tech_sp_001` | `1234` | 🟠 Laranja/Azul |
| **Tech Conference 2025** | `evento_tech_2025` | `2025` | 🟣 Roxo/Rosa |
| **Demo - Cliente Padrão** | `demo_padrao` | `0000` | 🔵 Azul padrão |

---

## 🆘 Problemas?

### ❌ Erro: "Banco de dados não encontrado"

**Causa:** Você tentou executar `npm run seed` antes de criar o banco.

**Solução:**
```bash
npm run electron:dev  # Criar banco primeiro
# (aguarde abrir e feche)
npm run seed          # Agora sim!
```

---

### ❌ Erro: "Cannot find module 'sqlite3'"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
npm install
```

---

### ❌ Tenants não aparecem após seed

**Verifique:**

1. O seed executou com sucesso?
   ```bash
   npm run seed
   # Deve mostrar "✅ Inserido: ..."
   ```

2. Reinicie completamente o Electron:
   - Feche TODAS as janelas do app
   - Execute `npm run electron:dev` novamente

3. Verifique o banco manualmente (opcional):
   - Abra: `%APPDATA%\InterativeLeads\interativeleads.db`
   - Use: [DB Browser for SQLite](https://sqlitebrowser.org/)
   - Verifique a tabela `tenants`

---

### ❌ Quero começar do zero

```bash
# Limpa TUDO (cuidado!)
npm run db:reset

# Recria e popula
npm run electron:dev  # (feche após abrir)
npm run seed
npm run electron:dev
```

---

## 📚 Documentação Completa

Para mais detalhes, veja:

- **[GUIA_SEED_TENANTS.md](./GUIA_SEED_TENANTS.md)** - Guia completo de seed
- **[scripts/README.md](./scripts/README.md)** - Documentação dos scripts
- **[README.md](./README.md)** - Documentação principal

---

## 🎯 Comandos de Atalho

```bash
# Setup completo (copie e cole tudo de uma vez)
npm run electron:dev && sleep 5 && npm run seed && npm run electron:dev

# Ou execute linha por linha:
npm run electron:dev  # Aguarde abrir, depois feche
npm run seed          # Popula banco
npm run electron:dev  # Inicia novamente
```

---

## 💡 Dica Pro

Para desenvolvimento, use o tenant `demo_padrao` com senha `0000` - é o mais rápido para testes!

---

**🚀 Agora você está pronto para usar o InterativeLeads!**

Se o problema persistir, abra uma [issue no GitHub](../../issues) com:
- Sistema operacional
- Versão do Node.js (`node --version`)
- Mensagens de erro completas
- Logs do console

