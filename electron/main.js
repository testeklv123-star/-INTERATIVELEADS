// electron/main.js
const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const { initDatabase } = require('./database'); // Importa a função de inicialização do DB

// Mantém uma referência global para o objeto da janela
let mainWindow;

function createWindow() {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      // A pasta de preload é a pasta 'electron'
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // TODO: Mudar para kiosk: true mais tarde
    fullscreen: true,
    autoHideMenuBar: true,
  });

  // Carrega o aplicativo a partir do servidor de desenvolvimento
  mainWindow.loadURL('http://localhost:5000');

  // Abre o DevTools em modo de desenvolvimento
  // mainWindow.webContents.openDevTools();
}

// Este método será chamado quando o Electron terminar a inicialização
// e estiver pronto para criar janelas do navegador.
// Algumas APIs podem ser usadas apenas depois que este evento ocorre.
app.whenReady().then(() => {
  // 1. Inicializa o banco de dados PRIMEIRO
  initDatabase();

  // 2. Importa os handlers de IPC (isso os executa e os registra)
  require('./ipc-handlers');

  // 3. Cria a janela principal
  createWindow();

  app.on('activate', () => {
    // No macOS, é comum recriar uma janela no aplicativo quando o
    // ícone do dock é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Sai quando todas as janelas estiverem fechadas, exceto no macOS.
// É comum para aplicativos e sua barra de menu permanecerem ativos
// até que o usuário saia explicitamente com Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Neste arquivo, você pode incluir o resto do código específico do seu processo principal
// Você também pode colocá-los em arquivos separados e solicitá-los aqui.
