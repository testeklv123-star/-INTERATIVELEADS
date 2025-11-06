// electron/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Caminho para o banco de dados no diretório de dados do usuário
const dbPath = path.join(app.getPath('userData'), 'interativeleads.db');

let db;

// Função para inicializar o banco de dados
function initDatabase() {
  console.log('📂 Banco de dados:', dbPath);
  try {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
        throw err;
      } else {
        console.log('✅ Conectado ao banco de dados SQLite.');
        createTables();
      }
    });
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar banco de dados:', error);
    // Considerar fechar o aplicativo se o banco não puder ser inicializado
    // app.quit();
  }
}

// Função para criar as tabelas (VERSÃO AUTOLIMPANTE)
function createTables() {
  console.log('🔍 Verificando e recriando tabelas para garantir a estrutura correta...');

  db.serialize(() => {
    // 1. APAGA as tabelas antigas para garantir um começo limpo
    db.run(`DROP TABLE IF EXISTS leads`, (err) => {
      if (err) console.error('❌ Erro ao apagar a tabela leads:', err.message);
    });

    db.run(`DROP TABLE IF EXISTS prizes_inventory`, (err) => {
      if (err) console.error('❌ Erro ao apagar a tabela prizes_inventory:', err.message);
    });

    db.run(`DROP TABLE IF EXISTS app_settings`, (err) => {
      if (err) console.error('❌ Erro ao apagar a tabela app_settings:', err.message);
    });

    db.run(`DROP TABLE IF EXISTS tenants`, (err) => {
      if (err) console.error('❌ Erro ao apagar a tabela tenants:', err.message);
    });

    // 2. CRIA as tabelas com a estrutura CORRETA e ATUALIZADA
    const tables = [
      `CREATE TABLE tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT UNIQUE NOT NULL,
        brand_name TEXT NOT NULL,
        admin_password TEXT NOT NULL,
        theme TEXT NOT NULL,
        games_config TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        game_played TEXT NOT NULL,
        prize_won TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id)
      )`,
      `CREATE TABLE prizes_inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        prize_name TEXT NOT NULL,
        total_quantity INTEGER NOT NULL,
        available_quantity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id)
      )`,
      `CREATE TABLE app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`
    ];

    // Cria as tabelas sequencialmente
    let tableIndex = 0;
    const createNextTable = () => {
      if (tableIndex >= tables.length) {
        // Todas as tabelas foram criadas, agora insere o tenant padrão
        insertDefaultTenant();
        return;
      }

      db.run(tables[tableIndex], (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela:', err.message);
        } else {
          console.log('✅ Tabela criada com sucesso.');
        }
        tableIndex++;
        createNextTable();
      });
    };

    createNextTable();
  });
}

// Função para inserir um tenant padrão (se não existir nenhum)
function insertDefaultTenant() {
  console.log('📝 Inserindo tenant padrão...');
  const defaultTenant = {
    tenant_id: 'loja_tech_sp_001',
    brand_name: 'Tech Store SP',
    admin_password: '1234', // Em um app real, isso seria um hash
    theme: JSON.stringify({
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#f3f4f6',
        text: '#111827',
      },
      logos: {
        main: '/assets/logo-placeholder.png',
        favicon: '/assets/favicon.ico',
      },
    }),
    games_config: JSON.stringify({
      wheel: { enabled: true, prizes: ['10% OFF', 'Brinde', 'Tente Novamente'] },
      scratch: { enabled: true, prizes: ['Ganhou', 'Tente Novamente'] },
      quiz: { enabled: true, questions: [] },
    }),
  };

  const sql = `INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, games_config) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [
    defaultTenant.tenant_id,
    defaultTenant.brand_name,
    defaultTenant.admin_password,
    defaultTenant.theme,
    defaultTenant.games_config
  ], function(err) {
    if (err) {
      console.error('❌ Erro ao inserir tenant padrão:', err.message);
      console.error('❌ Detalhes do erro:', err);
    } else {
      console.log(`🎉 Tenant padrão inserido com sucesso. ID: ${this.lastID}, Linhas afetadas: ${this.changes}`);
      // Verificar se realmente foi inserido
      db.get('SELECT * FROM tenants WHERE tenant_id = ?', [defaultTenant.tenant_id], (err, row) => {
        if (err) {
          console.error('❌ Erro ao verificar tenant inserido:', err.message);
        } else if (row) {
          console.log('✅ Tenant confirmado no banco:', row);
        } else {
          console.warn('⚠️ Tenant não encontrado após inserção!');
        }
      });
    }
  });
}

// Exporta a instância do banco de dados e a função de inicialização
module.exports = {
  initDatabase,
  getDb: () => db
};