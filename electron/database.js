// electron/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

let db;
let dbPath;

function getDb() {
  if (!db) {
    throw new Error('Banco de dados não foi inicializado. Chame initDatabase() primeiro.');
  }
  return db;
}

// Função para inicializar o banco de dados de forma robusta
function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // 1. Define o caminho do banco de dados
      const userDataPath = app.getPath('userData');
      console.log('📂 Diretório de dados do usuário:', userDataPath);
      
      // Garante que o diretório existe
      fs.mkdirSync(userDataPath, { recursive: true });
      
      dbPath = path.join(userDataPath, 'interativeleads.db');
      console.log('💾 Caminho do banco de dados:', dbPath);

      // Conecta ao banco de dados
      db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('❌ Erro ao conectar ao banco de dados:', err.message);
          console.error('❌ Stack trace:', err.stack);
          return reject(err);
        }
        
        console.log('✅ Conectado ao banco de dados SQLite.');
        
        // Habilita foreign keys
        db.run('PRAGMA foreign_keys = ON;', (err) => {
          if (err) {
            console.error('❌ Erro ao habilitar foreign keys:', err.message);
            return reject(err);
          }
          
          // Cria as tabelas e insere o tenant padrão
          createTables()
            .then(() => {
              console.log('🎉 Banco de dados inicializado com sucesso.');
              resolve();
            })
            .catch(reject);
        });
      });
    } catch (error) {
      console.error('❌ Erro na inicialização do banco de dados:', error.message);
      console.error('❌ Stack trace:', error.stack);
      reject(error);
    }
  });
}

// Função para criar as tabelas (SE NÃO EXISTIREM)
function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // IMPORTANTE: Usa CREATE TABLE IF NOT EXISTS para NÃO apagar dados existentes
      const createTablesSql = [
        `CREATE TABLE IF NOT EXISTS tenants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT UNIQUE NOT NULL,
          brand_name TEXT NOT NULL,
          admin_password TEXT NOT NULL,
          theme TEXT NOT NULL,
          content TEXT,
          games_config TEXT NOT NULL,
          form_fields TEXT,
          behavior TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS leads (
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
        `CREATE TABLE IF NOT EXISTS prizes_inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          prize_name TEXT NOT NULL,
          total_quantity INTEGER NOT NULL,
          available_quantity INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id)
        )`,
        `CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )`
      ];

      let tablesCreated = 0;
      createTablesSql.forEach(sql => {
        db.run(sql, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela:', err.message);
            return reject(err);
          }
          tablesCreated++;
          if (tablesCreated === createTablesSql.length) {
            console.log('✅ Tabelas verificadas/criadas com sucesso.');
            // 3. Insere o tenant padrão APENAS se não houver nenhum
            insertDefaultTenant()
              .then(resolve)
              .catch(reject);
          }
        });
      });
    });
  });
}

// Função para inserir um tenant padrão
function insertDefaultTenant() {
  return new Promise((resolve, reject) => {
    // Verifica se já existem tenants
    db.get('SELECT COUNT(*) as count FROM tenants', [], (err, row) => {
      if (err) {
        console.error('❌ Erro ao verificar tenants:', err.message);
        return reject(err);
      }

      if (row && row.count > 0) {
        console.log(`ℹ️  Banco já contém ${row.count} tenant(s). Pulando inserção padrão.`);
        return resolve();
      }

      // Se não há tenants, insere um padrão
      const defaultTenant = {
        tenant_id: 'loja_tech_sp_001',
        brand_name: 'Tech Store SP',
        admin_password: '1234',
        theme: JSON.stringify({ 
          colors: { 
            primary: '#FF6B35',
            secondary: '#004E89',
            accent: '#F7931E',
            background: '#FFFFFF',
            text: '#1A1A1A',
            text_secondary: '#666666',
            success: '#28A745',
            error: '#DC3545',
            button_primary_bg: '#FF6B35',
            button_primary_text: '#FFFFFF',
            button_secondary_bg: '#004E89',
            button_secondary_text: '#FFFFFF'
          },
          typography: {
            font_primary: 'Inter',
            font_secondary: 'Roboto',
            heading_weight: '700',
            body_weight: '400'
          },
          logos: {
            main_logo_url: '/logos/tech-store-main.svg',
            center_logo_url: '/logos/tech-store-icon.svg',
            watermark_url: '/logos/tech-store-icon.svg'
          },
          spacing: {
            border_radius: '12px',
            padding_base: '16px'
          }
        }),
        content: JSON.stringify({
          welcome_title: 'Bem-vindo à Tech Store!',
          welcome_subtitle: 'Participe e ganhe prêmios incríveis',
          form_title: 'Cadastre-se para jogar',
          form_subtitle: 'Seus dados são seguros conosco',
          thank_you_message: 'Obrigado por participar!',
          privacy_notice: 'Ao participar, você aceita nossa política de privacidade.'
        }),
        games_config: JSON.stringify({ 
          enabled_games: ['prize_wheel'],
          prize_wheel: { 
            prizes: [
              { id: 'p1', label: '10% OFF', name: 'Cupom 10%', probability: 40, color: '#FF6B35', quantity_available: 100, quantity_total: 100 },
              { id: 'p2', label: 'Brinde', name: 'Chaveiro', probability: 30, color: '#004E89', quantity_available: 50, quantity_total: 50 },
              { id: 'p3', label: '20% OFF', name: 'Cupom 20%', probability: 20, color: '#F7931E', quantity_available: 30, quantity_total: 30 },
              { id: 'p4', label: 'Fone BT', name: 'Fone Bluetooth', probability: 10, color: '#28A745', quantity_available: 10, quantity_total: 10 }
            ]
          },
          scratch_card: {
            overlay_color: '#C0C0C0',
            prizes: []
          },
          quiz: {
            questions: [],
            prize_rules: []
          }
        }),
        form_fields: JSON.stringify({
          required: ['name', 'email', 'phone'],
          optional: [],
          custom_field: { enabled: false, label: '', type: 'text', options: [] }
        }),
        behavior: JSON.stringify({
          inactivity_timeout: 30,
          auto_return_home: true,
          show_lead_count: false,
          collect_photo: false,
          admin_password: '1234'
        })
      };

      const sql = `INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, content, games_config, form_fields, behavior) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(sql, Object.values(defaultTenant), function(err) {
        if (err) {
          console.error('❌ Erro ao inserir tenant padrão:', err.message);
          return reject(err);
        }
        if (this.changes > 0) {
          console.log('🎉 Tenant padrão "Tech Store SP" inserido com sucesso!');
          console.log('   ID: loja_tech_sp_001 | Senha: 1234');
          resolve();
        } else {
          console.log('ℹ️  Nenhuma alteração feita (tenant pode já existir).');
          resolve();
        }
      });
    });
  });
}

module.exports = {
  initDatabase,
  getDb
};
  