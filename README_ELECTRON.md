# 🎮 InterativeLeads Desktop - Documentação Completa

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Electron](https://img.shields.io/badge/electron-38.4.0-47848f)
![React](https://img.shields.io/badge/react-19.2.0-61dafb)
![SQLite](https://img.shields.io/badge/sqlite-sqlite3-003b57)

**Sistema Profissional de Captação de Leads Interativo para Totens**

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Instalação](#-instalação)
- [Desenvolvimento](#-desenvolvimento)
- [Build e Distribuição](#-build-e-distribuição)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [Configuração](#-configuração)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)

---

## 🎯 Visão Geral

O **InterativeLeads Desktop** é uma aplicação Electron completa que transforma qualquer computador Windows em um totem interativo de captação de leads. A aplicação funciona 100% offline com banco de dados SQLite local.

### ✨ Características Principais

✅ **Aplicação Desktop Nativa** - Instalador `.exe` profissional  
✅ **Banco de Dados Local** - SQLite integrado (sem necessidade de servidor)  
✅ **Multi-Tenant** - Suporta múltiplos clientes na mesma instalação  
✅ **Modo Fullscreen** - Interface otimizada para totens  
✅ **Jogos Interativos** - Roda da Fortuna, Raspadinha e Quiz  
✅ **Painel Administrativo** - Gerenciamento completo de configurações e leads  
✅ **Exportação de Dados** - CSV e JSON  
✅ **Backup Automático** - Sistema de backup do banco de dados  
✅ **Totalmente Offline** - Não requer conexão com internet após instalação  

---

## 💻 Requisitos do Sistema

### Mínimo

- **SO:** Windows 10 (64-bit) ou superior
- **Processador:** Intel Core i3 ou equivalente
- **RAM:** 4 GB
- **Espaço em Disco:** 500 MB
- **Tela:** 1920x1080 (resolução mínima recomendada)

### Recomendado (para totens)

- **SO:** Windows 10/11 Pro (64-bit)
- **Processador:** Intel Core i5 ou superior
- **RAM:** 8 GB ou mais
- **Espaço em Disco:** 2 GB
- **Tela:** Touch screen 1920x1080 ou superior
- **Hardware:** Suporte a toque capacitivo

---

## 📦 Instalação

### Para Usuários Finais (Totem)

1. **Baixar o Instalador**
   ```
   InterativeLeads-Setup-1.0.0.exe
   ```

2. **Executar o Instalador**
   - Clique duplo no arquivo `.exe`
   - Siga as instruções do assistente
   - Escolha o diretório de instalação
   - Aguarde a conclusão

3. **Iniciar o Aplicativo**
   - Atalho na Área de Trabalho: `InterativeLeads`
   - Menu Iniciar: `InterativeLeads`

4. **Configuração Inicial**
   - Na primeira execução, insira o **ID do Tenant**
   - Exemplo: `loja_tech_sp_001` ou `evento_tech_2025`
   - O aplicativo carregará as configurações automaticamente

### Para Desenvolvedores

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/seu-repo/interativeleads.git
   cd interativeleads
   ```

2. **Instalar Dependências**
   ```bash
   npm install
   ```

3. **Rodar em Modo Desenvolvimento**
   ```bash
   npm run electron:dev
   ```
   - Abre o app Electron com DevTools
   - Hot-reload habilitado

---

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento web (apenas React)
npm run dev

# Desenvolvimento Electron (React + Electron)
npm run electron:dev

# Build de produção (apenas React)
npm run build

# Build completo + geração do instalador
npm run electron:build

# Build apenas para Windows
npm run electron:build:win

# Build apenas para macOS
npm run electron:build:mac

# Build apenas para Linux
npm run electron:build:linux
```

### Arquitetura do Electron

```
┌─────────────────────┐
│   Main Process      │
│  (Node.js/Electron) │
│                     │
│  - main.js          │
│  - database.js      │
│  - ipc-handlers.js  │
└──────────┬──────────┘
           │ IPC
           │ (Inter-Process Communication)
┌──────────▼──────────┐
│  Renderer Process   │
│   (React/Browser)   │
│                     │
│  - App.tsx          │
│  - Components       │
│  - Services         │
└─────────────────────┘
```

### Comunicação IPC

O `preload.js` expõe APIs seguras para o React:

```typescript
// Exemplo de uso no React
import electronService from './services/electronService';

// Salvar um lead
const result = await electronService.saveLead(leadData);

// Buscar configuração de tenant
const config = await electronService.getTenant('loja_tech_sp_001');

// Exportar dados
const exportData = await electronService.exportData();
```

---

## 🏗️ Build e Distribuição

### Gerar Instalador Windows (.exe)

```bash
npm run electron:build:win
```

**Saída:** `release/InterativeLeads-Setup-1.0.0.exe`

### Configurações do Build

Edite `package.json` → seção `build`:

```json
{
  "build": {
    "appId": "com.interativeleads.desktop",
    "productName": "InterativeLeads",
    "win": {
      "target": ["nsis"],
      "icon": "build/icon.ico"
    }
  }
}
```

### Gerando Ícones

Os ícones devem estar em `build/`:
- `icon.ico` (Windows)
- `icon.icns` (macOS)
- `icon.png` (Linux)

**Como gerar:**
```bash
# Opção 1: Ferramentas online
# https://cloudconvert.com/svg-to-ico

# Opção 2: ImageMagick
magick convert build/icon.svg -resize 256x256 build/icon.ico
```

---

## 📁 Estrutura do Projeto

```
interativeleads/
├── electron/                    # Código do Electron (Main Process)
│   ├── main.js                  # Processo principal
│   ├── preload.js               # Script de ponte segura
│   ├── database.js              # Gerenciador do SQLite
│   └── ipc-handlers.js          # Handlers de IPC
│
├── src/                         # Código React (Renderer Process)
│   ├── components/              # Componentes reutilizáveis
│   │   ├── common/              # Botões, inputs, modais
│   │   └── games/               # Roda, Raspadinha, Quiz
│   │
│   ├── screens/                 # Telas principais
│   │   ├── admin/               # Painel administrativo
│   │   ├── AttractScreen.tsx    # Tela inicial
│   │   ├── GameScreen.tsx       # Jogos
│   │   ├── LeadForm.tsx         # Formulário
│   │   └── ThankYouScreen.tsx   # Agradecimento
│   │
│   ├── services/                # Serviços
│   │   ├── electronService.ts   # API do Electron
│   │   ├── tenantService.ts     # Mock/API de tenants
│   │   └── apiService.ts        # API REST (fallback)
│   │
│   ├── stores/                  # Estado global (Zustand)
│   │   └── tenantStore.ts       # Store de configurações
│   │
│   ├── utils/                   # Utilitários
│   │   └── themeApplier.ts      # Aplicador de tema dinâmico
│   │
│   ├── App.tsx                  # Componente raiz
│   ├── index.tsx                # Entry point
│   └── types.ts                 # TypeScript types
│
├── public/                      # Assets estáticos
│   ├── logos/                   # Logos dos clientes
│   └── favicon.svg              # Ícone do app
│
├── build/                       # Recursos de build
│   ├── icon.svg                 # Ícone base
│   ├── icon.ico                 # Ícone Windows
│   └── README_ICONS.txt         # Instruções
│
├── release/                     # Builds gerados (auto-criado)
│   └── InterativeLeads-Setup-1.0.0.exe
│
├── package.json                 # Configurações e dependências
├── vite.config.ts               # Configuração do Vite
├── tsconfig.json                # Configuração TypeScript
├── LICENSE.txt                  # Licença comercial
└── README_ELECTRON.md           # Este arquivo
```

---

## 🗄️ Banco de Dados

### Localização

```
Windows: C:\Users\[SeuUsuario]\AppData\Roaming\InterativeLeads\interativeleads.db
```

### Estrutura das Tabelas

#### **tenants** - Configurações de Clientes
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | TEXT | ID único do tenant (PK) |
| brand_name | TEXT | Nome da marca |
| theme | TEXT | Configurações de tema (JSON) |
| content | TEXT | Textos personalizados (JSON) |
| games_config | TEXT | Configuração dos jogos (JSON) |
| form_fields | TEXT | Campos do formulário (JSON) |
| behavior | TEXT | Comportamentos (JSON) |
| created_at | DATETIME | Data de criação |
| updated_at | DATETIME | Última atualização |

#### **leads** - Leads Capturados
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | INTEGER | ID auto-incremental (PK) |
| tenant_id | TEXT | Referência ao tenant (FK) |
| name | TEXT | Nome completo |
| email | TEXT | E-mail |
| phone | TEXT | Telefone |
| game_selected | TEXT | Jogo escolhido |
| prize_won | TEXT | Prêmio ganho |
| custom_field | TEXT | Campo personalizado |
| consent | INTEGER | Consentimento (0/1) |
| timestamp | DATETIME | Data e hora |

#### **prizes_inventory** - Estoque de Prêmios
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | TEXT | ID do prêmio (PK) |
| tenant_id | TEXT | Referência ao tenant (FK) |
| game_type | TEXT | Tipo de jogo |
| prize_name | TEXT | Nome do prêmio |
| quantity_total | INTEGER | Quantidade total |
| quantity_available | INTEGER | Disponível |
| times_won | INTEGER | Vezes ganho |
| last_updated | DATETIME | Última atualização |

#### **app_settings** - Configurações do App
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| key | TEXT | Chave da configuração (PK) |
| value | TEXT | Valor |
| updated_at | DATETIME | Última atualização |

### Backup e Restore

**Exportar Dados (JSON):**
```typescript
const result = await electronService.exportData();
// Salva o result.data em um arquivo JSON
```

**Backup do Banco:**
```typescript
await electronService.backupDatabase('C:\\Backups\\backup_20251027.db');
```

**Otimizar Banco:**
```typescript
await electronService.optimizeDatabase(); // Executa VACUUM
```

---

## ⚙️ Configuração

### Configurar um Novo Tenant

1. **Acesse o Painel Admin**
   - Clique no ícone de engrenagem (⚙️) no canto superior direito da tela inicial
   - Digite a senha de admin (padrão: `1234`)

2. **Configure a Marca**
   - Vá para "Marca" → `admin/brand`
   - Upload do logo
   - Defina cores primárias, secundárias, etc.
   - Salve as alterações

3. **Configure os Jogos**
   - Vá para "Config. Jogos" → `admin/games`
   - Configure prêmios da Roda da Fortuna
   - Configure prêmios da Raspadinha
   - Configure perguntas e regras do Quiz
   - Salve as configurações

4. **Gerencie Prêmios**
   - Vá para "Prêmios (Roda)" → `admin/prizes`
   - Ajuste probabilidades (soma deve ser 100%)
   - Defina estoques

5. **Visualize Leads**
   - Vá para "Leads" → `admin/leads`
   - Veja estatísticas e lista de leads
   - Exporte para CSV

### Senha de Admin

Padrão: `1234`

Para alterar, edite no banco:
```sql
UPDATE app_settings SET value = '5678' WHERE key = 'admin_password';
```

Ou configure em `behavior.admin_password` no tenant.

---

## 🔧 Troubleshooting

### Problema: "Aplicativo não abre"

**Solução:**
1. Verifique se há processos do Electron rodando (Task Manager)
2. Exclua a pasta: `C:\Users\[Usuario]\AppData\Roaming\InterativeLeads`
3. Reinstale o aplicativo

### Problema: "Banco de dados corrompido"

**Solução:**
1. Feche o aplicativo
2. Navegue até: `C:\Users\[Usuario]\AppData\Roaming\InterativeLeads`
3. Renomeie `interativeleads.db` para `interativeleads.db.old`
4. Reabra o app (um novo banco será criado)

### Problema: "Ícones não aparecem no build"

**Solução:**
1. Gere os ícones nos formatos corretos (ver [Gerando Ícones](#gerando-ícones))
2. Coloque em `build/icon.ico`
3. Rebuild: `npm run electron:build:win`

### Problema: "Erro ao instalar dependências"

**Solução:**
```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules

# Reinstalar
npm install
```

### Problema: "sqlite3 não compila"

**Solução:**
```bash
# Instalar ferramentas de build do Windows
npm install --global windows-build-tools

# Rebuild o módulo
npm rebuild sqlite3
```

---

## ❓ FAQ

### 1. **Posso usar em Linux/macOS?**
Sim! Basta rodar:
```bash
npm run electron:build:linux  # Linux
npm run electron:build:mac    # macOS
```

### 2. **Como adicionar um novo tenant?**
No primeiro acesso, insira o **ID do tenant** na tela de setup.
Os dados mockados já estão em `services/tenantService.ts`:
- `loja_tech_sp_001` → Tech Store São Paulo
- `evento_tech_2025` → Tech Conference 2025

### 3. **Os dados são salvos online?**
Não! Tudo é salvo localmente no SQLite. Para sincronizar com a nuvem, você pode:
- Usar a API do Google (chave fornecida)
- Implementar sincronização com Google Sheets
- Enviar para um backend REST

### 4. **Como personalizar para cada cliente?**
Cada cliente tem um **tenant_id** único que carrega configurações específicas de:
- Logo
- Cores
- Prêmios
- Jogos habilitados
- Campos do formulário

### 5. **Posso vender/redistribuir?**
Veja o arquivo `LICENSE.txt` para detalhes da licença comercial.

### 6. **Como atualizar a aplicação?**
1. Gere um novo instalador com a versão atualizada
2. Distribua para os clientes
3. Execute o instalador (sobrescreve a versão anterior)
4. O banco de dados é preservado automaticamente

### 7. **Quantos leads o banco suporta?**
SQLite pode armazenar milhões de registros. Para otimizar:
```typescript
await electronService.optimizeDatabase();
```

### 8. **Como fazer backup automático?**
Implemente um agendador no `main.js`:
```javascript
// Backup diário às 2h da manhã
const schedule = require('node-schedule');
schedule.scheduleJob('0 2 * * *', async () => {
  const backupPath = path.join(app.getPath('documents'), 'Backups', `backup_${Date.now()}.db`);
  db.backup(backupPath);
});
```

---

## 📞 Suporte

**E-mail:** suporte@interativeleads.com  
**Documentação:** Este arquivo  
**Issues:** GitHub Issues (se aplicável)

---

## 🎉 Pronto para usar!

Para iniciar o desenvolvimento:
```bash
npm run electron:dev
```

Para gerar o instalador:
```bash
npm run electron:build:win
```

**Sucesso com seu projeto! 🚀**

---

<div align="center">
  <sub>Built with ❤️ using Electron, React, and SQLite</sub>
</div>

