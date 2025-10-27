# 🎮 INTERATIVELEADS

**Sistema Profissional de Captação de Leads Interativo para Totens**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Electron](https://img.shields.io/badge/electron-38.4.0-47848f)
![React](https://img.shields.io/badge/react-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-5.8.2-3178c6)
![SQLite](https://img.shields.io/badge/sqlite-better--sqlite3-003b57)

---

## 🎯 O que é o InterativeLeads?

**InterativeLeads** é uma aplicação desktop Electron completa que transforma qualquer computador Windows em um **totem interativo de captação de leads**. Funciona 100% offline com banco de dados SQLite local.

### ✨ Principais Características

✅ **Aplicação Desktop Nativa** - Instalador `.exe` profissional  
✅ **Banco de Dados Local** - SQLite integrado (sem necessidade de servidor)  
✅ **Multi-Tenant** - Suporta múltiplos clientes na mesma instalação  
✅ **Modo Fullscreen** - Interface otimizada para totens touchscreen  
✅ **Jogos Interativos** - Roda da Fortuna, Raspadinha e Quiz  
✅ **Painel Administrativo** - Gerenciamento completo via web  
✅ **Exportação de Dados** - CSV e JSON  
✅ **Totalmente Offline** - Não requer internet após instalação  
✅ **White-Label** - Personalização completa de marca  

---

## 🚀 Início Rápido

### Testar em Desenvolvimento (5 minutos)

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o app Electron
npm run electron:dev
```

**Pronto!** O app abrirá automaticamente.

- Digite o tenant ID: `loja_tech_sp_001` ou `evento_tech_2025`
- Explore os jogos interativos
- Acesse o admin (⚙️ senha: `1234`)

### Gerar o Instalador Windows (.exe)

**⚠️ IMPORTANTE:** Execute como **Administrador**

```powershell
# Abra PowerShell como Administrador
cd caminho/do/projeto
npm run electron:build:win
```

**Resultado:** `release/InterativeLeads-1.0.0-Portable.exe`

📖 **Guia completo:** Veja [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [QUICK_START.md](QUICK_START.md) | ⚡ Guia de início rápido (5 min) |
| [README_ELECTRON.md](README_ELECTRON.md) | 📖 Documentação técnica completa |
| [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) | 🏗️ Como gerar o .exe |
| [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md) | ✅ Resumo da implementação |

---

## 🎮 Screenshots

### Tela Inicial (Attract Screen)
![Tela Inicial](docs/screenshots/attract-screen.png)

### Jogos Interativos
| Roda da Fortuna | Raspadinha | Quiz |
|----------------|------------|------|
| ![Roda](docs/screenshots/wheel.png) | ![Scratch](docs/screenshots/scratch.png) | ![Quiz](docs/screenshots/quiz.png) |

### Painel Administrativo
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## 🏗️ Arquitetura

```
┌─────────────────────┐
│   Main Process      │
│  (Electron/Node.js) │
│                     │
│  • SQLite Database  │
│  • IPC Handlers     │
│  • Window Manager   │
└──────────┬──────────┘
           │ IPC
┌──────────▼──────────┐
│  Renderer Process   │
│   (React/Browser)   │
│                     │
│  • React Components │
│  • Zustand Store    │
│  • Dynamic Theming  │
└─────────────────────┘
```

---

## 🗄️ Banco de Dados

### Localização
```
C:\Users\[Usuario]\AppData\Roaming\InterativeLeads\interativeleads.db
```

### Tabelas
- `tenants` - Configurações de clientes (brand, theme, games)
- `leads` - Leads capturados com todos os campos
- `prizes_inventory` - Controle de estoque de prêmios
- `app_settings` - Configurações gerais

---

## 🎨 Personalização (White-Label)

Cada cliente tem configuração única:

```typescript
{
  tenant_id: "meu_cliente_001",
  brand_name: "Minha Empresa",
  theme: {
    colors: {
      primary: "#FF0000",
      secondary: "#00FF00",
      // ... mais cores
    },
    logos: { /* URLs dos logos */ }
  },
  games_config: { /* Jogos e prêmios */ },
  // ... mais configurações
}
```

📖 **Ver exemplos:** `services/tenantService.ts`

---

## 📊 Funcionalidades

### Para Usuários (Totem)
- ✅ Tela de atração com animações
- ✅ Seleção de jogos interativos
- ✅ Formulário de captura de leads
- ✅ 3 jogos: Roda da Fortuna, Raspadinha, Quiz
- ✅ Tela de agradecimento personalizada
- ✅ Timeout automático de inatividade

### Para Administradores
- ✅ Dashboard de leads com métricas
- ✅ Exportação CSV de leads
- ✅ Personalização de marca (logo, cores)
- ✅ Gerenciamento de prêmios
- ✅ Configuração de jogos (prêmios, estoques, perguntas)
- ✅ Senha de acesso protegida

---

## 🛠️ Tecnologias

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Framer Motion** - Animations
- **React Router** - Navigation

### Backend (Electron)
- **Electron 38** - Desktop framework
- **better-sqlite3** - Local database
- **Node.js** - Runtime

### Build & Dev Tools
- **Vite** - Build tool
- **electron-builder** - Packaging
- **TypeScript** - Type checking

---

## 📦 Estrutura do Projeto

```
interativeleads/
├── electron/              # Electron (Main Process)
│   ├── main.js            # Entry point
│   ├── database.js        # SQLite manager
│   ├── preload.js         # Security bridge
│   └── ipc-handlers.js    # IPC API
│
├── src/                   # React (Renderer)
│   ├── components/        # UI components
│   ├── screens/           # Pages
│   ├── services/          # APIs
│   ├── stores/            # State (Zustand)
│   └── utils/             # Helpers
│
├── public/                # Static assets
├── build/                 # Build resources
├── dist/                  # Built React app
└── release/               # Final installers
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Apenas React (web)
npm run electron:dev     # Electron + React (desktop)

# Build
npm run build            # Build do React
npm run electron:build:win   # Gerar .exe Windows
npm run electron:build:mac   # Gerar .dmg macOS
npm run electron:build:linux # Gerar AppImage Linux
```

---

## 💻 Requisitos do Sistema

### Para Desenvolvimento
- Node.js 20.x ou superior
- npm 10.x ou superior
- Windows 10/11 (para build Windows)

### Para Produção (Totem)
- Windows 10/11 (64-bit)
- 4 GB RAM (8 GB recomendado)
- 500 MB espaço em disco
- Tela 1920x1080 (touchscreen recomendado)

---

## 🐛 Troubleshooting

### Erro ao gerar .exe
**Problema:** "Cannot create symbolic link"  
**Solução:** Execute PowerShell como Administrador

### Erro: better-sqlite3 não compila
```bash
npm install --global windows-build-tools
npm rebuild better-sqlite3
```

### App não abre após build
- Verifique se o banco de dados não está corrompido
- Delete: `C:\Users\[Usuario]\AppData\Roaming\InterativeLeads`
- Reinstale o app

📖 **Mais soluções:** [README_ELECTRON.md](README_ELECTRON.md)

---

## 📝 Licença

Licença Comercial Proprietária - Veja [LICENSE.txt](LICENSE.txt)

---

## 🤝 Contribuindo

Este é um projeto comercial. Para reportar bugs ou sugerir features:

1. Abra uma [Issue](../../issues)
2. Descreva o problema/sugestão
3. Aguarde resposta da equipe

---

## 📞 Suporte

**E-mail:** suporte@interativeleads.com  
**Documentação:** Este README + arquivos `.md` na raiz  

---

## 🎉 Começando

```bash
# Clone o repositório
git clone https://github.com/testeklv123-star/-INTERATIVELEADS.git

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run electron:dev
```

**Pronto para produção?**
```bash
npm run electron:build:win
```

---

<div align="center">
  <strong>🚀 InterativeLeads - Capture mais leads com interatividade! 🚀</strong>
  <br><br>
  <sub>Built with ❤️ using Electron, React, TypeScript & SQLite</sub>
  <br><br>
  <sub>© 2025 InterativeLeads Team. All rights reserved.</sub>
</div>
