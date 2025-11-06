const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Importar módulos do Electron
const Database = require('./database');
const { setupIpcHandlers } = require('./ipc-handlers');

let mainWindow;
let db;

// Criar janela principal
async function createWindow() {
  // Inicializar banco de dados
  db = new Database();
  
  // Verificar se é a primeira execução (nenhum tenant cadastrado)
  const tenantsCount = await db.getTenantsCount();
  const isFirstRun = tenantsCount === 0;
  console.log(isFirstRun ? '✨ Primeira execução - Nenhum tenant cadastrado' : `🔍 Execução normal - ${tenantsCount} tenants encontrados`);

  // Obter tamanho da tela primária
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: isDev ? 1400 : width,
    height: isDev ? 900 : height,
    fullscreen: !isDev, // Tela cheia em produção
    autoHideMenuBar: true, // Esconder menu
    frame: !isDev, // Sem bordas em produção
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Carregar app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Log de eventos
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ InterativeLeads carregado com sucesso!');
    mainWindow.webContents.send('app-ready', {
      version: app.getVersion(),
      isDev: isDev,
      isFirstRun: isFirstRun
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Inicializar aplicação
app.whenReady().then(() => {
  console.log('🚀 InterativeLeads iniciando...');
  
  // Inicializar banco de dados
  try {
    db = new Database();
    console.log('✅ Banco de dados SQLite iniciado');
  } catch (error) {
    console.error('❌ Erro ao iniciar banco de dados:', error);
  }

  // Configurar IPC handlers
  setupIpcHandlers(ipcMain, db);

  // Criar janela
  createWindow();

  // Reabrir janela ao clicar no ícone (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Fechar app quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

// Otimizações
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.commandLine.appendSwitch('disable-site-isolation-trials');

// Log de informações
console.log(`
╔════════════════════════════════════════════╗
║      🎮 INTERATIVELEADS Desktop v1.0       ║
║   Sistema de Captação de Leads Interativo  ║
╚════════════════════════════════════════════╝

📂 App Path: ${app.getAppPath()}
💾 User Data: ${app.getPath('userData')}
🔧 Mode: ${isDev ? 'Development' : 'Production'}
`);

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

