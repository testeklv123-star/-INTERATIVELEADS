// electron/main.js
// Importações principais
const { app, BrowserWindow, Menu, screen } = require('electron');
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

/**
 * Detecta a resolução do monitor primário automaticamente
 * @returns {Object} Dimensões da tela primária
 */
function getPrimaryDisplaySize() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  console.log('🖥️  [Screen] Monitor primário detectado:');
  console.log(`   Resolução: ${width}x${height}`);
  console.log(`   Scale Factor: ${primaryDisplay.scaleFactor}`);
  
  return { width, height, scaleFactor: primaryDisplay.scaleFactor };
}

function createWindow() {
  // Detecta automaticamente a resolução da tela
  const displaySize = getPrimaryDisplaySize();
  
  // Em produção, usa fullscreen; em dev, janela redimensionável
  const isProduction = process.env.NODE_ENV === 'production';
  
  mainWindow = new BrowserWindow({
    width: displaySize.width,
    height: displaySize.height,
    minWidth: 1024,  // Resolução mínima suportada
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      zoomFactor: 1.0,  // Garante zoom inicial correto
    },
    fullscreen: isProduction,
    autoHideMenuBar: true,
    resizable: !isProduction,  // Permite redimensionar em dev
    backgroundColor: '#FFFFFF',
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
    
    // Envia informações de resolução para o frontend
    const displayInfo = getPrimaryDisplaySize();
    mainWindow.webContents.send('display-info', displayInfo);
    console.log('📤 [Screen] Informações de display enviadas ao frontend');
  });
  
  // Detecta mudanças na configuração de displays (monitores)
  screen.on('display-metrics-changed', (event, display) => {
    console.log('🔄 [Screen] Configuração de display alterada');
    const newDisplaySize = getPrimaryDisplaySize();
    
    // Ajusta a janela para a nova resolução
    if (!isProduction) {
      mainWindow.setSize(newDisplaySize.width, newDisplaySize.height);
    }
    
    // Notifica o frontend sobre a mudança
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('display-info', newDisplaySize);
    }
  });
  
  // Detecta quando a janela é redimensionada (modo dev)
  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize();
    console.log(`📏 [Window] Janela redimensionada: ${width}x${height}`);
    
    // Envia novo tamanho para o frontend
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-resized', { width, height });
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
