# 🚀 InterativeLeads Desktop - Guia Rápido

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Testar em Desenvolvimento

```bash
# Instalar dependências (só na primeira vez)
npm install

# Rodar o app Electron em modo desenvolvimento
npm run electron:dev
```

O app abrirá automaticamente com DevTools habilitado.

---

### 2️⃣ Primeira Configuração

1. **Tela de Setup aparecerá**
2. **Digite um ID de tenant:**
   - `loja_tech_sp_001` → Tech Store São Paulo
   - `evento_tech_2025` → Tech Conference 2025
3. **Clique em "Conectar"**
4. **Pronto!** Você verá a tela inicial personalizada

---

### 3️⃣ Acessar o Painel Admin

1. **Na tela inicial**, clique no ícone de engrenagem (⚙️) no canto superior direito
2. **Digite a senha:** `1234` (para `loja_tech_sp_001`) ou `2025` (para `evento_tech_2025`)
3. **Navegue pelas abas:**
   - 📊 **Leads** - Visualize leads capturados
   - 🎨 **Marca** - Personalize logo e cores
   - 🎁 **Prêmios** - Gerencie prêmios da Roda
   - ⚙️ **Config. Jogos** - Configure todos os jogos

---

### 4️⃣ Testar Captura de Leads

1. **Volte à tela inicial** (clique em "Sair" no admin)
2. **Clique em "Começar"**
3. **Escolha um jogo:**
   - 🎡 Roda da Fortuna
   - 🎫 Raspadinha
   - ❓ Quiz
4. **Preencha o formulário**
5. **Jogue e ganhe um prêmio!**
6. **Veja o lead salvo** no painel admin

---

### 5️⃣ Gerar o Instalador .exe

```bash
# Build completo + instalador Windows
npm run electron:build:win
```

**Resultado:** `release/InterativeLeads-Setup-1.0.0.exe`

Distribua este arquivo para instalar em totens!

---

## 🎯 Próximos Passos

### Personalizar para Seu Cliente

1. **Crie um novo tenant** em `services/tenantService.ts`:

```typescript
const meuClienteConfig: TenantConfig = {
  tenant_id: 'meu_cliente_001',
  brand_name: 'Minha Loja',
  theme: {
    colors: {
      primary: '#FF0000',
      secondary: '#00FF00',
      // ... outras cores
    },
    // ... resto do tema
  },
  // ... resto da config
};

// Adicione ao switch case
case 'meu_cliente_001':
  return mockToRealConfig(meuClienteConfig);
```

2. **Teste** com o novo tenant ID

3. **Rebuild** e distribua!

---

## 📊 Onde Estão os Dados?

### Desenvolvimento
```
Banco de dados: C:\Users\[Usuario]\AppData\Roaming\Electron\interativeleads.db
```

### Produção
```
Banco de dados: C:\Users\[Usuario]\AppData\Roaming\InterativeLeads\interativeleads.db
```

---

## 🐛 Problemas Comuns

### "Porta 5000 em uso"
```bash
# Pare o processo anterior ou use outra porta
npm run dev -- --port 5001
npm run electron:dev
```

### "Erro ao instalar better-sqlite3"
```bash
# Windows: Instale ferramentas de build
npm install --global windows-build-tools

# Depois:
npm rebuild better-sqlite3
```

### "App não abre após build"
- Verifique se os ícones estão em `build/icon.ico`
- Veja `build/README_ICONS.txt` para gerar ícones

---

## 📖 Documentação Completa

Para mais detalhes, veja:
- **README_ELECTRON.md** - Documentação completa
- **LICENSE.txt** - Licença comercial
- **build/README_ICONS.txt** - Como gerar ícones

---

## 💡 Dicas

### Modo Fullscreen
O app abre em fullscreen automaticamente em **produção**. Em desenvolvimento, roda em janela normal.

### DevTools
- **Desenvolvimento:** Ctrl+Shift+I
- **Produção:** Desabilitado automaticamente

### Logs
Todos os logs aparecem no console do Electron (DevTools em dev, terminal em prod).

---

## 🎉 Tudo Pronto!

```bash
npm run electron:dev    # ← Comece por aqui!
```

**Boa sorte com seu projeto! 🚀**

