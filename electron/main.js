// electron/main.js
// Importações principais
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { initDatabase } = require('./database');

// Verificar se o app está disponível
if (!app) {
  console.error('❌ Erro: O módulo app do Electron não está disponível.');
  process.exit(1);
}

// Debug: Verificar se o módulo electron foi carregado corretamente
console.log('App module:', app);
console.log('App path:', app.getAppPath());
console.log('User data path:', app.getPath('userData'));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
    fullscreen: true,
    autoHideMenuBar: true,
  });

  // Cria menu de depuração com acesso rápido ao DevTools
  const template = [
    {
      label: 'Dev',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Ctrl+Shift+I',
          click: (_, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          },
        },
        { role: 'reload' },
        { role: 'forceReload' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Carrega o servidor de desenvolvimento na porta 5000
  mainWindow.loadURL('http://localhost:5000');
  // Abre o DevTools automaticamente em janela separada
  mainWindow.webContents.once('did-frame-finish-load', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      console.log('🛠️  Abrindo DevTools automaticamente (modo detach)...');
      mainWindow.webContents.openDevTools({ mode: 'detach', activate: false });
    }
  });
}

async function initializeApp() {
  try {
    console.log('🚀 Iniciando aplicação Electron...');
    
    // 1. Inicializar o banco de dados primeiro
    console.log('⏳ Inicializando banco de dados...');
    await initDatabase();
    console.log('✅ Banco de dados inicializado com sucesso!');

    // 2. Registrar handlers IPC
    console.log('🔌 Registrando IPC handlers...');
    require('./ipc-handlers');
    console.log('✅ IPC handlers registrados com sucesso.');

    // 3. Criar janela principal
    console.log('🪟 Criando janela principal...');
    createWindow();
    console.log('✅ Aplicação pronta!');
  } catch (error) {
    console.error('❌ Erro durante a inicialização:', error);
    app.quit();
  }
}

// Inicializar o app quando o Electron estiver pronto
app.whenReady().then(initializeApp);

// Gerenciar o evento de ativação (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Encerrar o aplicativo quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
