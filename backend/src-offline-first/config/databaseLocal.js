/**
 * Configuração e inicialização do banco de dados SQLite local
 * Este banco armazena leads capturados no totem para sincronização posterior
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Garantir que o diretório data existe
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Caminho do banco de dados local
const dbPath = path.join(dataDir, 'kiosk.db');

// Criar/conectar ao banco de dados SQLite
const db = new Database(dbPath, { verbose: console.log });

// Habilitar modo WAL para melhor performance
db.pragma('journal_mode = WAL');

// Criar tabela de leads se não existir
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'PENDING',
    synced_at DATETIME,
    error_message TEXT
  )
`;

db.exec(createTableSQL);

// Criar índice para melhorar performance de consultas
db.exec('CREATE INDEX IF NOT EXISTS idx_sync_status ON leads(sync_status)');
db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at)');

console.log('✅ Banco de dados SQLite local inicializado em:', dbPath);

module.exports = db;

