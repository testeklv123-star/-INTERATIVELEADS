const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

class TotemDatabase {
  constructor() {
    // Caminho do banco de dados no diretório de dados do usuário
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'interativeleads.db');
    
    console.log('📂 Banco de dados:', dbPath);
    
    // Criar diretório se não existir
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    // Inicializar banco de dados
    this.db = new Database(dbPath, { verbose: console.log });
    
    // Otimizações de performance
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    
    // Criar tabelas
    this.initializeTables();
  }

  safeParseJson(value, fallback = {}) {
    if (value === null || value === undefined) {
      return fallback;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('❌ Erro ao fazer parse de JSON armazenado no SQLite:', error);
      return fallback;
    }
  }

  initializeTables() {
    console.log('🔨 Criando tabelas do banco de dados...');

    // Tabela de Tenants
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        brand_name TEXT NOT NULL,
        theme TEXT NOT NULL,
        content TEXT NOT NULL,
        games_config TEXT NOT NULL,
        form_fields TEXT NOT NULL,
        behavior TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Leads
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        game_selected TEXT,
        prize_won TEXT,
        custom_field TEXT,
        consent INTEGER DEFAULT 1,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
      )
    `);

    // Tabela de Estoque de Prêmios
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS prizes_inventory (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        game_type TEXT NOT NULL,
        prize_name TEXT NOT NULL,
        quantity_total INTEGER DEFAULT 0,
        quantity_available INTEGER DEFAULT 0,
        times_won INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
      )
    `);

    // Tabela de Configurações do App
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON leads(timestamp);
      CREATE INDEX IF NOT EXISTS idx_prizes_tenant ON prizes_inventory(tenant_id);
    `);

    console.log('✅ Tabelas criadas com sucesso!');
  }

  // ==================== TENANTS ====================

  getTenant(tenantId) {
    const stmt = this.db.prepare('SELECT * FROM tenants WHERE id = ?');
    const row = stmt.get(tenantId);
    
    if (!row) return null;

    return {
      tenant_id: row.id,
      brand_name: row.brand_name,
      theme: this.safeParseJson(row.theme, {}),
      content: this.safeParseJson(row.content, {}),
      games_config: this.safeParseJson(row.games_config, {}),
      form_fields: this.safeParseJson(row.form_fields, []),
      behavior: this.safeParseJson(row.behavior, {})
    };
  }

  saveTenant(config) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO tenants (id, brand_name, theme, content, games_config, form_fields, behavior, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    stmt.run(
      config.tenant_id,
      config.brand_name,
      JSON.stringify(config.theme),
      JSON.stringify(config.content),
      JSON.stringify(config.games_config),
      JSON.stringify(config.form_fields),
      JSON.stringify(config.behavior)
    );
    
    return true;
  }

  getAllTenants() {
    const stmt = this.db.prepare('SELECT id, brand_name, created_at FROM tenants ORDER BY created_at DESC');
    return stmt.all();
  }

  deleteTenant(tenantId) {
    const stmt = this.db.prepare('DELETE FROM tenants WHERE id = ?');
    stmt.run(tenantId);
    
    // Deletar leads relacionados
    const stmtLeads = this.db.prepare('DELETE FROM leads WHERE tenant_id = ?');
    stmtLeads.run(tenantId);
    
    return true;
  }

  // ==================== LEADS ====================

  saveLead(leadData) {
    const stmt = this.db.prepare(`
      INSERT INTO leads (tenant_id, name, email, phone, game_selected, prize_won, custom_field, consent, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      leadData.tenant_id,
      leadData.name,
      leadData.email,
      leadData.phone || null,
      leadData.game_selected || null,
      leadData.prize_won || null,
      leadData.custom_field || null,
      leadData.consent ? 1 : 0,
      leadData.timestamp || new Date().toISOString()
    );
    
    return { id: result.lastInsertRowid, ...leadData };
  }

  getLeadById(leadId) {
    const stmt = this.db.prepare('SELECT * FROM leads WHERE id = ?');
    return stmt.get(leadId) || null;
  }

  getLeads(tenantId = null, limit = 1000) {
    let query = 'SELECT * FROM leads';
    let params = [];
    
    if (tenantId) {
      query += ' WHERE tenant_id = ?';
      params.push(tenantId);
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  getLeadsCount(tenantId = null) {
    let query = 'SELECT COUNT(*) as count FROM leads';
    let params = [];
    
    if (tenantId) {
      query += ' WHERE tenant_id = ?';
      params.push(tenantId);
    }
    
    const stmt = this.db.prepare(query);
    const result = stmt.get(...params);
    return result.count;
  }

  updateLead(leadId, updates = {}) {
    const allowedFields = {
      tenant_id: (value) => value,
      name: (value) => value,
      email: (value) => value,
      phone: (value) => value ?? null,
      game_selected: (value) => value ?? null,
      prize_won: (value) => value ?? null,
      custom_field: (value) => value ?? null,
      consent: (value) => (value ? 1 : 0),
      timestamp: (value) => value
    };

    const entries = Object.entries(updates).filter(([key]) => key in allowedFields);

    if (entries.length === 0) {
      throw new Error('Nenhum campo válido informado para atualizar lead');
    }

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([key, value]) => allowedFields[key](value));

    const stmt = this.db.prepare(`UPDATE leads SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, leadId);
    return result.changes > 0;
  }

  deleteLead(leadId) {
    const stmt = this.db.prepare('DELETE FROM leads WHERE id = ?');
    const result = stmt.run(leadId);
    return result.changes > 0;
  }

  // ==================== ESTOQUE DE PRÊMIOS ====================

  updatePrizeInventory(tenantId, gameType, prizeId, updates) {
    const current = this.db
      .prepare('SELECT * FROM prizes_inventory WHERE tenant_id = ? AND id = ?')
      .get(tenantId, prizeId);

    const merged = {
      prize_name: updates.prize_name ?? current?.prize_name,
      quantity_total: updates.quantity_total ?? current?.quantity_total ?? 0,
      quantity_available: updates.quantity_available ?? current?.quantity_available ?? 0,
      times_won: updates.times_won ?? current?.times_won ?? 0
    };

    if (!merged.prize_name) {
      throw new Error('Nome do prêmio é obrigatório para criar/atualizar inventário');
    }

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO prizes_inventory 
      (id, tenant_id, game_type, prize_name, quantity_total, quantity_available, times_won, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.run(
      prizeId,
      tenantId,
      gameType,
      merged.prize_name,
      merged.quantity_total,
      merged.quantity_available,
      merged.times_won
    );
  }

  getPrizeInventory(tenantId, gameType = null) {
    let query = `
      SELECT * FROM prizes_inventory 
      WHERE tenant_id = ?
    `;
    const params = [tenantId];

    if (gameType) {
      query += ' AND game_type = ?';
      params.push(gameType);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  decrementPrizeStock(tenantId, prizeId) {
    const stmt = this.db.prepare(`
      UPDATE prizes_inventory 
      SET quantity_available = quantity_available - 1,
          times_won = times_won + 1,
          last_updated = CURRENT_TIMESTAMP
      WHERE tenant_id = ? AND id = ? AND quantity_available > 0
    `);
    
    const result = stmt.run(tenantId, prizeId);
    return result.changes > 0;
  }

  getPrizeById(prizeId) {
    const stmt = this.db.prepare('SELECT * FROM prizes_inventory WHERE id = ?');
    return stmt.get(prizeId) || null;
  }

  deletePrize(tenantId, prizeId) {
    const stmt = this.db.prepare('DELETE FROM prizes_inventory WHERE tenant_id = ? AND id = ?');
    const result = stmt.run(tenantId, prizeId);
    return result.changes > 0;
  }

  // ==================== CONFIGURAÇÕES DO APP ====================

  getSetting(key) {
    const stmt = this.db.prepare('SELECT value FROM app_settings WHERE key = ?');
    const result = stmt.get(key);
    return result ? result.value : null;
  }

  setSetting(key, value) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO app_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(key, value);
  }

  getAllSettings() {
    const stmt = this.db.prepare('SELECT key, value, updated_at FROM app_settings');
    return stmt.all();
  }

  deleteSetting(key) {
    const stmt = this.db.prepare('DELETE FROM app_settings WHERE key = ?');
    const result = stmt.run(key);
    return result.changes > 0;
  }

  // ==================== BACKUP & RESTORE ====================

  backup(backupPath) {
    return this.db.backup(backupPath);
  }

  exportToJSON() {
    const tenants = this.db.prepare('SELECT * FROM tenants').all();
    const leads = this.db.prepare('SELECT * FROM leads').all();
    const prizes = this.db.prepare('SELECT * FROM prizes_inventory').all();
    
    return {
      version: '1.0',
      exported_at: new Date().toISOString(),
      data: {
        tenants,
        leads,
        prizes
      }
    };
  }

  // ==================== ESTATÍSTICAS ====================

  getStats(tenantId) {
    const totalLeads = this.db.prepare('SELECT COUNT(*) as count FROM leads WHERE tenant_id = ?').get(tenantId).count;
    
    const leadsToday = this.db.prepare(`
      SELECT COUNT(*) as count FROM leads 
      WHERE tenant_id = ? AND DATE(timestamp) = DATE('now')
    `).get(tenantId).count;
    
    const gameStats = this.db.prepare(`
      SELECT game_selected, COUNT(*) as count 
      FROM leads 
      WHERE tenant_id = ? AND game_selected IS NOT NULL
      GROUP BY game_selected
      ORDER BY count DESC
    `).all(tenantId);
    
    return {
      total_leads: totalLeads,
      leads_today: leadsToday,
      games: gameStats
    };
  }

  // ==================== UTILITÁRIOS ====================

  close() {
    if (this.db) {
      this.db.close();
      console.log('✅ Banco de dados fechado');
    }
  }

  vacuum() {
    this.db.exec('VACUUM');
    console.log('✅ Banco de dados otimizado');
  }
}

module.exports = TotemDatabase;

