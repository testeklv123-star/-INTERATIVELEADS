/**
 * Model para operações de leads no banco de dados SQLite local
 */

const db = require('../config/databaseLocal');

/**
 * Cria um novo lead no banco de dados local
 * @param {Object} leadData - Dados do lead
 * @param {string} leadData.name - Nome do lead
 * @param {string} leadData.email - Email do lead
 * @param {string} [leadData.phone] - Telefone do lead (opcional)
 * @returns {Object} Lead criado com ID
 */
function createLead(leadData) {
  const { name, email, phone } = leadData;

  const stmt = db.prepare(`
    INSERT INTO leads (name, email, phone, sync_status)
    VALUES (?, ?, ?, 'PENDING')
  `);

  const result = stmt.run(name, email, phone || null);

  return {
    id: result.lastInsertRowid,
    name,
    email,
    phone,
    created_at: new Date().toISOString(),
    sync_status: 'PENDING',
  };
}

/**
 * Busca todos os leads com status PENDING para sincronização
 * @returns {Array} Lista de leads pendentes
 */
function getPendingLeads() {
  const stmt = db.prepare(`
    SELECT id, name, email, phone, created_at
    FROM leads
    WHERE sync_status = 'PENDING'
    ORDER BY created_at ASC
  `);

  return stmt.all();
}

/**
 * Atualiza o status de sincronização de um lead para SYNCED
 * @param {number} leadId - ID do lead
 */
function markAsSynced(leadId) {
  const stmt = db.prepare(`
    UPDATE leads
    SET sync_status = 'SYNCED', synced_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(leadId);
}

/**
 * Marca um lead como ERROR quando a sincronização falha
 * @param {number} leadId - ID do lead
 * @param {string} errorMessage - Mensagem de erro
 */
function markAsError(leadId, errorMessage) {
  const stmt = db.prepare(`
    UPDATE leads
    SET sync_status = 'ERROR', error_message = ?
    WHERE id = ?
  `);

  stmt.run(errorMessage, leadId);
}

/**
 * Busca todos os leads (para debug/admin)
 * @returns {Array} Lista de todos os leads
 */
function getAllLeads() {
  const stmt = db.prepare(`
    SELECT * FROM leads
    ORDER BY created_at DESC
  `);

  return stmt.all();
}

/**
 * Conta leads por status
 * @returns {Object} Contagem de leads por status
 */
function getLeadsStats() {
  const stmt = db.prepare(`
    SELECT 
      sync_status,
      COUNT(*) as count
    FROM leads
    GROUP BY sync_status
  `);

  const results = stmt.all();
  const stats = {
    PENDING: 0,
    SYNCED: 0,
    ERROR: 0,
  };

  results.forEach((row) => {
    stats[row.sync_status] = row.count;
  });

  return stats;
}

module.exports = {
  createLead,
  getPendingLeads,
  markAsSynced,
  markAsError,
  getAllLeads,
  getLeadsStats,
};

