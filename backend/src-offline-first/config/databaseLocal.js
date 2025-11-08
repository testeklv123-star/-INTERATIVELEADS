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
    tenant_slug TEXT NOT NULL DEFAULT 'default-tenant',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'PENDING',
    synced_at DATETIME,
    error_message TEXT
  )
`;

db.exec(createTableSQL);

// Criar tabela para armazenar o tenant atual do totem
const createTenantTableSQL = `
  CREATE TABLE IF NOT EXISTS current_tenant (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    slug TEXT NOT NULL
  )
`;

db.exec(createTenantTableSQL);

// Inserir tenant padrão se não existir
db.exec(`
  INSERT OR IGNORE INTO current_tenant (id, slug) 
  VALUES (1, 'loja-exemplo-001')
`);

// Adicionar coluna tenant_slug em tabelas existentes (migração)
try {
  db.exec(`
    SELECT tenant_slug FROM leads LIMIT 1
  `);
} catch (error) {
  // Coluna não existe, precisa adicionar
  console.log('⚙️  Adicionando coluna tenant_slug à tabela leads...');
  db.exec(`
    ALTER TABLE leads ADD COLUMN tenant_slug TEXT NOT NULL DEFAULT 'default-tenant'
  `);
  console.log('✅ Coluna tenant_slug adicionada com sucesso!');
}

// Criar índices para melhorar performance de consultas
db.exec('CREATE INDEX IF NOT EXISTS idx_sync_status ON leads(sync_status)');
db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at)');
db.exec('CREATE INDEX IF NOT EXISTS idx_tenant_slug ON leads(tenant_slug)');

console.log('✅ Banco de dados SQLite local inicializado em:', dbPath);

module.exports = db;

